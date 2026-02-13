import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import NewScan from "@/pages/NewScan";
import ScanResult from "@/pages/ScanResult";
import Landing from "@/pages/Landing";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Initializing Secure Session...</div>;
  }

  // If no user, show Landing page for root, but allow specific routes if needed
  if (!user) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        {/* Auth routes are handled by backend redirects mostly, but we keep this clean */}
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/scan/new" component={NewScan} />
      <Route path="/scan/:id" component={ScanResult} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
