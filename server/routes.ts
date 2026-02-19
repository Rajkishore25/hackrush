import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { openai } from "./replit_integrations/image/client"; // Re-using openai client from integration
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { mockAnalyzeContent } from "./mockAI";
import Groq from "groq-sdk";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // === API ROUTES ===

  // 1. Create Scan (Analyze)
  app.post(api.scans.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.scans.create.input.parse(req.body);
      const userId = req.user.claims.sub;

      let analysis: any;

      // Check if we have a Groq API key (preferred - free!)
      const hasGroqKey = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_');
      
      // Check if we have a valid OpenAI API key
      const hasOpenAIKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY && 
                          !process.env.AI_INTEGRATIONS_OPENAI_API_KEY.includes('placeholder');

      if (hasGroqKey) {
        // === GROQ AI ANALYSIS (FREE!) ===
        console.log("Using Groq AI for analysis...");
        const systemPrompt = `You are an expert Recruitment Fraud Detection Analyst. 
        Analyze the provided content (email, chat, job description) for scam indicators.
        
        Return a JSON object with:
        - risk_score (0-100 integer)
        - risk_level ("low", "moderate", "high", "critical")
        - flags (array of strings, e.g. "Unrealistic Salary", "Gmail domain")
        - suspicious_phrases (array of objects {text, reason, category})
        - company_verification (object {found: boolean, name: string, trust_score: number, details: string})
        - salary_analysis (object {plausible: boolean, reason: string})
        - summary (string)
        
        If company verification is needed, assume "Not Verified" unless it is a very well known company like Google, Microsoft, etc.`;

        const userPrompt = `Input Type: ${input.inputType}
        Content: 
        ${input.content}`;

        try {
          const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Fast and free Groq model
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: "json_object" }
          });

          const analysisRaw = completion.choices[0]?.message?.content || "{}";
          analysis = JSON.parse(analysisRaw);
          console.log("Groq analysis completed successfully");
        } catch (groqError: any) {
          console.error("Groq API Error:", groqError.message);
          console.log("Falling back to mock analysis...");
          analysis = await mockAnalyzeContent(input.content, input.inputType);
        }
      } else if (hasOpenAIKey) {
        // === OPENAI AI ANALYSIS ===
        console.log("Using OpenAI for analysis...");
        const systemPrompt = `You are an expert Recruitment Fraud Detection Analyst. 
        Analyze the provided content (email, chat, job description) for scam indicators.
        
        Return a JSON object with:
        - risk_score (0-100 integer)
        - risk_level ("low", "moderate", "high", "critical")
        - flags (array of strings, e.g. "Unrealistic Salary", "Gmail domain")
        - suspicious_phrases (array of objects {text, reason, category})
        - company_verification (object {found: boolean, name: string, trust_score: number, details: string})
        - salary_analysis (object {plausible: boolean, reason: string})
        - summary (string)
        
        If company verification is needed, assume "Not Verified" unless it is a very well known company like Google, Microsoft, etc.`;

        const userPrompt = `Input Type: ${input.inputType}
        Content: 
        ${input.content}`;

        try {
          const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
          });

          const analysisRaw = aiResponse.choices[0].message.content || "{}";
          analysis = JSON.parse(analysisRaw);
        } catch (aiError: any) {
          console.error("OpenAI API Error:", aiError.message);
          console.log("Falling back to mock analysis...");
          analysis = await mockAnalyzeContent(input.content, input.inputType);
        }
      } else {
        // === MOCK AI ANALYSIS (No valid API key) ===
        console.log("Using mock AI analysis (no valid API key)");
        analysis = await mockAnalyzeContent(input.content, input.inputType);
      }

      // Save to DB
      const scan = await storage.createScan({
        userId,
        content: input.content,
        inputType: input.inputType,
        riskScore: analysis.risk_score || 0,
        riskLevel: analysis.risk_level || "low",
        analysisResult: analysis
      });

      res.status(201).json(scan);
    } catch (err) {
      console.error("Scan Error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to analyze content" });
    }
  });

  // 2. List Scans
  app.get(api.scans.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const scans = await storage.getUserScans(userId);
    res.json(scans);
  });

  // 3. Get Scan
  app.get(api.scans.get.path, isAuthenticated, async (req: any, res) => {
    const scan = await storage.getScan(Number(req.params.id));
    if (!scan) return res.status(404).json({ message: "Scan not found" });
    
    // Authorization check
    if (scan.userId !== req.user.claims.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    res.json(scan);
  });

  // 4. Generate Report (PDF)
  app.post(api.reports.generate.path, isAuthenticated, async (req: any, res) => {
    const scanId = Number(req.params.id);
    const scan = await storage.getScan(scanId);
    
    if (!scan) return res.status(404).json({ message: "Scan not found" });
    if (scan.userId !== req.user.claims.sub) return res.status(401).json({ message: "Unauthorized" });

    // Ensure public/reports exists
    const reportsDir = path.join(__dirname, "../client/dist/reports"); // Production path (built) or simple public in dev
    // For simplicity in replit dev: server serves static files from client/dist or we can add a specific route.
    // Let's store in a accessible public folder. 
    // Actually, Replit serves 'client/dist' in prod. In dev, vite serves client/public.
    // Let's try to write to a temp folder and stream it, or write to 'client/public/reports' (dev).
    
    // Better approach: Serve via an API route that streams the file, OR write to client/public
    // Writing to client/public allows direct access via URL.
    const publicDir = path.join(process.cwd(), "client/public/reports");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filename = `report-${scanId}-${Date.now()}.pdf`;
    const filePath = path.join(publicDir, filename);
    const writeStream = fs.createWriteStream(filePath);

    const doc = new PDFDocument();
    doc.pipe(writeStream);

    // PDF Content
    doc.fontSize(25).text("JobShield AI - Forensic Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Report ID: ${scanId}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    
    doc.fontSize(18).text(`Risk Level: ${scan.riskLevel?.toUpperCase()}`, {
      align: "center",
      color: scan.riskLevel === "critical" ? "red" : scan.riskLevel === "high" ? "orange" : "green"
    });
    doc.moveDown();
    
    const analysis = scan.analysisResult as any;
    
    doc.fontSize(14).text("Summary");
    doc.fontSize(12).text(analysis.summary || "No summary available.");
    doc.moveDown();

    if (analysis.flags?.length) {
      doc.fontSize(14).text("Red Flags Detected:");
      analysis.flags.forEach((flag: string) => doc.fontSize(12).text(`• ${flag}`));
      doc.moveDown();
    }

    if (analysis.company_verification) {
      doc.fontSize(14).text("Company Verification:");
      doc.fontSize(12).text(`Status: ${analysis.company_verification.found ? "Verified" : "Not Verified"}`);
      if (analysis.company_verification.details) {
        doc.text(`Details: ${analysis.company_verification.details}`);
      }
      doc.moveDown();
    }

    if (analysis.suspicious_phrases?.length) {
      doc.fontSize(14).text("Detected Anomalies & Suspicious Content:");
      analysis.suspicious_phrases.forEach((item: any) => {
        doc.fontSize(12).font('Helvetica-Bold').text(`"${item.text}"`, { indent: 20 });
        doc.fontSize(11).font('Helvetica').text(`Reason: ${item.reason}`, { indent: 40 });
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    if (analysis.salary_analysis) {
      doc.fontSize(14).text("Compensation Analysis:");
      doc.fontSize(12).text(`Result: ${analysis.salary_analysis.plausible ? "Market Aligned" : "Potential Anomaly"}`);
      if (analysis.salary_analysis.reason) {
        doc.text(`Finding: ${analysis.salary_analysis.reason}`);
      }
    }

    doc.end();

    writeStream.on("finish", async () => {
      // Create report record
      const pdfUrl = `/reports/${filename}`;
      await storage.createReport({ scanId, pdfUrl });
      res.status(201).json({ url: pdfUrl });
    });
    
    writeStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to generate PDF" });
    });
  });

  return httpServer;
}
