import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatCard } from "@/components/dashboard/StatCard";
import { useScans } from "@/hooks/use-scans";
import { Activity, AlertTriangle, ShieldCheck, Search } from "lucide-react";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: scans, isLoading: scansLoading } = useScans();
  const [, setLocation] = useLocation();

  if (isLoading) return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>;
  if (!isAuthenticated) {
    setLocation("/"); // Redirect to landing if not logged in
    return null;
  }

  // Calculate stats
  const totalScans = scans?.length || 0;
  const highRisk = scans?.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length || 0;
  const verified = scans?.filter(s => s.riskLevel === 'low').length || 0;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold font-display text-foreground">Security Dashboard</h2>
            <p className="text-muted-foreground mt-1">Real-time fraud detection overview</p>
          </div>
          <Link href="/scan/new">
            <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
              New Investigation
            </button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            label="Total Scans" 
            value={totalScans} 
            icon={Activity} 
            trend="+12%" 
            trendUp={true} 
            className="border-l-4 border-l-blue-500"
          />
          <StatCard 
            label="Critical Threats" 
            value={highRisk} 
            icon={AlertTriangle} 
            trend="-5%" 
            trendUp={true} 
            className="border-l-4 border-l-red-500"
          />
          <StatCard 
            label="Verified Safe" 
            value={verified} 
            icon={ShieldCheck} 
            trend="+8%" 
            trendUp={true} 
            className="border-l-4 border-l-green-500"
          />
        </div>

        <section className="glass-panel rounded-2xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              Recent Investigations
            </h3>
            <Link href="/history" className="text-sm text-primary hover:underline">View All</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID / Type</th>
                  <th className="px-6 py-4">Content Preview</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {scansLoading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading recent scans...</td></tr>
                ) : scans?.slice(0, 5).map((scan) => (
                  <tr key={scan.id} className="hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => setLocation(`/scan/${scan.id}`)}>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-muted-foreground">#{scan.id.toString().padStart(4, '0')}</div>
                      <div className="font-medium capitalize text-foreground">{scan.inputType}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-muted-foreground group-hover:text-foreground transition-colors">
                      {scan.content.substring(0, 50)}...
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {scan.createdAt ? format(new Date(scan.createdAt), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        scan.riskLevel === 'critical' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        scan.riskLevel === 'high' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                        scan.riskLevel === 'moderate' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                        "bg-green-500/10 text-green-500 border-green-500/20"
                      )}>
                        {scan.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold">
                      {scan.riskScore}/100
                    </td>
                  </tr>
                ))}
                {scans?.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No investigations yet. Start your first scan!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
