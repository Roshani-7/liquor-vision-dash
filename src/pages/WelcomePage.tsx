import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Wine, LayoutDashboard, Store, ShoppingCart, FileText, LogOut, TrendingUp, Target, Users, MapPin, Bell, Wallet, ClipboardList } from "lucide-react";
import { useStore, dashboardKPIs } from "@/lib/store";

export default function WelcomePage() {
  const kpis = useStore(dashboardKPIs);
  const distributors = useStore((s) => s.shops.length);
  const monthlyTarget = useStore((s) => s.targets.monthly);
  const monthSales = useStore((s) => {
    const start = s.targets.startOfMonth;
    return s.sales.filter((x) => x.date >= start).reduce((a, x) => a + x.total, 0);
  });
  const targetPct = monthlyTarget > 0 ? Math.min(100, Math.round((monthSales / monthlyTarget) * 100)) : 0;

  const stats = [
    { label: "Today's Sales", value: `₹${kpis.todaySales.toLocaleString("en-IN")}`, icon: TrendingUp, ring: "ring-emerald-100", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Monthly Target", value: `${targetPct}%`, icon: Target, ring: "ring-sky-100", iconBg: "bg-sky-50", iconColor: "text-sky-600" },
    { label: "Active Distributors", value: String(distributors), icon: Users, ring: "ring-indigo-100", iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
  ];

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/distributors", label: "Distributors", icon: Store },
    { to: "/sales", label: "Sales", icon: ShoppingCart },
    { to: "/reports", label: "Reports", icon: FileText },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Soft background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-[480px] w-[480px] rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute top-32 -right-40 h-[520px] w-[520px] rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-emerald-200/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-md shadow-indigo-200">
            <Wine className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight text-slate-900">SalesTrack Pro</p>
            <p className="-mt-0.5 text-[11px] text-slate-500">Sales Intelligence Suite</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-2 py-1.5 shadow-sm backdrop-blur-md md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-200">
            S.G.
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-xs font-medium text-slate-600 backdrop-blur-md transition-colors hover:bg-white hover:text-slate-900 sm:flex"
            aria-label="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 md:px-8 md:pt-16">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live • North Region
          </span>

          <p className="mt-5 text-sm font-medium uppercase tracking-[0.2em] text-slate-500 md:text-base">
            Welcome, Area Sales Manager
          </p>
          <h1 className="mt-2 text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-7xl">
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Sales Intelligence System
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base text-slate-600 md:text-lg">
            Manage your sales, distributors, and performance efficiently in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-transform hover:-translate-y-0.5"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
            >
              <BarChart3 className="h-4 w-4" />
              View Reports
            </Link>
          </div>
        </div>


        {/* All Features */}
        <section className="mt-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Everything you need</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">All features at a glance</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { to: "/dashboard", label: "Dashboard", desc: "KPIs, trends & live snapshot", icon: LayoutDashboard, bg: "bg-indigo-50", color: "text-indigo-600" },
              { to: "/distributors", label: "Distributors", desc: "Manage shops & contacts", icon: Store, bg: "bg-sky-50", color: "text-sky-600" },
              { to: "/sales", label: "Sales Entry", desc: "Log daily sales quickly", icon: ShoppingCart, bg: "bg-emerald-50", color: "text-emerald-600" },
              { to: "/orders", label: "Orders", desc: "Track pending & delivered", icon: ClipboardList, bg: "bg-amber-50", color: "text-amber-600" },
              { to: "/visits", label: "Visit Planner", desc: "Smart shop suggestions", icon: MapPin, bg: "bg-rose-50", color: "text-rose-600" },
              { to: "/targets", label: "Targets", desc: "Monthly goals & progress", icon: Target, bg: "bg-violet-50", color: "text-violet-600" },
              { to: "/expenses", label: "Expenses", desc: "Travel & daily expense log", icon: Wallet, bg: "bg-teal-50", color: "text-teal-600" },
              { to: "/analytics", label: "Analytics", desc: "Deep insights & charts", icon: BarChart3, bg: "bg-cyan-50", color: "text-cyan-600" },
              { to: "/reports", label: "Reports", desc: "PDF & WhatsApp share", icon: FileText, bg: "bg-fuchsia-50", color: "text-fuchsia-600" },
              { to: "/notifications", label: "Notifications", desc: "Alerts & reminders", icon: Bell, bg: "bg-orange-50", color: "text-orange-600" },
            ].map((f) => (
              <Link
                key={f.to}
                to={f.to}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-900">{f.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{f.desc}</p>
                <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-slate-300 transition-all group-hover:right-3 group-hover:text-slate-600" />
              </Link>
            ))}
          </div>
        </section>


        <div className="mt-10 flex flex-wrap gap-2 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <l.icon className="h-3.5 w-3.5" />
              {l.label}
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto max-w-7xl border-t border-slate-200 px-5 py-6 md:px-8">
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-slate-500 md:flex-row">
          <p>© 2026 SalesTrack Pro</p>
          <p>Designed for efficient sales management</p>
        </div>
      </footer>
    </div>
  );
}
