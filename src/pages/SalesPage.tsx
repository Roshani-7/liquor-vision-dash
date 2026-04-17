import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface SalesEntry {
  id: number; date: string; shop: string; product: string; qty: number; rate: number; total: number;
}

const products = ["Royal Stag", "Blenders Pride", "Imperial Blue", "McDowell's No.1", "Antiquity", "Signature"];
const shops = ["Royal Wine Shop", "City Beverages", "Metro Spirits", "Star Liquors", "Quick Mart Liquors"];

export default function SalesPage() {
  const [entries, setEntries] = useState<SalesEntry[]>([
    { id: 1, date: "2026-04-16", shop: "Royal Wine Shop", product: "Royal Stag", qty: 24, rate: 650, total: 15600 },
    { id: 2, date: "2026-04-16", shop: "City Beverages", product: "Blenders Pride", qty: 12, rate: 1200, total: 14400 },
    { id: 3, date: "2026-04-16", shop: "Metro Spirits", product: "Imperial Blue", qty: 36, rate: 480, total: 17280 },
  ]);
  const [form, setForm] = useState({ shop: shops[0], product: products[0], qty: 0, rate: 0 });

  const addEntry = () => {
    if (form.qty <= 0 || form.rate <= 0) {
      toast.error("Quantity and rate must be greater than 0");
      return;
    }
    const total = form.qty * form.rate;
    setEntries([...entries, {
      id: Date.now(), date: new Date().toISOString().split("T")[0],
      shop: form.shop, product: form.product, qty: form.qty, rate: form.rate, total,
    }]);
    toast.success(`Sale recorded`, { description: `${form.shop} · ${form.product} · ₹${total.toLocaleString()}` });
    setForm({ ...form, qty: 0, rate: 0 });
  };

  const grandTotal = entries.reduce((sum, e) => sum + e.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sales Entry</h1>
        <p className="text-sm text-muted-foreground">Record daily sales by shop and product</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">New Entry</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <select value={form.shop} onChange={e => setForm({ ...form, shop: e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {shops.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {products.map(p => <option key={p}>{p}</option>)}
          </select>
          <input type="number" placeholder="Qty" value={form.qty || ""} onChange={e => setForm({ ...form, qty: +e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <input type="number" placeholder="Rate (₹)" value={form.rate || ""} onChange={e => setForm({ ...form, rate: +e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <button onClick={addEntry}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {form.qty > 0 && form.rate > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">Total: ₹{(form.qty * form.rate).toLocaleString()}</p>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Shop</th>
              <th className="px-4 py-3 font-medium">Product</th><th className="px-4 py-3 font-medium text-right">Qty</th>
              <th className="px-4 py-3 font-medium text-right">Rate</th><th className="px-4 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id} className="border-b border-border/50 last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                <td className="px-4 py-3 font-medium text-card-foreground">{e.shop}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.product}</td>
                <td className="px-4 py-3 text-right text-card-foreground">{e.qty}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">₹{e.rate.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-medium text-card-foreground">₹{e.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/30">
              <td colSpan={5} className="px-4 py-3 text-right text-sm font-semibold text-card-foreground">Grand Total</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-primary">₹{grandTotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
