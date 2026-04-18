import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useStore, areaPerformance, fmtCompactINR } from "@/lib/store";

export function AreaPerformanceChart() {
  const data = useStore(s => areaPerformance(s, 30));
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
      <h3 className="text-sm font-semibold text-card-foreground">Area Performance (30d vs prior 30d)</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
  );
}
