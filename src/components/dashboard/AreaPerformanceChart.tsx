import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { area: "North", sales: 245000 }, { area: "South", sales: 198000 },
  { area: "East", sales: 167000 }, { area: "West", sales: 312000 },
  { area: "Central", sales: 278000 },
];

export function AreaPerformanceChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-card-foreground">Area Performance</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="area" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Sales"]} />
            <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
