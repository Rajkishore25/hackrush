import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { useScan, useGenerateReport } from "@/hooks/use-scans";
import { useRoute, useLocation } from "wouter";
import { RiskGauge } from "@/components/scan/RiskGauge";
import { Loader2, ArrowLeft, Download, AlertTriangle, CheckCircle2, XCircle, Building2, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { AnalysisResult } from "@shared/schema";

export default function ScanResult() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/scan/:id");
  const scanId = params ? parseInt(params.id) : 0;
  
  const { data: scan, isLoading: scanLoading } = useScan(scanId);
  const { mutate: generateReport, isPending: generatingReport } = useGenerateReport();

  if (authLoading) return null;
  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  if (scanLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-primary" />
        <span className="font-mono animate-pulse">Retrieving forensic data...</span>
      </div>
    );
  }

  if (!scan) return <div>Scan not found</div>;

  const result = scan.analysisResult as unknown as AnalysisResult;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Navigation */}
        <button 
          onClick={() => setLocation('/')}
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-8 border-b border-border">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold font-display">Forensic Report #{scan.id}</h1>
              <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-mono">
                {format(new Date(scan.createdAt!), "yyyy-MM-dd HH:mm:ss")}
              </span>
            </div>
            <p className="text-muted-foreground">AI analysis of submitted {scan.inputType} content.</p>
          </div>
          
          <button 
            onClick={() => generateReport(scan.id)}
            disabled={generatingReport}
            className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted border border-border rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
          >
            {generatingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download PDF Report
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Gauge */}
          <div className="lg:col-span-1">
            <RiskGauge score={scan.riskScore || 0} level={scan.riskLevel || 'low'} />
          </div>

          {/* Summary */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-border flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Executive Summary
            </h3>
            <p className="text-muted-foreground leading-relaxed flex-1">
              {result.summary || "No summary available for this scan."}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {result.flags.map((flag, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold border border-destructive/20 uppercase tracking-wide">
                  {flag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Company Verification */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              Company Verification
            </h3>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                result.company_verification.found ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {result.company_verification.found ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <div>
                <p className="font-semibold">{result.company_verification.name || "Unknown Entity"}</p>
                <p className="text-sm text-muted-foreground">
                  {result.company_verification.found 
                    ? `Verified Entity (Trust Score: ${result.company_verification.trust_score}%)` 
                    : "Entity could not be verified in global registries."}
                </p>
              </div>
            </div>
            
            {result.company_verification.details && (
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                {result.company_verification.details}
              </p>
            )}
          </div>

          {/* Salary Analysis */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-green-500" />
              Compensation Analysis
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Market Plausibility</span>
                <span className={cn(
                  "font-bold text-sm",
                  result.salary_analysis.plausible ? "text-green-500" : "text-red-500"
                )}>
                  {result.salary_analysis.plausible ? "REALISTIC" : "SUSPICIOUS"}
                </span>
              </div>
              
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className={cn(
                  "h-full rounded-full w-2/3", 
                  result.salary_analysis.plausible ? "bg-green-500" : "bg-red-500"
                )} />
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                {result.salary_analysis.reason || "No salary data detected in the content."}
              </p>
            </div>
          </div>
        </div>

        {/* Suspicious Phrases */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
          <div className="p-6 border-b border-border bg-muted/20">
            <h3 className="text-lg font-semibold">Detected Anomalies</h3>
          </div>
          <div className="divide-y divide-border">
            {result.suspicious_phrases.map((phrase, idx) => (
              <div key={idx} className="p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1 px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-xs font-bold uppercase whitespace-nowrap">
                    {phrase.category}
                  </div>
                  <div>
                    <p className="font-mono text-sm bg-muted inline-block px-2 py-0.5 rounded text-foreground mb-2">
                      "{phrase.text}"
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {phrase.reason}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {result.suspicious_phrases.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No suspicious phrases detected.
              </div>
            )}
          </div>
        </div>

        {/* Raw Content Viewer */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Original Content Analysis</h3>
          <div className="bg-muted/30 rounded-xl p-6 font-mono text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {scan.content}
          </div>
        </div>
      </main>
    </div>
  );
}
