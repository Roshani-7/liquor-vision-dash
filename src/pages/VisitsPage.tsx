import { MapPin, Clock, TrendingDown, AlertCircle } from "lucide-react";

const suggestions = [
  { shop: "Green Valley Wines", area: "East", reason: "Low sales (₹8,500/mo)", priority: "high", lastVisit: "12 days ago", icon: TrendingDown },
  { shop: "Quick Mart Liquors", area: "South", reason: "Not visited in 15 days", priority: "high", lastVisit: "15 days ago", icon: Clock },
  { shop: "Sagar Wines", area: "North", reason: "Pending complaint", priority: "medium", lastVisit: "6 days ago", icon: AlertCircle },
  { shop: "Diamond Wines", area: "East", reason: "Sales declining 3 weeks", priority: "medium", lastVisit: "8 days ago", icon: TrendingDown },
  { shop: "Star Liquors", area: "South", reason: "Routine follow-up", priority: "low", lastVisit: "3 days ago", icon: MapPin },
];

const priorityBadge = { high: "bg-destructive/10 text-destructive", medium: "bg-warning/10 text-warning", low: "bg-success/10 text-success" };

const todaySchedule = [
  { time: "9:00 AM", shop: "Green Valley Wines", area: "East" },
  { time: "10:30 AM", shop: "Quick Mart Liquors", area: "South" },
  { time: "12:00 PM", shop: "Sagar Wines", area: "North" },
  { time: "2:30 PM", shop: "Diamond Wines", area: "East" },
  { time: "4:00 PM", shop: "Star Liquors", area: "South" },
];

export default function VisitsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Smart Visit Planner</h1>
        <p className="text-sm text-muted-foreground">AI-suggested visits based on sales, timing, and issues</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todaySchedule.map((v, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
                <span className="text-xs font-medium text-primary w-16">{v.time}</span>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">{v.shop}</p>
                  <p className="text-xs text-muted-foreground">{v.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Suggested Visits</h3>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <s.icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-card-foreground">{s.shop}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityBadge[s.priority]}`}>{s.priority}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.reason} · Last visit: {s.lastVisit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
