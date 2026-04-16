import { useState } from "react";
import { Package, Clock, CheckCircle, Truck, AlertTriangle } from "lucide-react";

interface Order {
  id: number; shop: string; product: string; qty: number; amount: string;
  status: "pending" | "approved" | "delivered"; date: string; daysOld: number;
}

const initialOrders: Order[] = [
  { id: 1001, shop: "Royal Wine Shop", product: "Royal Stag (24pc)", qty: 24, amount: "₹15,600", status: "delivered", date: "Apr 12", daysOld: 4 },
  { id: 1002, shop: "City Beverages", product: "Blenders Pride (12pc)", qty: 12, amount: "₹14,400", status: "approved", date: "Apr 14", daysOld: 2 },
  { id: 1003, shop: "Green Valley Wines", product: "Imperial Blue (36pc)", qty: 36, amount: "₹17,280", status: "pending", date: "Apr 10", daysOld: 6 },
  { id: 1004, shop: "Metro Spirits", product: "McDowell's No.1 (48pc)", qty: 48, amount: "₹24,000", status: "pending", date: "Apr 13", daysOld: 3 },
  { id: 1005, shop: "Star Liquors", product: "Antiquity (12pc)", qty: 12, amount: "₹18,000", status: "approved", date: "Apr 15", daysOld: 1 },
];

const statusConfig = {
  pending: { icon: Clock, class: "bg-warning/10 text-warning", label: "Pending" },
  approved: { icon: Package, class: "bg-primary/10 text-primary", label: "Approved" },
  delivered: { icon: CheckCircle, class: "bg-success/10 text-success", label: "Delivered" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const delayed = orders.filter(o => o.status === "pending" && o.daysOld > 3);

  const suggestedReorders = [
    { shop: "Royal Wine Shop", product: "Royal Stag", lastQty: 24, avgInterval: "7 days", daysSince: 8 },
    { shop: "Metro Spirits", product: "Imperial Blue", lastQty: 36, avgInterval: "5 days", daysSince: 6 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Order Management</h1>
        <p className="text-sm text-muted-foreground">Track and manage all orders</p>
      </div>

      {delayed.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm font-medium text-card-foreground">{delayed.length} orders delayed (3+ days pending)</p>
            <p className="text-xs text-muted-foreground">{delayed.map(o => o.shop).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "delivered"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">#</th><th className="px-4 py-3 font-medium">Shop</th>
              <th className="px-4 py-3 font-medium">Product</th><th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => {
              const sc = statusConfig[order.status];
              return (
                <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground">{order.id}</td>
                  <td className="px-4 py-3 font-medium text-card-foreground">{order.shop}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.product}</td>
                  <td className="px-4 py-3 text-right text-card-foreground">{order.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${sc.class}`}>
                      <sc.icon className="h-3 w-3" /> {sc.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">🔄 Suggested Repeat Orders</h3>
        <div className="space-y-3">
          {suggestedReorders.map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div>
                <p className="text-sm font-medium text-card-foreground">{s.shop} — {s.product}</p>
                <p className="text-xs text-muted-foreground">Last: {s.lastQty} units · Avg interval: {s.avgInterval} · {s.daysSince} days since last</p>
              </div>
              <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">Create Order</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
