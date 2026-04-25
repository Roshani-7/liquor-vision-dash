import { Menu, Search, Moon, Sun, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

interface TopNavbarProps {
  onMenuClick: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    toast.success(`Searching for "${query}"`, { description: "Showing matches across shops, orders, and products" });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur md:px-6">
      <button onClick={onMenuClick} aria-label="Open menu" className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 md:hidden">
        <img src={logo} alt="Sales Intel" width={28} height={28} className="h-7 w-7 object-contain" />
        <span className="text-sm font-semibold text-foreground">Sales Intel</span>
      </div>

      <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shops, orders, products..."
          className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
      </form>

      <button
        onClick={() => navigate("/notifications")}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
      </button>

      <button
        onClick={() => { setDark(!dark); toast(dark ? "Light mode" : "Dark mode"); }}
        aria-label="Toggle theme"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </header>
  );
}
