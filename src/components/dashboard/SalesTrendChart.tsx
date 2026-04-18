import { CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, XAxis, YAxis } from "recharts";
import { useStore, salesTrend, fmtCompactINR } from "@/lib/store";

export function SalesTrendChart() {
  const data = useStore(s => salesTrend(s, 14));
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
      <h3 className="text-sm font-semibold text-card-foreground">Sales Trend (14 days)</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => fmtCompactINR(v)} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [fmtCompactINR(v), "Sales"]} />
            <Area type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#salesGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
