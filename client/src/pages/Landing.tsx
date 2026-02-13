import { Link } from "wouter";
import { Shield, CheckCircle, Search, Zap, Lock, Globe } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    setLocation("/dashboard"); // Redirect to dashboard if logged in
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 start-0 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2 rtl:space-x-reverse">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="self-center text-xl font-bold font-display tracking-tight whitespace-nowrap">JobShield AI</span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Link href="/api/login">
              <button className="text-white bg-primary hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all shadow-lg shadow-blue-500/20">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            AI-Powered Forensic Analysis
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 pb-2">
            Detect Recruitment Fraud <br /> Before It Happens.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop scammers in their tracks with enterprise-grade NLP analysis, real-time company verification, and risk fusion scoring.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/api/login">
              <button className="px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-1 w-full sm:w-auto">
                Analyze Free Sample
              </button>
            </Link>
            <button className="px-8 py-4 bg-card border border-border text-foreground rounded-xl font-semibold text-lg hover:bg-muted transition-all w-full sm:w-auto">
              View Demo Report
            </button>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden aspect-video flex items-center justify-center bg-slate-900/50">
              {/* Abstract UI Representation */}
              <div className="text-center p-10">
                <Shield className="w-24 h-24 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground font-mono text-sm">SECURE DASHBOARD INTERFACE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-card/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display mb-4">Forensic-Grade Detection</h2>
            <p className="text-muted-foreground">Three layers of defense against sophisticated scams.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "NLP Pattern Matching",
                desc: "Analyzes language patterns, urgency cues, and grammatical inconsistencies common in fraud scripts."
              },
              {
                icon: Globe,
                title: "Entity Verification",
                desc: "Real-time cross-referencing of company details against global business registries and blacklists."
              },
              {
                icon: Zap,
                title: "Risk Fusion Scoring",
                desc: "Combines 50+ signals to generate a single, explainable risk score (0-100) for instant decision making."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-bold mb-8">
            <Lock className="w-4 h-4" />
            Bank-Level Encryption
          </div>
          <h2 className="text-4xl font-bold font-display mb-8">Trusted by Security Teams</h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Acme Corp', 'GlobalBank', 'TechShield', 'CyberGuard', 'NetSecure'].map((brand) => (
              <span key={brand} className="text-2xl font-display font-bold px-6">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold font-display">JobShield AI</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 JobShield AI. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
