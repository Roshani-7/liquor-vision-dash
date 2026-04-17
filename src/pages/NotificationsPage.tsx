import { useState } from "react";
import { Bell, TrendingDown, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const initialNotifications = [
  { id: 1, icon: TrendingDown, title: "Low Sales Alert", desc: "East area sales dropped 18% this week — immediate action needed", time: "10 min ago", type: "critical" as const, read: false },
  { id: 2, icon: AlertTriangle, title: "Target Warning", desc: "Monthly target gap widening. Need ₹54,600/day for remaining 12 days", time: "1 hour ago", type: "warning" as const, read: false },
  { id: 3, icon: Clock, title: "Delayed Orders", desc: "5 orders pending for 3+ days — Green Valley Wines, Quick Mart Liquors", time: "2 hours ago", type: "warning" as const, read: false },
  { id: 4, icon: TrendingDown, title: "Shop Performance Drop", desc: "Diamond Wines sales declining for 3 consecutive weeks", time: "5 hours ago", type: "info" as const, read: true },
  { id: 5, icon: CheckCircle, title: "Order Delivered", desc: "Order #1001 for Royal Wine Shop delivered successfully", time: "6 hours ago", type: "success" as const, read: true },
  { id: 6, icon: Bell, title: "Visit Reminder", desc: "12 shops haven't been visited in 15+ days", time: "Yesterday", type: "info" as const, read: true },
];

const typeStyles = {
  critical: "border-l-destructive bg-destructive/5",
  warning: "border-l-warning bg-warning/5",
  success: "border-l-success bg-success/5",
  info: "border-l-primary bg-primary/5",
};

const iconColor = {
  critical: "text-destructive",
  warning: "text-warning",
  success: "text-success",
  info: "text-primary",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    if (unread === 0) {
      toast("Already all read");
      return;
    }
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success(`Marked ${unread} as read`);
  };
  const toggleRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unread} unread notifications</p>
        </div>
        <button onClick={markAllRead}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <button key={n.id} onClick={() => toggleRead(n.id)}
            className={`w-full text-left flex items-start gap-3 rounded-xl border border-border border-l-4 p-4 shadow-card-soft hover:shadow-elegant transition-all ${typeStyles[n.type]} ${n.read ? "opacity-70" : ""}`}>
            <n.icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor[n.type]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-card-foreground">{n.title}</p>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.desc}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
