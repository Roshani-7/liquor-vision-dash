import { useState } from "react";
import { MapPin, Check, Plus, Calendar, History } from "lucide-react";
import { toast } from "sonner";
import { useStore, store, visitSuggestions, fmtCompactINR, daysBetween } from "@/lib/store";

const priorityBadge: Record<string, string> = {
  high: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
  medium: "bg-warning/10 text-warning ring-1 ring-warning/20",
  low: "bg-success/10 text-success ring-1 ring-success/20",
};

export default function VisitsPage() {
  const suggestions = useStore(s => visitSuggestions(s, 8));
  const visits = useStore(s => s.visits);
  const shops = useStore(s => s.shops);
  const [planned, setPlanned] = useState<number[]>(() => suggestions.slice(0, 5).map(s => s.shop.id));
  const [done, setDone] = useState<number[]>([]);
  const [historyShop, setHistoryShop] = useState<number | null>(null);

  const todaysPlan = planned
    .map(id => suggestions.find(s => s.shop.id === id) || { shop: shops.find(sh => sh.id === id)!, reasons: ["Scheduled"], priority: "low" as const, score: 0, lastVisitDays: 0, monthlySales: 0, pendingOrders: 0 })
    .filter(p => p.shop);

  const checkIn = (shopId: number) => {
    store.addVisit(shopId);
    setDone([...done, shopId]);
    toast.success("Visit checked in", { description: shops.find(s => s.id === shopId)?.name });
  };

  const addToPlan = (shopId: number) => {
    if (planned.includes(shopId)) return toast.error("Already in plan");
    setPlanned([...planned, shopId]);
    toast.success(`Added ${shops.find(s => s.id === shopId)?.name} to plan`);
  };

  const shopVisits = (shopId: number) => visits.filter(v => v.shopId === shopId).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Smart Visit Planner</h1>
        <p className="text-sm text-muted-foreground">Auto-prioritized by sales performance, recency, and pending orders</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's plan */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-card-foreground"><Calendar className="h-4 w-4" /> Today's Plan</h3>
            <span className="text-xs text-muted-foreground">{done.length}/{todaysPlan.length} done</span>
          </div>
          <div className="space-y-2.5">
            {todaysPlan.length === 0 && <p className="text-xs text-muted-foreground py-4 text-center">No visits planned. Add some from suggestions →</p>}
            {todaysPlan.map(p => {
              const isDone = done.includes(p.shop.id);
              return (
                <div key={p.shop.id} className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${isDone ? "border-success/30 bg-success/5" : "border-border bg-muted/30"}`}>
                  <button onClick={() => !isDone && checkIn(p.shop.id)} disabled={isDone}
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border transition-colors ${isDone ? "border-success bg-success text-success-foreground" : "border-border hover:border-primary"}`}>
                    {isDone ? <Check className="h-4 w-4" /> : <MapPin className="h-3.5 w-3.5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isDone ? "line-through text-muted-foreground" : "text-card-foreground"}`}>{p.shop.name}</p>
                    <p className="text-xs text-muted-foreground">{p.shop.area} · {p.reasons[0]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestions */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">AI-Suggested Visits</h3>
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto">
            {suggestions.map(s => (
              <div key={s.shop.id} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-card-foreground">{s.shop.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${priorityBadge[s.priority]}`}>{s.priority}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.reasons.join(" · ")}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">30d sales: {fmtCompactINR(s.monthlySales)}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={() => addToPlan(s.shop.id)} disabled={planned.includes(s.shop.id)}
                    className="rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted-foreground transition-colors">
                    <Plus className="inline h-3 w-3" /> Plan
                  </button>
                  <button onClick={() => setHistoryShop(s.shop.id)}
                    className="rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                    <History className="inline h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visit history modal */}
      {historyShop !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setHistoryShop(null)}>
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-elegant" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-card-foreground">Visit History</h3>
            <p className="text-xs text-muted-foreground mb-4">{shops.find(s => s.id === historyShop)?.name}</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {shopVisits(historyShop).length === 0 && <p className="text-xs text-muted-foreground py-4 text-center">No visits recorded yet</p>}
              {shopVisits(historyShop).map(v => (
                <div key={v.id} className="rounded-lg bg-muted/40 p-3 text-xs">
                  <p className="font-medium text-card-foreground">{new Date(v.date).toLocaleString("en-IN")}</p>
                  <p className="text-muted-foreground">{daysBetween(v.date.split("T")[0])} days ago{v.notes ? ` · ${v.notes}` : ""}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setHistoryShop(null)} className="mt-4 w-full rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
