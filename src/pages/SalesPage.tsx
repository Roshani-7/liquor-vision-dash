import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useStore, store, PRODUCT_LIST, PRODUCT_PRICES, fmtINR } from "@/lib/store";

export default function SalesPage() {
  const shops = useStore(s => s.shops);
  const sales = useStore(s => [...s.sales].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 30));
  const [form, setForm] = useState({ shopId: shops[0]?.id ?? 0, product: PRODUCT_LIST[0], qty: 0, rate: PRODUCT_PRICES[PRODUCT_LIST[0]] });

  const addEntry = () => {
    if (form.qty <= 0 || form.rate <= 0) {
      toast.error("Quantity and rate must be greater than 0");
      return;
    }
    const shop = shops.find(s => s.id === form.shopId);
    store.addSale({ shopId: form.shopId, product: form.product, qty: form.qty, rate: form.rate });
    toast.success("Sale recorded", { description: `${shop?.name} · ${form.product} · ${fmtINR(form.qty * form.rate)}` });
    setForm({ ...form, qty: 0 });
  };

  const onProductChange = (product: string) => setForm({ ...form, product, rate: PRODUCT_PRICES[product] ?? form.rate });

  const grandTotal = sales.reduce((sum, e) => sum + e.total, 0);
  const shopName = (id: number) => shops.find(s => s.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sales Entry</h1>
        <p className="text-sm text-muted-foreground">Record daily sales — totals auto-calculated</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">New Entry</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <select value={form.shopId} onChange={e => setForm({ ...form, shopId: +e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={form.product} onChange={e => onProductChange(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {PRODUCT_LIST.map(p => <option key={p}>{p}</option>)}
          </select>
          <input type="number" placeholder="Qty" value={form.qty || ""} onChange={e => setForm({ ...form, qty: +e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <input type="number" placeholder="Rate (₹)" value={form.rate || ""} onChange={e => setForm({ ...form, rate: +e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <button onClick={addEntry}
            className="flex items-center justify-center gap-2 rounded-lg gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {form.qty > 0 && form.rate > 0 && (
          <p className="mt-3 text-sm font-medium text-primary">Total: {fmtINR(form.qty * form.rate)}</p>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card-soft">
        <div className="border-b border-border bg-muted/30 px-4 py-3">
          <h3 className="text-sm font-semibold text-card-foreground">Recent entries (last 30)</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Shop</th>
              <th className="px-4 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold text-right">Qty</th>
              <th className="px-4 py-3 font-semibold text-right">Rate</th><th className="px-4 py-3 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(e => (
              <tr key={e.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                <td className="px-4 py-3 font-medium text-card-foreground">{shopName(e.shopId)}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.product}</td>
                <td className="px-4 py-3 text-right text-card-foreground">{e.qty}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{fmtINR(e.rate)}</td>
                <td className="px-4 py-3 text-right font-medium text-card-foreground">{fmtINR(e.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/30">
              <td colSpan={5} className="px-4 py-3 text-right text-sm font-semibold text-card-foreground">Total (last 30)</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-primary">{fmtINR(grandTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
