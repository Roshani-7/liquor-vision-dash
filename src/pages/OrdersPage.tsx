import { useState } from "react";
import { Package, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useStore, store, fmtINR, daysBetween } from "@/lib/store";

const statusConfig = {
  pending: { icon: Clock, class: "bg-warning/10 text-warning ring-1 ring-warning/20", label: "Pending" },
  approved: { icon: Package, class: "bg-primary/10 text-primary ring-1 ring-primary/20", label: "Approved" },
  delivered: { icon: CheckCircle, class: "bg-success/10 text-success ring-1 ring-success/20", label: "Delivered" },
};

export default function OrdersPage() {
  const orders = useStore(s => s.orders);
  const shops = useStore(s => s.shops);
  const sales = useStore(s => s.sales);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const delayed = orders.filter(o => o.status === "pending" && daysBetween(o.date) >= 3);
  const shopName = (id: number) => shops.find(s => s.id === id)?.name ?? "—";

  const cycleStatus = (id: number) => {
    const o = orders.find(x => x.id === id);
    if (!o) return;
    const next = o.status === "pending" ? "approved" : o.status === "approved" ? "delivered" : "pending";
    store.updateOrderStatus(id, next);
    toast.success(`Order #${o.id} → ${statusConfig[next].label}`);
  };

  // Smart repeat-order suggestions from real sales data
  const suggestedReorders = shops.slice(0, 5).map(shop => {
    const shopSales = sales.filter(s => s.shopId === shop.id).sort((a, b) => b.date.localeCompare(a.date));
    if (shopSales.length < 2) return null;
    const last = shopSales[0];
    const daysSince = daysBetween(last.date);
    if (daysSince < 4) return null;
    return { shop: shop.name, shopId: shop.id, product: last.product, lastQty: last.qty, lastRate: last.rate, daysSince };
  }).filter(Boolean).slice(0, 3) as { shop: string; shopId: number; product: string; lastQty: number; lastRate: number; daysSince: number }[];

  const createReorder = (s: typeof suggestedReorders[number]) => {
    store.addOrder({ shopId: s.shopId, product: `${s.product} (${s.lastQty}pc)`, qty: s.lastQty, amount: s.lastQty * s.lastRate });
    toast.success(`Reorder created for ${s.shop}`, { description: `${s.product} · ${s.lastQty} units · ${fmtINR(s.lastQty * s.lastRate)}` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Order Management</h1>
        <p className="text-sm text-muted-foreground">Track and manage all orders</p>
      </div>

      {delayed.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 animate-fade-in">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-card-foreground">{delayed.length} orders delayed (3+ days pending)</p>
            <p className="text-xs text-muted-foreground">{delayed.map(o => shopName(o.shopId)).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "delivered"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${filter === s ? "gradient-primary text-primary-foreground shadow-elegant" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-semibold">#</th><th className="px-4 py-3 font-semibold">Shop</th>
              <th className="px-4 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold text-right">Amount</th>
              <th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => {
              const sc = statusConfig[order.status];
              return (
                <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground font-mono">{order.id}</td>
                  <td className="px-4 py-3 font-medium text-card-foreground">{shopName(order.shopId)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.product}</td>
                  <td className="px-4 py-3 text-right font-medium text-card-foreground">{fmtINR(order.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => cycleStatus(order.id)} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-opacity hover:opacity-80 ${sc.class}`}>
                      <sc.icon className="h-3 w-3" /> {sc.label}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">🔄 Suggested Repeat Orders</h3>
        {suggestedReorders.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No reorder suggestions right now</p>
        ) : (
          <div className="space-y-3">
            {suggestedReorders.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 p-3 hover:bg-muted/60 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{s.shop} — {s.product}</p>
                  <p className="text-xs text-muted-foreground">Last: {s.lastQty} units · {s.daysSince} days since last sale · ~{fmtINR(s.lastQty * s.lastRate)}</p>
                </div>
                <button onClick={() => createReorder(s)}
                  className="flex-shrink-0 rounded-lg gradient-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition-opacity">Create Order</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
