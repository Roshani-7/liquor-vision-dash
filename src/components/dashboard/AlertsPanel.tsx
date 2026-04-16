import { AlertTriangle, TrendingDown, Clock } from "lucide-react";

const alerts = [
  { icon: TrendingDown, text: "East area sales dropped 18% this week", type: "destructive" as const },
  { icon: AlertTriangle, text: "5 orders delayed by 2+ days", type: "warning" as const },
  { icon: Clock, text: "12 shops not visited in 15+ days", type: "warning" as const },
  { icon: TrendingDown, text: "Target gap widening — need ₹54K/day", type: "destructive" as const },
];

export function AlertsPanel() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-card-foreground">Alerts & Warnings</h3>
      <div className="mt-4 space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
            <alert.icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${alert.type === "destructive" ? "text-destructive" : "text-warning"}`} />
            <p className="text-xs text-card-foreground">{alert.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
