import { Link, useLocation } from "@tanstack/react-router";
import { Home, TrendingUp, PieChart, Bell, User } from "lucide-react";

const tabs = [
  {
    to: "/app",
    label: "Home",
    icon: Home,
    exact: true,
    activeText: "text-emerald-600",
    activeBg: "bg-gradient-to-br from-emerald-100 to-teal-100",
    activeRing: "ring-emerald-200",
    fill: "text-emerald-500",
  },
  {
    to: "/invest",
    label: "Invest",
    icon: TrendingUp,
    exact: false,
    activeText: "text-blue-600",
    activeBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
    activeRing: "ring-blue-200",
    fill: "text-blue-500",
  },
  {
    to: "/portfolio",
    label: "Portfolio",
    icon: PieChart,
    exact: true,
    activeText: "text-fuchsia-600",
    activeBg: "bg-gradient-to-br from-fuchsia-100 to-purple-100",
    activeRing: "ring-fuchsia-200",
    fill: "text-fuchsia-500",
  },
  {
    to: "/alerts",
    label: "Alerts",
    icon: Bell,
    exact: true,
    activeText: "text-amber-600",
    activeBg: "bg-gradient-to-br from-amber-100 to-orange-100",
    activeRing: "ring-amber-200",
    fill: "text-amber-500",
  },
  {
    to: "/profile",
    label: "Profile",
    icon: User,
    exact: true,
    activeText: "text-rose-600",
    activeBg: "bg-gradient-to-br from-rose-100 to-pink-100",
    activeRing: "ring-rose-200",
    fill: "text-rose-500",
  },
] as const;

export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[420px] -translate-x-1/2 border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="grid grid-cols-5 px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {tabs.map(({ to, label, icon: Icon, exact, activeText, activeBg, activeRing, fill }) => {
          const active = exact ? path === to : path.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 rounded-lg py-1 transition-colors"
            >
              <div
                className={`flex h-9 w-12 items-center justify-center rounded-full transition-all ${
                  active ? `${activeBg} ring-1 ${activeRing} shadow-sm` : ""
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-all ${
                    active ? fill : "text-muted-foreground"
                  }`}
                  strokeWidth={active ? 2.4 : 1.8}
                  fill={active ? "currentColor" : "none"}
                  fillOpacity={active ? 0.18 : 0}
                />
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  active ? activeText : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
