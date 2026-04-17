import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface T { period: string; target: number; achieved: number; }

const initialTargets: T[] = [
  { period: "Monthly", target: 2500000, achieved: 1845200 },
  { period: "Weekly", target: 625000, achieved: 487000 },
  { period: "Daily", target: 89286, achieved: 124500 },
];

const areaTargets = [
  { area: "North", target: 600000, achieved: 520000 },
  { area: "South", target: 500000, achieved: 380000 },
  { area: "East", target: 450000, achieved: 310000 },
  { area: "West", target: 550000, achieved: 412000 },
  { area: "Central", target: 400000, achieved: 223200 },
];

export default function TargetsPage() {
  const [targets, setTargets] = useState(initialTargets);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<number>(0);

  const startEdit = (t: T) => { setEditing(t.period); setDraft(t.target); };
  const save = (period: string) => {
    setTargets(targets.map(t => t.period === period ? { ...t, target: draft } : t));
    setEditing(null);
    toast.success(`${period} target updated`, { description: `New target: ₹${(draft / 100000).toFixed(1)}L` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Target Management</h1>
        <p className="text-sm text-muted-foreground">Track and manage sales targets</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {targets.map(t => {
          const pct = Math.round((t.achieved / t.target) * 100);
          const isEditing = editing === t.period;
          return (
            <div key={t.period} className="rounded-xl border border-border bg-card p-5 shadow-card-soft hover-lift">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.period} Target</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${pct >= 100 ? "bg-success/10 text-success" : pct >= 70 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                  {pct}%
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-card-foreground">₹{(t.achieved / 100000).toFixed(1)}L</p>
              {isEditing ? (
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">of ₹</span>
                  <input type="number" value={draft} onChange={e => setDraft(+e.target.value)}
                    className="w-24 rounded border border-input bg-background px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                  <button onClick={() => save(t.period)} className="rounded p-1 text-success hover:bg-success/10"><Save className="h-3 w-3" /></button>
                  <button onClick={() => setEditing(null)} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-3 w-3" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-muted-foreground">of ₹{(t.target / 100000).toFixed(1)}L</p>
                  <button onClick={() => startEdit(t)} aria-label="Edit target" className="text-muted-foreground hover:text-primary transition-colors"><Edit2 className="h-3 w-3" /></button>
                </div>
              )}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? "bg-success" : pct >= 70 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Area-wise Target Tracking</h3>
        <div className="space-y-4">
          {areaTargets.map(a => {
            const pct = Math.round((a.achieved / a.target) * 100);
            const gap = a.target - a.achieved;
            return (
              <div key={a.area} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-card-foreground">{a.area}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">₹{(a.achieved / 100000).toFixed(1)}L / ₹{(a.target / 100000).toFixed(1)}L</span>
                    <span className={`font-semibold ${pct >= 80 ? "text-success" : pct >= 60 ? "text-warning" : "text-destructive"}`}>{pct}%</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full gradient-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                {gap > 0 && <p className="text-[11px] text-muted-foreground">Gap: ₹{(gap / 1000).toFixed(0)}K remaining</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
