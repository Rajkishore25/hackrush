import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { useCreateScan } from "@/hooks/use-scans";
import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2, ShieldQuestion, FileText, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const INPUT_TYPES = [
  { id: 'text', label: 'Raw Text', icon: FileText, desc: 'Paste raw job description or message' },
  { id: 'email', label: 'Email', icon: Mail, desc: 'Analyze suspicious recruitment emails' },
  { id: 'chat', label: 'Chat Log', icon: MessageSquare, desc: 'WhatsApp/Telegram chat history' },
  { id: 'job_desc', label: 'Job Post', icon: ShieldQuestion, desc: 'LinkedIn/Indeed job posting content' },
] as const;

export default function NewScan() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { mutate, isPending } = useCreateScan();
  
  const [inputType, setInputType] = useState<typeof INPUT_TYPES[number]['id']>('text');
  const [content, setContent] = useState("");

  if (authLoading) return null;
  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    mutate({
      content,
      inputType,
    });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <h2 className="text-3xl font-bold font-display">New Investigation</h2>
          <p className="text-muted-foreground mt-2">Submit suspicious content for AI forensic analysis.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Input Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INPUT_TYPES.map((type) => (
              <div
                key={type.id}
                onClick={() => setInputType(type.id)}
                className={cn(
                  "cursor-pointer p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
                  inputType === type.id
                    ? "bg-primary/10 border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/50"
                    : "bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <type.icon className={cn("w-6 h-6 mb-3", inputType === type.id ? "text-primary" : "text-muted-foreground")} />
                <h3 className="font-semibold text-sm mb-1">{type.label}</h3>
                <p className="text-xs opacity-70 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>

          {/* Content Input */}
          <div className="bg-card border border-border rounded-xl p-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Paste the suspicious ${inputType === 'job_desc' ? 'job description' : inputType} here for analysis...`}
              className="w-full h-64 p-6 bg-transparent resize-none focus:outline-none text-base font-mono leading-relaxed placeholder:text-muted-foreground/50"
            />
            <div className="px-4 py-2 bg-muted/30 border-t border-border flex justify-between items-center rounded-b-lg">
              <span className="text-xs text-muted-foreground font-mono">
                {content.length} characters
              </span>
              <span className="text-xs text-muted-foreground">
                AI Model: <span className="text-primary font-semibold">FinGuard v2.4</span>
              </span>
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className={cn(
                "px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300",
                isPending || !content.trim()
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-blue-600 hover:to-blue-500 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Pattern Signatures...
                </>
              ) : (
                <>
                  <ShieldQuestion className="w-5 h-5" />
                  Analyze For Fraud
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
