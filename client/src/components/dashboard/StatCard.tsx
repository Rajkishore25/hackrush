import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn("glass-panel p-6 rounded-2xl relative overflow-hidden group", className)}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-16 h-16" />
      </div>
      
      <div className="relative z-10">
        <div className="p-2 bg-primary/10 w-fit rounded-lg mb-4">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
        
        {trend && (
          <div className="flex items-center gap-2 mt-2">
            <span className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded",
              trendUp 
                ? "bg-green-500/10 text-green-500" 
                : "bg-red-500/10 text-red-500"
            )}>
              {trend}
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
