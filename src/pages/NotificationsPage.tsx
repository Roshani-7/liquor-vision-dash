import { Bell, TrendingDown, AlertTriangle, Clock, CheckCircle } from "lucide-react";

const notifications = [
  { icon: TrendingDown, title: "Low Sales Alert", desc: "East area sales dropped 18% this week — immediate action needed", time: "10 min ago", type: "critical" as const, read: false },
  { icon: AlertTriangle, title: "Target Warning", desc: "Monthly target gap widening. Need ₹54,600/day for remaining 12 days", time: "1 hour ago", type: "warning" as const, read: false },
  { icon: Clock, title: "Delayed Orders", desc: "5 orders pending for 3+ days — Green Valley Wines, Quick Mart Liquors", time: "2 hours ago", type: "warning" as const, read: false },
  { icon: TrendingDown, title: "Shop Performance Drop", desc: "Diamond Wines sales declining for 3 consecutive weeks", time: "5 hours ago", type: "info" as const, read: true },
  { icon: CheckCircle, title: "Order Delivered", desc: "Order #1001 for Royal Wine Shop delivered successfully", time: "6 hours ago", type: "success" as const, read: true },
  { icon: Bell, title: "Visit Reminder", desc: "12 shops haven't been visited in 15+ days", time: "Yesterday", type: "info" as const, read: true },
];

const typeStyles = {
  critical: "border-l-destructive bg-destructive/5",
  warning: "border-l-warning bg-warning/5",
  success: "border-l-success bg-success/5",
  info: "border-l-primary bg-primary/5",
};

export default function NotificationsPage() {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unread} unread notifications</p>
        </div>
        <button className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">Mark all read</button>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-xl border-l-4 p-4 ${typeStyles[n.type]} ${!n.read ? "border border-r border-t border-b border-border" : "border border-r border-t border-b border-transparent"}`}>
            <n.icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${n.type === "critical" ? "text-destructive" : n.type === "warning" ? "text-warning" : n.type === "success" ? "text-success" : "text-primary"}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-card-foreground">{n.title}</p>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.desc}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
