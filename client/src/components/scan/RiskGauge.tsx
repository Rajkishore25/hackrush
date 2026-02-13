import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface RiskGaugeProps {
  score: number;
  level: string;
}

export function RiskGauge({ score, level }: RiskGaugeProps) {
  const data = [
    { name: "Risk", value: score },
    { name: "Safe", value: 100 - score },
  ];

  const getColor = (s: number) => {
    if (s < 30) return "#22c55e"; // Low risk (green)
    if (s < 70) return "#eab308"; // Moderate risk (yellow)
    return "#ef4444";             // High risk (red)
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card rounded-2xl border border-border">
      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell key="risk" fill={color} />
              <Cell key="safe" fill="#1e293b" /> {/* Dark slate background track */}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Centered Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className="text-4xl font-bold font-mono tracking-tighter" style={{ color }}>
            {score}
          </span>
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">
            Risk Score
          </span>
        </div>
      </div>
      
      <div className={cn(
        "mt-4 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border",
        level === "critical" || level === "high" ? "bg-red-500/10 text-red-500 border-red-500/20" :
        level === "moderate" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
        "bg-green-500/10 text-green-500 border-green-500/20"
      )}>
        {level} Risk Detected
      </div>
    </div>
  );
}
