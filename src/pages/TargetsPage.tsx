import { useState } from "react";
import { Edit2, Save, X, Target as TargetIcon } from "lucide-react";
import { toast } from "sonner";
import { useStore, store, targetBreakdown, areaPerformance, fmtCompactINR, fmtINR } from "@/lib/store";

export default function TargetsPage() {
  const tb = useStore(targetBreakdown);
  const areas = useStore(s => areaPerformance(s, 30));
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(tb.monthly);

  const startEdit = () => { setDraft(tb.monthly); setEditing(true); };
  const save = () => {
    if (draft <= 0) return toast.error("Target must be greater than 0");
    store.setMonthlyTarget(draft);
    setEditing(false);
    toast.success("Monthly target updated", { description: `${fmtCompactINR(draft)} · auto-broken into weekly & daily` });
  };

  const monthPct = Math.min(100, Math.round((tb.achieved / tb.monthly) * 100));
  const weekPct = Math.min(100, Math.round((tb.weekAchieved / tb.weeklyTarget) * 100));
  const dayPct = Math.min(100, Math.round((tb.todayAchieved / tb.dailyTarget) * 100));

  const cards = [
    { label: "Monthly", target: tb.monthly, achieved: tb.achieved, pct: monthPct, sub: `Day ${tb.dayOfMonth} of ${tb.daysInMonth}` },
    { label: "Weekly", target: tb.weeklyTarget, achieved: tb.weekAchieved, pct: weekPct, sub: "Last 7 days" },
    { label: "Daily", target: tb.dailyTarget, achieved: tb.todayAchieved, pct: dayPct, sub: "Today" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Target Management</h1>
          <p className="text-sm text-muted-foreground">Set monthly target — weekly & daily auto-derived</p>
        </div>
        {!editing ? (
          <button onClick={startEdit} className="flex items-center gap-2 rounded-lg gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition-opacity">
            <Edit2 className="h-4 w-4" /> Set Monthly Target
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">₹</span>
            <input type="number" value={draft} onChange={e => setDraft(+e.target.value)} autoFocus
              className="w-32 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={save} className="rounded-lg bg-success px-3 py-2 text-success-foreground hover:opacity-90"><Save className="h-4 w-4" /></button>
            <button onClick={() => setEditing(false)} className="rounded-lg border border-border px-3 py-2 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(c => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5 shadow-card-soft hover-lift">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label} Target</p>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${c.pct >= 100 ? "bg-success/10 text-success" : c.pct >= 70 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                {c.pct}%
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-card-foreground">{fmtCompactINR(c.achieved)}</p>
            <p className="text-xs text-muted-foreground">of {fmtCompactINR(c.target)} · {c.sub}</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full transition-all duration-500 ${c.pct >= 100 ? "bg-success" : c.pct >= 70 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${c.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-elegant">
            <TargetIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Required to hit monthly target</p>
            <p className="text-2xl font-bold text-card-foreground">{fmtCompactINR(tb.requiredPerDay)}<span className="text-sm font-normal text-muted-foreground"> / day</span></p>
            <p className="text-xs text-muted-foreground">{fmtINR(tb.remaining)} remaining over {tb.daysLeft} days</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Area Performance (30d)</h3>
        <div className="space-y-4">
          {areas.map(a => (
            <div key={a.area} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-card-foreground">{a.area}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">{fmtCompactINR(a.current)}</span>
                  <span className={`font-semibold ${a.growth >= 0 ? "text-success" : "text-destructive"}`}>{a.growth >= 0 ? "+" : ""}{a.growth}%</span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full gradient-primary transition-all duration-500" style={{ width: `${Math.min(100, (a.current / Math.max(1, Math.max(...areas.map(x => x.current)))) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
