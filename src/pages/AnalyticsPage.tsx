import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { useStore, areaPerformance, productPerformance, salesTrend, fmtCompactINR } from "@/lib/store";
import { TrendingUp, TrendingDown } from "lucide-react";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(243 50% 70%)"];

const periods = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 30 }, // capped — seed is 30 days
];

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const areas = useStore(s => areaPerformance(s, days));
  const products = useStore(s => productPerformance(s, days));
  const trend = useStore(s => salesTrend(s, Math.min(days, 30)));

  const totalGrowth = areas.reduce((sum, a) => sum + a.growth, 0) / Math.max(1, areas.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Advanced Analytics</h1>
          <p className="text-sm text-muted-foreground">Deep insights into sales performance</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          {periods.map(p => (
            <button key={p.label} onClick={() => setDays(p.days)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${days === p.days ? "gradient-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground"}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Avg Area Growth</p>
          <p className={`mt-2 text-2xl font-bold ${totalGrowth >= 0 ? "text-success" : "text-destructive"}`}>{totalGrowth >= 0 ? "+" : ""}{totalGrowth.toFixed(1)}%</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            {totalGrowth >= 0 ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
            vs prior period
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Top Area</p>
          <p className="mt-2 text-2xl font-bold text-card-foreground">{[...areas].sort((a, b) => b.current - a.current)[0]?.area ?? "—"}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{fmtCompactINR([...areas].sort((a, b) => b.current - a.current)[0]?.current ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Top Product</p>
          <p className="mt-2 text-2xl font-bold text-card-foreground">{products[0]?.name ?? "—"}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{products[0]?.pct ?? 0}% share</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
          <h3 className="text-sm font-semibold text-card-foreground">Area Comparison</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areas}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="area" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => fmtCompactINR(v)} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [fmtCompactINR(v), ""]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="previous" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Previous" />
                <Bar dataKey="current" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Current" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
          <h3 className="text-sm font-semibold text-card-foreground">Product / Brand Mix</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={products} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" nameKey="name">
                  {products.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number, _n, p: any) => [`${p.payload.pct}% (${fmtCompactINR(v)})`, p.payload.name]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
        <h3 className="text-sm font-semibold text-card-foreground">Growth Trend</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => fmtCompactINR(v)} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [fmtCompactINR(v), "Sales"]} />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-3))" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
