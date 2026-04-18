import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStore, store, daysBetween, shopSalesTotal, fmtCompactINR, type Shop } from "@/lib/store";

const perfBadge = {
  high: "bg-success/10 text-success ring-1 ring-success/20",
  medium: "bg-warning/10 text-warning ring-1 ring-warning/20",
  low: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
};

export default function DistributorsPage() {
  const state = useStore(s => s);
  const shops = state.shops;
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [form, setForm] = useState({ name: "", area: "", category: "Standard", contact: "" });

  const filtered = shops.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.area.toLowerCase().includes(search.toLowerCase()));

  // auto-classify based on actual sales
  const avgSales = shops.reduce((a, sh) => a + shopSalesTotal(state, sh.id, 30), 0) / Math.max(1, shops.length);
  const perfFor = (id: number): "high" | "medium" | "low" => {
    const total = shopSalesTotal(state, id, 30);
    if (total > avgSales * 1.2) return "high";
    if (total > avgSales * 0.6) return "medium";
    return "low";
  };

  const handleSave = () => {
    if (!form.name || !form.area || !form.contact) return toast.error("Please fill all required fields");
    if (editingShop) {
      store.updateShop(editingShop.id, form);
      toast.success(`${form.name} updated`);
    } else {
      store.addShop(form);
      toast.success(`${form.name} added`, { description: `${form.area} · ${form.category}` });
    }
    setForm({ name: "", area: "", category: "Standard", contact: "" });
    setShowForm(false);
    setEditingShop(null);
  };

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop);
    setForm({ name: shop.name, area: shop.area, category: shop.category, contact: shop.contact });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    const shop = shops.find(s => s.id === id);
    store.deleteShop(id);
    toast.success(`Deleted ${shop?.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Distributors</h1>
          <p className="text-sm text-muted-foreground">{shops.length} registered shops · auto-classified by sales</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingShop(null); setForm({ name: "", area: "", category: "Standard", contact: "" }); }}
          className="flex items-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Add Shop
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-card-soft animate-fade-in">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">{editingShop ? "Edit Shop" : "Add New Shop"}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <input placeholder="Shop Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input placeholder="Area" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Premium</option><option>Standard</option><option>Small</option>
            </select>
            <input placeholder="Contact" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} className="rounded-lg gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition-opacity">Save</button>
            <button onClick={() => { setShowForm(false); setEditingShop(null); }} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Search shops..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Shop</th><th className="px-4 py-3 font-semibold">Area</th>
              <th className="px-4 py-3 font-semibold">Category</th><th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Last Visit</th><th className="px-4 py-3 font-semibold text-right">30d Sales</th>
              <th className="px-4 py-3 font-semibold">Performance</th><th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(shop => {
              const perf = perfFor(shop.id);
              const lv = shop.lastVisit === "Never" ? "Never" : `${daysBetween(shop.lastVisit)}d ago`;
              return (
                <tr key={shop.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-card-foreground">{shop.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{shop.area}</td>
                  <td className="px-4 py-3 text-muted-foreground">{shop.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{shop.contact}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lv}</td>
                  <td className="px-4 py-3 text-right text-card-foreground">{fmtCompactINR(shopSalesTotal(state, shop.id, 30))}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${perfBadge[perf]}`}>{perf}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(shop)} aria-label="Edit" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(shop.id)} aria-label="Delete" className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">No shops match "{search}"</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
