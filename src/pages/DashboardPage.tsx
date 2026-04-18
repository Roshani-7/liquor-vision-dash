import { IndianRupee, TrendingUp, Store, ShoppingCart } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesTrendChart } from "@/components/dashboard/SalesTrendChart";
import { AreaPerformanceChart } from "@/components/dashboard/AreaPerformanceChart";
import { ShopContributionChart } from "@/components/dashboard/ShopContributionChart";
import { TargetProgress } from "@/components/dashboard/TargetProgress";
import { TopShops } from "@/components/dashboard/TopShops";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { useStore, dashboardKPIs, fmtCompactINR } from "@/lib/store";

export default function DashboardPage() {
  const k = useStore(dashboardKPIs);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, Area Manager · North Region</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Sales" value={fmtCompactINR(k.todaySales)} change={`${k.dayChange >= 0 ? "+" : ""}${k.dayChange}% vs yesterday`} changeType={k.dayChange >= 0 ? "positive" : "negative"} icon={IndianRupee} />
        <StatCard title="Weekly Sales" value={fmtCompactINR(k.weekSales)} change={`${k.weekChange >= 0 ? "+" : ""}${k.weekChange}% vs last week`} changeType={k.weekChange >= 0 ? "positive" : "negative"} icon={TrendingUp} />
        <StatCard title="Active Shops" value={String(k.activeShops)} change="Total registered" changeType="neutral" icon={Store} />
        <StatCard title="Pending Orders" value={String(k.pending)} change={k.delayed > 0 ? `${k.delayed} delayed` : "On track"} changeType={k.delayed > 0 ? "negative" : "neutral"} icon={ShoppingCart} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TargetProgress />
        </div>
        <AlertsPanel />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SalesTrendChart />
        <AreaPerformanceChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ShopContributionChart />
        <div className="lg:col-span-2">
          <TopShops />
        </div>
      </div>
    </div>
  );
}
