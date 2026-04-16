import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", sales: 42000 }, { day: "Tue", sales: 38000 }, { day: "Wed", sales: 55000 },
  { day: "Thu", sales: 47000 }, { day: "Fri", sales: 62000 }, { day: "Sat", sales: 71000 }, { day: "Sun", sales: 35000 },
];

export function SalesTrendChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-card-foreground">Sales Trend (This Week)</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Sales"]} />
            <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--chart-1))" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
