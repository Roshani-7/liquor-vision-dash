import { useState } from "react";
import { MapPin, Clock, TrendingDown, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";

const initialSuggestions = [
  { id: 1, shop: "Green Valley Wines", area: "East", reason: "Low sales (₹8,500/mo)", priority: "high", lastVisit: "12 days ago", icon: TrendingDown },
  { id: 2, shop: "Quick Mart Liquors", area: "South", reason: "Not visited in 15 days", priority: "high", lastVisit: "15 days ago", icon: Clock },
  { id: 3, shop: "Sagar Wines", area: "North", reason: "Pending complaint", priority: "medium", lastVisit: "6 days ago", icon: AlertCircle },
  { id: 4, shop: "Diamond Wines", area: "East", reason: "Sales declining 3 weeks", priority: "medium", lastVisit: "8 days ago", icon: TrendingDown },
  { id: 5, shop: "Star Liquors", area: "South", reason: "Routine follow-up", priority: "low", lastVisit: "3 days ago", icon: MapPin },
];

const priorityBadge: Record<string, string> = {
  high: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
  medium: "bg-warning/10 text-warning ring-1 ring-warning/20",
  low: "bg-success/10 text-success ring-1 ring-success/20",
};

const initialSchedule = [
  { id: 1, time: "9:00 AM", shop: "Green Valley Wines", area: "East", done: false },
  { id: 2, time: "10:30 AM", shop: "Quick Mart Liquors", area: "South", done: false },
  { id: 3, time: "12:00 PM", shop: "Sagar Wines", area: "North", done: false },
  { id: 4, time: "2:30 PM", shop: "Diamond Wines", area: "East", done: false },
  { id: 5, time: "4:00 PM", shop: "Star Liquors", area: "South", done: false },
];

export default function VisitsPage() {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [schedule, setSchedule] = useState(initialSchedule);

  const toggleDone = (id: number) => {
    setSchedule(schedule.map(v => {
      if (v.id !== id) return v;
      if (!v.done) toast.success(`Visit completed: ${v.shop}`);
      return { ...v, done: !v.done };
    }));
  };

  const addToSchedule = (id: number) => {
    const s = suggestions.find(x => x.id === id);
    if (!s) return;
    if (schedule.some(v => v.shop === s.shop)) {
      toast.error("Already in today's schedule");
      return;
    }
    setSchedule([...schedule, { id: Date.now(), time: "5:30 PM", shop: s.shop, area: s.area, done: false }]);
    toast.success(`Added ${s.shop} to today's plan`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Smart Visit Planner</h1>
        <p className="text-sm text-muted-foreground">AI-suggested visits based on sales, timing, and issues</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">Today's Schedule</h3>
            <span className="text-xs text-muted-foreground">{schedule.filter(v => v.done).length}/{schedule.length} done</span>
          </div>
          <div className="space-y-2.5">
            {schedule.map(v => (
              <div key={v.id} className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${v.done ? "border-success/30 bg-success/5" : "border-border bg-muted/30 hover:bg-muted/50"}`}>
                <button onClick={() => toggleDone(v.id)} aria-label="Mark complete"
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border transition-colors ${v.done ? "border-success bg-success text-success-foreground" : "border-border hover:border-primary"}`}>
                  {v.done && <Check className="h-3.5 w-3.5" />}
                </button>
                <span className="text-xs font-semibold text-primary w-16 flex-shrink-0">{v.time}</span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${v.done ? "line-through text-muted-foreground" : "text-card-foreground"}`}>{v.shop}</p>
                  <p className="text-xs text-muted-foreground">{v.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Suggested Visits</h3>
          <div className="space-y-2.5">
            {suggestions.map(s => (
              <div key={s.id} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
                <s.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-card-foreground">{s.shop}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${priorityBadge[s.priority]}`}>{s.priority}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.reason} · Last visit: {s.lastVisit}</p>
                </div>
                <button onClick={() => addToSchedule(s.id)}
                  className="flex-shrink-0 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors">+ Plan</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
