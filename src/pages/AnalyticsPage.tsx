import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

const areaData = [
  { area: "North", current: 520000, previous: 480000 },
  { area: "South", current: 380000, previous: 410000 },
  { area: "East", current: 310000, previous: 350000 },
  { area: "West", current: 412000, previous: 390000 },
  { area: "Central", current: 223200, previous: 260000 },
];

const productData = [
  { name: "Royal Stag", value: 30 }, { name: "Blenders Pride", value: 22 },
  { name: "Imperial Blue", value: 20 }, { name: "McDowell's", value: 18 }, { name: "Others", value: 10 },
];

const growthData = [
  { month: "Nov", sales: 1800000 }, { month: "Dec", sales: 2100000 }, { month: "Jan", sales: 1950000 },
  { month: "Feb", sales: 2200000 }, { month: "Mar", sales: 2400000 }, { month: "Apr", sales: 1845200 },
];

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Advanced Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep insights into sales performance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Area Comparison (Current vs Previous)</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="area" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, ""]} />
                <Bar dataKey="current" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Current" />
                <Bar dataKey="previous" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Previous" />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Product-wise Sales</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={productData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {productData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground">Growth Trend (6 Months)</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `₹${v / 100000}L`} />
              <Tooltip formatter={(v: number) => [`₹${(v / 100000).toFixed(1)}L`, "Sales"]} />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
