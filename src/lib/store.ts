import { useEffect, useState } from "react";

export interface Shop {
  id: number;
  name: string;
  area: string;
  category: string;
  contact: string;
  lastVisit: string; // ISO date or "Never"
  performance: "high" | "medium" | "low";
}

export interface Sale {
  id: number;
  date: string; // YYYY-MM-DD
  shopId: number;
  product: string;
  qty: number;
  rate: number;
  total: number;
}

export interface Order {
  id: number;
  shopId: number;
  product: string;
  qty: number;
  amount: number;
  status: "pending" | "approved" | "delivered";
  date: string; // YYYY-MM-DD
}

export interface Visit {
  id: number;
  shopId: number;
  date: string; // ISO datetime
  notes?: string;
}

export interface Expense {
  id: number;
  date: string; // YYYY-MM-DD
  category: "Travel" | "Food" | "Lodging" | "Fuel" | "Other";
  amount: number;
  notes?: string;
  billImage?: string; // data URL of the attached bill photo
}

export interface Targets {
  monthly: number;
  startOfMonth: string; // YYYY-MM-01
  daysInMonth: number;
}

interface State {
  shops: Shop[];
  sales: Sale[];
  orders: Order[];
  visits: Visit[];
  expenses: Expense[];
  targets: Targets;
}

const STORAGE_KEY = "sales-intel-store-v1";
const TODAY = new Date();
const iso = (d: Date) => d.toISOString().split("T")[0];
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return iso(d); };
const minutesAgo = (n: number) => { const d = new Date(); d.setMinutes(d.getMinutes() - n); return d.toISOString(); };

const seedShops: Shop[] = [
  { id: 1, name: "Royal Wine Shop", area: "North", category: "Premium", contact: "9876543210", lastVisit: daysAgo(2), performance: "high" },
  { id: 2, name: "City Beverages", area: "West", category: "Standard", contact: "9876543211", lastVisit: daysAgo(5), performance: "high" },
  { id: 3, name: "Green Valley Wines", area: "East", category: "Small", contact: "9876543212", lastVisit: daysAgo(12), performance: "low" },
  { id: 4, name: "Metro Spirits", area: "Central", category: "Premium", contact: "9876543213", lastVisit: daysAgo(1), performance: "high" },
  { id: 5, name: "Quick Mart Liquors", area: "South", category: "Standard", contact: "9876543214", lastVisit: daysAgo(15), performance: "medium" },
  { id: 6, name: "Star Liquors", area: "South", category: "Standard", contact: "9876543215", lastVisit: daysAgo(3), performance: "medium" },
  { id: 7, name: "Diamond Wines", area: "East", category: "Standard", contact: "9876543216", lastVisit: daysAgo(8), performance: "low" },
  { id: 8, name: "Sagar Wines", area: "North", category: "Standard", contact: "9876543217", lastVisit: daysAgo(6), performance: "medium" },
];

const PRODUCTS = ["Royal Stag", "Blenders Pride", "Imperial Blue", "McDowell's No.1", "Antiquity", "Signature"];
const PRICES: Record<string, number> = { "Royal Stag": 650, "Blenders Pride": 1200, "Imperial Blue": 480, "McDowell's No.1": 500, "Antiquity": 1500, "Signature": 950 };

function seedSales(): Sale[] {
  const out: Sale[] = [];
  let id = 1;
  for (let d = 30; d >= 0; d--) {
    const day = daysAgo(d);
    const count = 3 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const shop = seedShops[Math.floor(Math.random() * seedShops.length)];
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const rate = PRICES[product];
      const perf = shop.performance === "high" ? 1.4 : shop.performance === "medium" ? 1 : 0.5;
      const qty = Math.max(2, Math.round((6 + Math.random() * 30) * perf));
      out.push({ id: id++, date: day, shopId: shop.id, product, qty, rate, total: qty * rate });
    }
  }
  return out;
}

const seedOrders: Order[] = [
  { id: 1001, shopId: 1, product: "Royal Stag (24pc)", qty: 24, amount: 15600, status: "delivered", date: daysAgo(4) },
  { id: 1002, shopId: 2, product: "Blenders Pride (12pc)", qty: 12, amount: 14400, status: "approved", date: daysAgo(2) },
  { id: 1003, shopId: 3, product: "Imperial Blue (36pc)", qty: 36, amount: 17280, status: "pending", date: daysAgo(6) },
  { id: 1004, shopId: 4, product: "McDowell's No.1 (48pc)", qty: 48, amount: 24000, status: "pending", date: daysAgo(3) },
  { id: 1005, shopId: 6, product: "Antiquity (12pc)", qty: 12, amount: 18000, status: "approved", date: daysAgo(1) },
];

