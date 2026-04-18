import { AlertTriangle, TrendingDown, Clock, Info } from "lucide-react";
import { useStore, smartAlerts } from "@/lib/store";

const iconFor = { critical: TrendingDown, warning: AlertTriangle, info: Info, success: Clock } as const;
const colorFor = { critical: "text-destructive", warning: "text-warning", info: "text-primary", success: "text-success" } as const;

export function AlertsPanel() {
  const alerts = useStore(smartAlerts);
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
      <h3 className="text-sm font-semibold text-card-foreground">Smart Alerts</h3>
      <div className="mt-4 space-y-3">
        {alerts.length === 0 && <p className="text-xs text-muted-foreground py-4 text-center">All clear — no alerts right now</p>}
        {alerts.map((a, i) => {
          const Icon = iconFor[a.type as keyof typeof iconFor];
          return (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/40 p-3">
              <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${colorFor[a.type as keyof typeof colorFor]}`} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-card-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
