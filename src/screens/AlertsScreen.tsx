import { AppShell } from "@/components/AppShell";
import { formatKES } from "@/lib/products";
import { Bell, TrendingUp, Wallet, Gift, ShieldCheck } from "lucide-react";

const groups = [
  {
    label: "Today",
    items: [
      { icon: Wallet, color: "bg-emerald-100 text-emerald-700", t: "Pesa Plus payout received", s: "Your daily yield credited", v: 420, time: "9:14 AM" },
      { icon: TrendingUp, color: "bg-blue-100 text-blue-700", t: "KCB Wekeza interest", s: "Compounded daily interest", v: 218, time: "7:00 AM" },
    ],
  },
  {
    label: "Yesterday",
    items: [
      { icon: Gift, color: "bg-amber-100 text-amber-700", t: "Referral bonus earned", s: "Your friend Mary just joined!", v: 150, time: "6:32 PM" },
      { icon: Bell, color: "bg-purple-100 text-purple-700", t: "Hisa dividend posted", s: "Quarterly Safaricom dividend", v: 820, time: "10:05 AM" },
    ],
  },
  {
    label: "This Week",
    items: [
      { icon: ShieldCheck, color: "bg-emerald-100 text-emerald-700", t: "Account security enabled", s: "Two-layer account protection active.", v: 0, time: "Mon" },
      { icon: TrendingUp, color: "bg-blue-100 text-blue-700", t: "Goal milestone: 60% reached", s: "School Fees Goal is on track", v: 0, time: "Sun" },
    ],
  },
];

export function AlertsScreen() {
  return (
    <AppShell>
      <header className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Alerts</h1>
          <button className="text-xs font-semibold text-primary-bright">Mark all read</button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Payouts, milestones and market news</p>
      </header>

      <div className="mt-5 space-y-6 px-5">
        {groups.map((g) => (
          <section key={g.label}>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{g.label}</p>
            <div className="space-y-2">
              {g.items.map((it, i) => {
                const Icon = it.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3.5 shadow-card"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${it.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{it.t}</p>
                      <p className="truncate text-xs text-muted-foreground">{it.s}</p>
                    </div>
                    <div className="text-right">
                      {it.v > 0 && (
                        <p className="text-sm font-bold text-primary-bright tabular-nums">+{formatKES(it.v)}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground">{it.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
