import { useStore, targetBreakdown, fmtCompactINR, fmtINR } from "@/lib/store";

export function TargetProgress() {
  const tb = useStore(targetBreakdown);
  const pct = Math.min(100, Math.round((tb.achieved / tb.monthly) * 100));

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-foreground">Monthly Target Progress</h3>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{pct}%</span>
      </div>
      <div className="mt-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full gradient-primary transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Achieved: {fmtCompactINR(tb.achieved)}</span>
          <span>Target: {fmtCompactINR(tb.monthly)}</span>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-muted/40 p-3">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">To hit target</p>
          <p className="text-lg font-bold text-card-foreground">{fmtCompactINR(tb.requiredPerDay)}/day</p>
          <p className="text-xs text-muted-foreground">for the next {tb.daysLeft} days</p>
        </div>
        <div className="rounded-lg bg-muted/40 p-3">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Remaining</p>
          <p className="text-lg font-bold text-card-foreground">{fmtCompactINR(tb.remaining)}</p>
          <p className="text-xs text-muted-foreground">Today: {fmtINR(tb.todayAchieved)}</p>
        </div>
      </div>
    </div>
  );
}
