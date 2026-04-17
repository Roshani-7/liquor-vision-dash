import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Shop {
  id: number; name: string; area: string; category: string; contact: string;
  lastVisit: string; lastOrder: string; performance: "high" | "medium" | "low";
}

const initialShops: Shop[] = [
  { id: 1, name: "Royal Wine Shop", area: "North", category: "Premium", contact: "9876543210", lastVisit: "2 days ago", lastOrder: "₹45,000", performance: "high" },
  { id: 2, name: "City Beverages", area: "West", category: "Standard", contact: "9876543211", lastVisit: "5 days ago", lastOrder: "₹32,000", performance: "high" },
  { id: 3, name: "Green Valley Wines", area: "East", category: "Small", contact: "9876543212", lastVisit: "12 days ago", lastOrder: "₹8,500", performance: "low" },
  { id: 4, name: "Metro Spirits", area: "Central", category: "Premium", contact: "9876543213", lastVisit: "1 day ago", lastOrder: "₹67,000", performance: "high" },
  { id: 5, name: "Quick Mart Liquors", area: "South", category: "Standard", contact: "9876543214", lastVisit: "8 days ago", lastOrder: "₹15,200", performance: "medium" },
  { id: 6, name: "Star Liquors", area: "South", category: "Standard", contact: "9876543215", lastVisit: "3 days ago", lastOrder: "₹28,000", performance: "medium" },
];

const perfBadge = { high: "bg-success/10 text-success ring-1 ring-success/20", medium: "bg-warning/10 text-warning ring-1 ring-warning/20", low: "bg-destructive/10 text-destructive ring-1 ring-destructive/20" };

export default function DistributorsPage() {
  const [shops, setShops] = useState(initialShops);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [form, setForm] = useState({ name: "", area: "", category: "Standard", contact: "" });

  const filtered = shops.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.area.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (!form.name || !form.area || !form.contact) {
      toast.error("Please fill all required fields");
      return;
    }
    if (editingShop) {
      setShops(shops.map(s => s.id === editingShop.id ? { ...s, ...form } : s));
      toast.success(`${form.name} updated`);
    } else {
      setShops([...shops, { ...form, id: Date.now(), lastVisit: "Never", lastOrder: "—", performance: "low" as const }]);
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
    setShops(shops.filter(s => s.id !== id));
    toast.success(`Deleted ${shop?.name}`, { description: "Shop removed from your distributor list" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Distributors</h1>
          <p className="text-sm text-muted-foreground">{shops.length} registered shops</p>
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
              <th className="px-4 py-3 font-semibold">Last Visit</th><th className="px-4 py-3 font-semibold">Last Order</th>
              <th className="px-4 py-3 font-semibold">Performance</th><th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(shop => (
              <tr key={shop.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{shop.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{shop.area}</td>
                <td className="px-4 py-3 text-muted-foreground">{shop.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{shop.contact}</td>
                <td className="px-4 py-3 text-muted-foreground">{shop.lastVisit}</td>
                <td className="px-4 py-3 text-card-foreground">{shop.lastOrder}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${perfBadge[shop.performance]}`}>{shop.performance}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(shop)} aria-label="Edit" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(shop.id)} aria-label="Delete" className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">No shops match "{search}"</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