const seedVisits: Visit[] = seedShops
  .filter(s => s.lastVisit !== "Never")
  .map((s, i) => ({ id: i + 1, shopId: s.id, date: minutesAgo(60 * 24 * (TODAY.getDate() % 7 + i)), notes: "" }));

function defaultState(): State {
  const startOfMonth = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, "0")}-01`;
  const daysInMonth = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate();
  return {
    shops: seedShops,
    sales: seedSales(),
    orders: seedOrders,
    visits: seedVisits,
    expenses: [],
    targets: { monthly: 2500000, startOfMonth, daysInMonth },
  };
}

let state: State = (() => {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      if (!parsed.expenses) parsed.expenses = [];
      return parsed;
    }
  } catch {}
  const s = defaultState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  return s;
})();

const listeners = new Set<() => void>();
function emit() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  listeners.forEach(l => l());
}

export const store = {
  get: () => state,
  subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); },
  reset() { state = defaultState(); emit(); },

  addShop(input: Omit<Shop, "id" | "lastVisit" | "performance"> & Partial<Pick<Shop, "performance">>) {
    const shop: Shop = { id: Date.now(), lastVisit: "Never", performance: "low", ...input };
    state = { ...state, shops: [...state.shops, shop] };
    emit();
    return shop;
  },
  updateShop(id: number, patch: Partial<Shop>) {
    state = { ...state, shops: state.shops.map(s => s.id === id ? { ...s, ...patch } : s) };
    emit();
  },
  deleteShop(id: number) {
    state = { ...state, shops: state.shops.filter(s => s.id !== id) };
    emit();
  },

  addSale(input: Omit<Sale, "id" | "total" | "date"> & { date?: string }) {
    const sale: Sale = { id: Date.now(), date: input.date ?? iso(new Date()), total: input.qty * input.rate, ...input };
    state = { ...state, sales: [...state.sales, sale] };
    emit();
    return sale;
  },

  addOrder(input: Omit<Order, "id" | "date" | "status"> & { status?: Order["status"]; date?: string }) {
    const order: Order = { id: Date.now(), date: input.date ?? iso(new Date()), status: input.status ?? "pending", ...input };
    state = { ...state, orders: [order, ...state.orders] };
    emit();
    return order;
  },
  updateOrderStatus(id: number, status: Order["status"]) {
    state = { ...state, orders: state.orders.map(o => o.id === id ? { ...o, status } : o) };
    emit();
  },

  addVisit(shopId: number, notes = "") {
    const visit: Visit = { id: Date.now(), shopId, date: new Date().toISOString(), notes };
    state = {
      ...state,
      visits: [visit, ...state.visits],
      shops: state.shops.map(s => s.id === shopId ? { ...s, lastVisit: iso(new Date()) } : s),
    };
    emit();
    return visit;
  },

  setMonthlyTarget(monthly: number) {
    state = { ...state, targets: { ...state.targets, monthly } };
    emit();
  },

  addExpense(input: Omit<Expense, "id" | "date"> & { date?: string }) {
    const expense: Expense = { id: Date.now(), date: input.date ?? iso(new Date()), ...input };
    state = { ...state, expenses: [expense, ...state.expenses] };
    emit();
    return expense;
  },
  deleteExpense(id: number) {
    state = { ...state, expenses: state.expenses.filter(e => e.id !== id) };
    emit();
  },
};

// React hook — re-render when the store changes; selector picks the slice.
export function useStore<T>(selector: (s: State) => T): T {
  const [value, setValue] = useState<T>(() => selector(store.get()));
  useEffect(() => {
    setValue(selector(store.get()));
    const unsub = store.subscribe(() => setValue(selector(store.get())));
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}

// ===== Derived selectors =====
export const fmtINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export const fmtCompactINR = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

export function daysBetween(a: string, b: string = iso(new Date())) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

export function shopSalesTotal(s: State, shopId: number, sinceDays = 30) {
  const cutoff = daysAgo(sinceDays);
  return s.sales.filter(x => x.shopId === shopId && x.date >= cutoff).reduce((sum, x) => sum + x.total, 0);
}

export function lastVisitDays(shop: Shop) {
  return shop.lastVisit === "Never" ? 999 : daysBetween(shop.lastVisit);
}

export interface VisitSuggestion {
  shop: Shop;
  reasons: string[];
  priority: "high" | "medium" | "low";
  score: number;
  lastVisitDays: number;
  monthlySales: number;
  pendingOrders: number;
}

export function visitSuggestions(s: State, limit = 8): VisitSuggestion[] {
  const ranked = s.shops.map(shop => {
    const lvd = lastVisitDays(shop);
    const monthlySales = shopSalesTotal(s, shop.id, 30);
    const pendingOrders = s.orders.filter(o => o.shopId === shop.id && o.status === "pending").length;
    const reasons: string[] = [];
    let score = 0;

    if (lvd >= 10) { reasons.push(`Not visited in ${lvd} days`); score += lvd * 2; }
    else if (lvd >= 5) { reasons.push(`Last visit ${lvd} days ago`); score += lvd; }

    const avgShopSales = s.sales.reduce((a, x) => a + x.total, 0) / Math.max(1, s.shops.length);
    if (monthlySales < avgShopSales * 0.5) { reasons.push(`Low sales (${fmtCompactINR(monthlySales)}/mo)`); score += 25; }
    else if (monthlySales < avgShopSales * 0.8) { reasons.push(`Below-average sales`); score += 12; }

    if (pendingOrders > 0) { reasons.push(`${pendingOrders} pending order${pendingOrders > 1 ? "s" : ""}`); score += pendingOrders * 15; }

    if (reasons.length === 0) reasons.push("Routine follow-up");
    const priority: "high" | "medium" | "low" = score >= 30 ? "high" : score >= 12 ? "medium" : "low";

    return { shop, reasons, priority, score, lastVisitDays: lvd, monthlySales, pendingOrders };
  });
  return ranked.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function targetBreakdown(s: State) {
  const { monthly, daysInMonth } = s.targets;
  const today = new Date();
  const dayOfMonth = today.getDate();
  const daysLeft = Math.max(1, daysInMonth - dayOfMonth + 1);
  const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
  const achieved = s.sales.filter(x => x.date >= monthStart).reduce((a, x) => a + x.total, 0);
  const dailyTarget = monthly / daysInMonth;
  const weeklyTarget = dailyTarget * 7;
  const remaining = Math.max(0, monthly - achieved);
  const requiredPerDay = remaining / daysLeft;
  const todayAchieved = s.sales.filter(x => x.date === iso(today)).reduce((a, x) => a + x.total, 0);
  const weekStart = daysAgo(6);
  const weekAchieved = s.sales.filter(x => x.date >= weekStart).reduce((a, x) => a + x.total, 0);
  return { monthly, achieved, remaining, dailyTarget, weeklyTarget, requiredPerDay, todayAchieved, weekAchieved, daysLeft, dayOfMonth, daysInMonth };
}

export function smartAlerts(s: State) {
  const alerts: { type: "critical" | "warning" | "info"; title: string; desc: string }[] = [];
  const longUnvisited = s.shops.filter(sh => lastVisitDays(sh) >= 10);
  if (longUnvisited.length > 0) alerts.push({
    type: "warning", title: `${longUnvisited.length} shops not visited in 10+ days`,
    desc: longUnvisited.slice(0, 3).map(s => s.name).join(", ") + (longUnvisited.length > 3 ? "…" : ""),
  });

  const delayed = s.orders.filter(o => o.status === "pending" && daysBetween(o.date) >= 3);
  if (delayed.length > 0) alerts.push({
    type: "critical", title: `${delayed.length} orders delayed (3+ days)`,
    desc: "Follow up with shops to confirm delivery dates",
  });

  const tb = targetBreakdown(s);
  const expectedByNow = (tb.monthly / tb.daysInMonth) * tb.dayOfMonth;
  if (tb.achieved < expectedByNow * 0.85) alerts.push({
    type: "critical", title: "Monthly target gap widening",
    desc: `Need ${fmtCompactINR(tb.requiredPerDay)}/day for the next ${tb.daysLeft} days`,
  });

  // Underperforming areas
  const areaTotals = new Map<string, number>();
  s.sales.forEach(x => {
    const shop = s.shops.find(sh => sh.id === x.shopId);
    if (!shop) return;
    areaTotals.set(shop.area, (areaTotals.get(shop.area) ?? 0) + x.total);
  });
  const sortedAreas = [...areaTotals.entries()].sort((a, b) => a[1] - b[1]);
  if (sortedAreas.length > 0) {
    const [worstArea, worstTotal] = sortedAreas[0];
    alerts.push({ type: "info", title: `Lowest performing area: ${worstArea}`, desc: `${fmtCompactINR(worstTotal)} in last 30 days` });
  }

  return alerts;
}

export function salesTrend(s: State, days = 14) {
  const out: { date: string; label: string; sales: number }[] = [];
  for (let d = days - 1; d >= 0; d--) {
    const day = daysAgo(d);
    const total = s.sales.filter(x => x.date === day).reduce((a, x) => a + x.total, 0);
    const date = new Date(day);
    out.push({ date: day, label: `${date.getDate()}/${date.getMonth() + 1}`, sales: total });
  }
  return out;
}

export function areaPerformance(s: State, sinceDays = 30) {
  const cutoff = daysAgo(sinceDays);
  const map = new Map<string, { current: number; previous: number }>();
  s.shops.forEach(sh => map.set(sh.area, map.get(sh.area) ?? { current: 0, previous: 0 }));
  s.sales.forEach(x => {
    const shop = s.shops.find(sh => sh.id === x.shopId);
    if (!shop) return;
    const bucket = map.get(shop.area)!;
    if (x.date >= cutoff) bucket.current += x.total;
    else if (x.date >= daysAgo(sinceDays * 2)) bucket.previous += x.total;
  });
  return [...map.entries()].map(([area, v]) => ({
    area, current: v.current, previous: v.previous,
    growth: v.previous > 0 ? Math.round(((v.current - v.previous) / v.previous) * 100) : 0,
  }));
}

export function productPerformance(s: State, sinceDays = 30) {
  const cutoff = daysAgo(sinceDays);
  const map = new Map<string, number>();
  s.sales.filter(x => x.date >= cutoff).forEach(x => map.set(x.product, (map.get(x.product) ?? 0) + x.total));
  const total = [...map.values()].reduce((a, b) => a + b, 0) || 1;
  return [...map.entries()]
    .map(([name, value]) => ({ name, value, pct: Math.round((value / total) * 100) }))
    .sort((a, b) => b.value - a.value);
}

export function topShops(s: State, limit = 5, sinceDays = 30) {
  return s.shops
    .map(sh => {
      const current = shopSalesTotal(s, sh.id, sinceDays);
      const previous = s.sales.filter(x => x.shopId === sh.id && x.date < daysAgo(sinceDays) && x.date >= daysAgo(sinceDays * 2)).reduce((a, x) => a + x.total, 0);
      const trend = previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;
      return { ...sh, sales: current, trend };
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit);
}

export function dashboardKPIs(s: State) {
  const today = iso(new Date());
  const weekAgo = daysAgo(6);
  const yesterday = daysAgo(1);
  const lastWeekStart = daysAgo(13);
  const todaySales = s.sales.filter(x => x.date === today).reduce((a, x) => a + x.total, 0);
  const yesterdaySales = s.sales.filter(x => x.date === yesterday).reduce((a, x) => a + x.total, 0);
  const weekSales = s.sales.filter(x => x.date >= weekAgo).reduce((a, x) => a + x.total, 0);
  const lastWeekSales = s.sales.filter(x => x.date >= lastWeekStart && x.date < weekAgo).reduce((a, x) => a + x.total, 0);
  const dayChange = yesterdaySales > 0 ? Math.round(((todaySales - yesterdaySales) / yesterdaySales) * 100) : 0;
  const weekChange = lastWeekSales > 0 ? Math.round(((weekSales - lastWeekSales) / lastWeekSales) * 100) : 0;
  const pending = s.orders.filter(o => o.status === "pending").length;
  const delayed = s.orders.filter(o => o.status === "pending" && daysBetween(o.date) >= 3).length;
  return { todaySales, weekSales, dayChange, weekChange, activeShops: s.shops.length, pending, delayed };
}

export const PRODUCT_LIST = PRODUCTS;
export const PRODUCT_PRICES = PRICES;
