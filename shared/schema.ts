import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

// Re-export auth and chat models so they are picked up by drizzle-kit
export * from "./models/auth";
export * from "./models/chat";

// === TABLE DEFINITIONS ===

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  inputType: text("input_type", { enum: ["text", "email", "chat", "job_desc"] }).notNull(),
  
  // AI Analysis Results
  riskScore: integer("risk_score").default(0), // 0-100
  riskLevel: text("risk_level", { enum: ["low", "moderate", "high", "critical"] }).default("low"),
  
  // JSONB for flexible storage of detailed analysis
  // Structure: { 
  //   flags: string[], 
  //   company_verification: { found: boolean, details: any },
  //   salary_analysis: { plausible: boolean, reason: string },
  //   suspicious_phrases: { text: string, reason: string }[] 
  // }
  analysisResult: jsonb("analysis_result").default({}), 
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  scanId: integer("scan_id").notNull().references(() => scans.id),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const scansRelations = relations(scans, ({ one, many }) => ({
  user: one(users, {
    fields: [scans.userId],
    references: [users.id],
  }),
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  scan: one(scans, {
    fields: [reports.scanId],
    references: [scans.id],
  }),
}));

// === BASE SCHEMAS ===
export const insertScanSchema = createInsertSchema(scans).omit({ 
  id: true, 
  userId: true, 
  createdAt: true, 
  riskScore: true, 
  riskLevel: true, 
  analysisResult: true 
});

// === EXPLICIT API CONTRACT TYPES ===

export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;

// Request types
export type CreateScanRequest = InsertScan;

// Response types
export type ScanResponse = Scan;
export type ScansListResponse = Scan[];

export interface AnalysisResult {
  flags: string[];
  company_verification: {
    found: boolean;
    name?: string;
    details?: string;
    trust_score?: number;
  };
  salary_analysis: {
    plausible: boolean;
    deviation?: string;
    reason?: string;
  };
  suspicious_phrases: Array<{
    text: string;
    reason: string;
    category: string;
  }>;
  summary: string;
}
