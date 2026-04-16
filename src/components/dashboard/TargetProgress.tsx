export function TargetProgress() {
  const monthly = { target: 2500000, achieved: 1845200 };
  const pct = Math.round((monthly.achieved / monthly.target) * 100);
  const daysLeft = 12;
  const dailyRequired = Math.round((monthly.target - monthly.achieved) / daysLeft);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-foreground">Monthly Target Progress</h3>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{pct}%</span>
      </div>
      <div className="mt-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Achieved: ₹{(monthly.achieved / 100000).toFixed(1)}L</span>
          <span>Target: ₹{(monthly.target / 100000).toFixed(1)}L</span>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">To hit target, you need</p>
        <p className="text-lg font-semibold text-card-foreground">₹{dailyRequired.toLocaleString()}/day</p>
        <p className="text-xs text-muted-foreground">for the next {daysLeft} days</p>
      </div>
    </div>
  );
}
