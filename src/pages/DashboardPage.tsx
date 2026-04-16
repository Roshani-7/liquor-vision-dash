import { IndianRupee, TrendingUp, Store, ShoppingCart, AlertTriangle, Trophy } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesTrendChart } from "@/components/dashboard/SalesTrendChart";
import { AreaPerformanceChart } from "@/components/dashboard/AreaPerformanceChart";
import { ShopContributionChart } from "@/components/dashboard/ShopContributionChart";
import { TargetProgress } from "@/components/dashboard/TargetProgress";
import { TopShops } from "@/components/dashboard/TopShops";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, Area Manager · North Region</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Sales" value="₹1,24,500" change="+12.5% vs yesterday" changeType="positive" icon={IndianRupee} />
        <StatCard title="Weekly Sales" value="₹8,45,200" change="+8.2% vs last week" changeType="positive" icon={TrendingUp} />
        <StatCard title="Active Shops" value="142" change="3 new this month" changeType="neutral" icon={Store} />
        <StatCard title="Pending Orders" value="23" change="5 delayed" changeType="negative" icon={ShoppingCart} />
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
