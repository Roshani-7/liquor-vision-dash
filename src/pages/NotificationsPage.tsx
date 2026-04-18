import { useState } from "react";
import { Bell, TrendingDown, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { useStore, smartAlerts } from "@/lib/store";

const typeStyles = {
  critical: "border-l-destructive bg-destructive/5",
  warning: "border-l-warning bg-warning/5",
  info: "border-l-primary bg-primary/5",
};
const iconFor = { critical: TrendingDown, warning: AlertTriangle, info: Info };
const iconColor = { critical: "text-destructive", warning: "text-warning", info: "text-primary" };

export default function NotificationsPage() {
  const live = useStore(smartAlerts);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const items = live.map((a, i) => ({ ...a, id: `${a.type}-${i}-${a.title}` }));
  const unread = items.filter(n => !readIds.has(n.id)).length;

  const markAllRead = () => {
    if (unread === 0) return toast("Already all read");
    setReadIds(new Set(items.map(i => i.id)));
    toast.success(`Marked ${unread} as read`);
  };
  const toggle = (id: string) => {
    const next = new Set(readIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setReadIds(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unread} unread · powered by your live data</p>
        </div>
        <button onClick={markAllRead}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card-soft">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">All clear — no alerts at the moment</p>
          </div>
        )}
        {items.map(n => {
          const Icon = iconFor[n.type];
          const isRead = readIds.has(n.id);
          return (
            <button key={n.id} onClick={() => toggle(n.id)}
              className={`w-full text-left flex items-start gap-3 rounded-xl border border-border border-l-4 p-4 shadow-card-soft hover:shadow-elegant transition-all ${typeStyles[n.type]} ${isRead ? "opacity-60" : ""}`}>
              <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor[n.type]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-card-foreground">{n.title}</p>
                  {!isRead && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
