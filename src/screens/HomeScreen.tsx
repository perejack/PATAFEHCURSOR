import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { LiveEarningsCounter } from "@/components/LiveEarningsCounter";
import { MarketTicker } from "@/components/MarketTicker";
import { products, colorMap, formatKES } from "@/lib/products";
import { ArrowDownToLine, ArrowUpRight, Copy, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import avatarJames from "@/assets/avatar-james.jpg";
import cardPattern from "@/assets/card-pattern.jpg";
import landingHero from "@/assets/landing-hero.jpg";
import { MyInvestmentsLive } from "@/components/MyInvestmentsLive";
import { useState } from "react";
import { earningsNow, getProductFor, useLiveInvestments } from "@/lib/investments";

const trustBadges = ["✓ CBK Licensed", "✓ CMA Regulated", "✓ Secure Accounts", "✓ 50K+ Members"];

export function HomeScreen() {
  const [copied, setCopied] = useState(false);
  const [withdrawNotice, setWithdrawNotice] = useState("");
  const { items: investments } = useLiveInvestments();
  const grouped = new Map<string, { id: string; name: string; value: number }>();
  for (const inv of investments) {
    const product = getProductFor(inv);
    if (!product) continue;
    const prev = grouped.get(product.id) ?? { id: product.id, name: product.name, value: 0 };
    prev.value += inv.amount + earningsNow(inv);
    grouped.set(product.id, prev);
  }
  const breakdown = [...grouped.values()].sort((a, b) => b.value - a.value);
  const portfolioValue = breakdown.reduce((sum, p) => sum + p.value, 0);
  const todayEarnings = investments.reduce((sum, i) => sum + (earningsNow(i, Date.now()) - earningsNow(i, Date.now() - 86400000)), 0);
  const activity = investments.slice(0, 4).map((inv) => {
    const product = getProductFor(inv);
    return {
      name: `${product?.name ?? "Investment"} deposit`,
      date: new Date(inv.investedAt).toLocaleDateString(),
      amount: inv.amount,
      icon: product?.icon ?? "💸",
      color: "bg-emerald-100 text-emerald-700",
    };
  });
  const goalCurrent = 34000;
  const goalTarget = 50000;
  const goalPct = Math.round((goalCurrent / goalTarget) * 100);

  const copyCode = () => {
    navigator.clipboard?.writeText("JAMES150");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell>
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-base font-bold leading-none tracking-tight text-foreground">PataFedha</p>
            <p className="text-[10px] font-medium leading-tight text-muted-foreground">Get Money</p>
          </div>
        </div>
        <div className="relative flex items-center gap-2">
          <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm">
            Pro
          </span>
          <img
            src={avatarJames}
            alt="James"
            className="h-10 w-10 rounded-full border-2 border-primary-soft object-cover"
          />
        </div>
      </header>

      {/* Greeting */}
      <div className="mt-5 px-5">
        <p className="text-sm text-muted-foreground">Good morning, James</p>
        <h1 className="mt-0.5 text-[22px] font-bold leading-tight text-foreground">
          Your money is working for you 📈
        </h1>
      </div>

      {/* Landing hero band */}
      <section className="mt-4 px-5">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-emerald-50 via-amber-50 to-rose-50 shadow-elevated">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" />
          <div className="relative grid grid-cols-5 items-center gap-2 p-4">
            <div className="col-span-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 backdrop-blur">
                <Sparkles className="h-2.5 w-2.5" /> #1 in Kenya
              </span>
              <h2 className="mt-2 text-[18px] font-extrabold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-emerald-700 via-blue-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Get Money. Daily.
                </span>
              </h2>
              <p className="mt-1 text-[11px] font-medium leading-snug text-foreground/70">
                Join <span className="font-bold text-emerald-700">50,000+</span> Kenyans growing wealth from <span className="font-bold text-fuchsia-600">KES 250</span>.
              </p>
              <Link
                to="/invest"
                className="mt-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-md active:scale-95"
              >
                Start Investing <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="col-span-2">
              <img
                src={landingHero}
                alt="Grow your money with PataFedha"
                width={1536}
                height={1024}
                className="h-28 w-full rounded-2xl object-cover shadow-md"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Portfolio Card */}
      <div className="mt-4 px-5">
        <div
          className="relative overflow-hidden rounded-3xl p-5 text-white shadow-elevated"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(15,110,86,0.95), rgba(29,158,117,0.92)), url(${cardPattern})`,
            backgroundSize: "cover",
          }}
        >
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -right-6 h-36 w-36 rounded-full bg-white/5" />

          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
              Total Portfolio Value
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight">{formatKES(portfolioValue)}</span>
            </div>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur">
              <TrendingUp className="h-3 w-3" /> +{formatKES(todayEarnings)} today
            </span>

            <div className="my-4 h-px bg-white/20" />

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Returns", value: "+18.4%" },
                { label: "Profit Earned", value: "KES 8,820" },
                { label: "Days Investing", value: "142" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[10px] uppercase tracking-wide text-white/60">{s.label}</p>
                  <p className="mt-0.5 text-sm font-semibold">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Earnings */}
      <div className="mt-3 px-5">
        <LiveEarningsCounter />
      </div>

      {/* User's actual investments — growing live */}
      <MyInvestmentsLive />

      {/* Market Ticker */}
      <div className="mt-4">
        <MarketTicker />
      </div>

      {/* Trust badges */}
      <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto px-5">
        {trustBadges.map((b) => (
          <span
            key={b}
            className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
          >
            <ShieldCheck className="h-3 w-3 text-primary-bright" /> {b.replace("✓ ", "")}
          </span>
        ))}
      </div>

      {/* Goal Tracker */}
      <div className="mt-5 px-5">
        <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Savings Goal</p>
              <p className="text-sm font-semibold text-foreground">School Fees Goal 🎓</p>
            </div>
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">
              {goalPct}%
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-bright transition-all"
              style={{ width: `${goalPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{formatKES(goalCurrent)}</span> of {formatKES(goalTarget)}
          </p>
        </div>
      </div>

      {/* Portfolio breakdown */}
      <section className="mt-6 px-5">
        <h2 className="text-base font-bold text-foreground">Portfolio Breakdown</h2>
        <div className="mt-3 space-y-3">
                {breakdown.map((b) => (
            <div key={b.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{b.name}</span>
                <span className="font-semibold text-foreground">{formatKES(b.value)}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${portfolioValue > 0 ? Math.round((b.value / portfolioValue) * 100) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Recent Activity</h2>
          <Link to="/alerts" className="text-xs font-semibold text-primary-bright">See all</Link>
        </div>
        <div className="mt-3 space-y-2">
          {activity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${a.color}`}>
                {a.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.date}</p>
              </div>
              <span
                className={`text-sm font-bold tabular-nums ${
                  a.amount > 0 ? "text-primary-bright" : "text-destructive"
                }`}
              >
                {a.amount > 0 ? "+" : ""}
                {formatKES(a.amount)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Referral banner */}
      <section className="mt-6 px-5">
        <div className="relative overflow-hidden rounded-2xl bg-primary-soft p-4">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10" />
          <p className="text-sm font-bold text-primary">Refer friends, earn KES 150 each</p>
          <p className="mt-0.5 text-xs text-primary/80">Share PataFedha. Both of you get rewarded.</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex flex-1 items-center justify-between rounded-xl border border-dashed border-primary/40 bg-background px-3 py-2">
              <span className="font-mono text-sm font-bold tracking-widest text-primary">JAMES150</span>
              <button onClick={copyCode} className="flex items-center gap-1 text-xs font-semibold text-primary">
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hot products preview */}
      <section className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">🔥 Trending now</h2>
          <Link to="/invest" className="text-xs font-semibold text-primary-bright">View all</Link>
        </div>
        <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto pb-1">
          {products.slice(0, 4).map((p) => {
            const c = colorMap[p.color];
            return (
              <Link
                key={p.id}
                to={`/invest/${p.id}`}
                className="flex w-44 shrink-0 flex-col rounded-2xl border border-border bg-background p-3 transition-transform active:scale-[0.98]"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${c.bg}`}>
                  {p.icon}
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{p.name}</p>
                <p className="mt-0.5 text-xs font-bold text-primary-bright">{p.rate}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">From {formatKES(p.min)}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Action buttons */}
      <div className="sticky bottom-20 mt-8 flex gap-3 px-5">
        <Link
          to="/invest"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-glow active:scale-[0.98]"
        >
          <ArrowUpRight className="h-4 w-4" /> Invest Now
        </Link>
        <button
          onClick={() =>
            setWithdrawNotice("Withdrawals are processed after your first 7 days of active investment.")
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-background py-3.5 font-semibold text-foreground active:scale-[0.98]"
        >
          <ArrowDownToLine className="h-4 w-4" /> Withdraw
        </button>
      </div>
      {withdrawNotice && (
        <div className="mt-2 px-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
            {withdrawNotice}
          </div>
        </div>
      )}
    </AppShell>
  );
}
