import { Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useLiveInvestments, earningsNow, projectEarnings } from "@/lib/investments";
import { colorMap, formatKES, getProduct, type Product } from "@/lib/products";
import { ArrowRight, ArrowUpRight, Sparkles, TrendingUp, Wallet } from "lucide-react";

type Group = {
  product: Product;
  invested: number;
  earned: number;
  current: number;
  count: number;
  daily: number;
};

export function PortfolioScreen() {
  const navigate = useNavigate();
  const { items: all, loading } = useLiveInvestments();

  if (loading) {
    return (
      <AppShell>
        <header className="px-5 pt-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Portfolio</h1>
        </header>
        <div className="mx-5 mt-8 rounded-3xl border border-border bg-background p-8 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Loading your portfolio...</p>
        </div>
      </AppShell>
    );
  }

  const groupsMap = new Map<string, Group>();
  for (const inv of all) {
    const product = getProduct(inv.productId);
    if (!product) continue;
    const earned = earningsNow(inv);
    const g = groupsMap.get(inv.productId) ?? {
      product,
      invested: 0,
      earned: 0,
      current: 0,
      count: 0,
      daily: 0,
    };
    g.invested += inv.amount;
    g.earned += earned;
    g.current += inv.amount + earned;
    g.count += 1;
    g.daily += projectEarnings(inv.amount, product.ratePct, 1);
    groupsMap.set(inv.productId, g);
  }
  const groups = Array.from(groupsMap.values()).sort((a, b) => b.current - a.current);

  const totalInvested = groups.reduce((s, g) => s + g.invested, 0);
  const totalEarned = groups.reduce((s, g) => s + g.earned, 0);
  const totalCurrent = totalInvested + totalEarned;
  const totalDaily = groups.reduce((s, g) => s + g.daily, 0);

  if (!groups.length) {
    return (
      <AppShell>
        <header className="px-5 pt-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your active investments will appear here</p>
        </header>
        <div className="mx-5 mt-8 rounded-3xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-sm font-bold text-foreground">No investments yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Start from KES 250 and watch your money grow every single day.
          </p>
          <Link
            to="/invest"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95"
          >
            Browse Investments <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="px-5 pt-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Portfolio</h1>
        <p className="mt-1 text-sm text-muted-foreground">Live performance across your investments</p>
      </header>

      {/* Summary card */}
      <section className="mt-5 px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-5 text-white shadow-elevated">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
              Total portfolio value
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tabular-nums">{formatKES(totalCurrent)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-white/90">
              <TrendingUp className="mr-1 inline h-3 w-3" />
              +{formatKES(totalEarned)} earned · +{formatKES(totalDaily)}/day
            </p>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <div className="mt-3 grid grid-cols-3 gap-2 px-5">
        <Stat label="Invested" value={formatKES(totalInvested)} />
        <Stat label="Earned" value={`+${formatKES(totalEarned)}`} positive />
        <Stat label="Products" value={String(groups.length)} />
      </div>

      {/* Active accounts */}
      <section className="mt-6 px-5 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-base font-bold text-foreground">
            <Sparkles className="h-4 w-4 text-emerald-600" /> Your accounts
          </h2>
          <Link
            to="/invest"
            className="text-xs font-semibold text-primary-bright"
          >
            + Add new
          </Link>
        </div>

        <div className="mt-3 space-y-3">
          {groups.map((g) => {
            const c = colorMap[g.product.color];
            const gainPct = g.invested > 0 ? (g.earned / g.invested) * 100 : 0;
            return (
              <div
                key={g.product.id}
                className="overflow-hidden rounded-2xl border border-border bg-background shadow-card"
              >
                <div className={`h-1 w-full bg-gradient-to-r ${c.from} ${c.to}`} />
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ring-2 ${c.ring} ${c.bg}`}
                    >
                      {g.product.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{g.product.name}</p>
                      <div className="mt-0.5 flex items-baseline gap-2">
                        <span className="text-lg font-extrabold tabular-nums text-foreground">
                          {formatKES(g.current)}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          ▲ +{gainPct.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {formatKES(g.invested)} invested · {g.count} {g.count === 1 ? "deposit" : "deposits"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                        Earned
                      </p>
                      <p className="mt-0.5 text-sm font-extrabold tabular-nums text-emerald-700">
                        +{formatKES(g.earned)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 p-2">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        Daily drip
                      </p>
                      <p className="mt-0.5 text-sm font-extrabold tabular-nums text-foreground">
                        +{formatKES(g.daily)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate({ to: "/my/$productId", params: { productId: g.product.id } })
                    }
                    className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r ${c.from} ${c.to} py-3 text-xs font-extrabold text-white shadow-md active:scale-[0.98]`}
                  >
                    <Wallet className="h-3.5 w-3.5" /> View Account <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 text-sm font-extrabold tabular-nums ${positive ? "text-emerald-600" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
