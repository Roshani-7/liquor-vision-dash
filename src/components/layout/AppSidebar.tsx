import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Store, ShoppingCart, ClipboardList,
  MapPin, Target, BarChart3, FileText, Bell, X, Wine, Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/distributors", icon: Store, label: "Distributors" },
  { to: "/sales", icon: ShoppingCart, label: "Sales Entry" },
  { to: "/orders", icon: ClipboardList, label: "Orders" },
  { to: "/visits", icon: MapPin, label: "Visit Planner" },
  { to: "/targets", icon: Target, label: "Targets" },
  { to: "/expenses", icon: Wallet, label: "Expenses" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/reports", icon: FileText, label: "Reports" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar transition-transform duration-300 md:static md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Wine className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-sidebar-accent-foreground">Sales Intel</h1>
          <p className="text-xs text-sidebar-muted">Area Manager</p>
        </div>
        <button onClick={onClose} className="ml-auto md:hidden text-sidebar-muted hover:text-sidebar-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
            AM
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-accent-foreground">Area Manager</p>
            <p className="text-xs text-sidebar-muted">North Region</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
