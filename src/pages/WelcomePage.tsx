import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Wine, LayoutDashboard, Store, ShoppingCart, FileText, LogOut, TrendingUp, Target, Users } from "lucide-react";
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
    { label: "Today's Sales", value: `₹${kpis.todaySales.toLocaleString("en-IN")}`, icon: TrendingUp, accent: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
    { label: "Monthly Target", value: `${targetPct}%`, icon: Target, accent: "from-sky-500/20 to-sky-500/5", iconColor: "text-sky-400" },
    { label: "Active Distributors", value: String(distributors), icon: Users, accent: "from-indigo-500/20 to-indigo-500/5", iconColor: "text-indigo-300" },
  ];

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/distributors", label: "Distributors", icon: Store },
    { to: "/sales", label: "Sales", icon: ShoppingCart },
    { to: "/reports", label: "Reports", icon: FileText },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[hsl(225,45%,8%)] text-white">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute top-40 -right-40 h-[520px] w-[520px] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 shadow-lg shadow-indigo-500/30">
            <Wine className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight">SalesTrack Pro</p>
            <p className="-mt-0.5 text-[11px] text-white/50">Sales Intelligence Suite</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 backdrop-blur-md md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-[hsl(225,45%,8%)] shadow-md shadow-emerald-500/30">
            S.G.
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white sm:flex"
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
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live • North Region
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            Welcome,{" "}
            <span className="bg-gradient-to-r from-sky-300 via-indigo-200 to-emerald-300 bg-clip-text text-transparent">
              Area Sales Manager
            </span>
            <br />
            Santosh Galande
          </h1>

          <p className="mt-5 max-w-2xl text-base text-white/60 md:text-lg">
            Manage your sales, distributors, and performance efficiently in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <BarChart3 className="h-4 w-4" />
              View Reports
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ animation: "fade-in 0.6s ease-out 0.1s both" }}>
          {stats.map((s) => (
            <div
              key={s.label}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-transform hover:-translate-y-1 hover:border-white/20`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-60`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/60">{s.label}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">{s.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ${s.iconColor}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile nav chips */}
        <div className="mt-10 flex flex-wrap gap-2 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-md hover:bg-white/10"
            >
              <l.icon className="h-3.5 w-3.5" />
              {l.label}
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto max-w-7xl border-t border-white/10 px-5 py-6 md:px-8">
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-white/50 md:flex-row">
          <p>© 2026 SalesTrack Pro</p>
          <p>Designed for efficient sales management</p>
        </div>
      </footer>
    </div>
  );
}
