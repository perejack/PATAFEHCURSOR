import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SocialProofTicker } from "@/components/SocialProofTicker";
import { InvestFlow } from "@/components/InvestFlow";
import {
  earningsNow,
  projectEarnings,
  useLiveInvestments,
  canWithdrawAfter,
  createWithdrawal,
} from "@/lib/investments";
import { colorMap, formatKES, getProduct } from "@/lib/products";
import {
  ArrowLeft,
  ArrowDownToLine,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Calendar,
  Zap,
  Info,
  Share2,
} from "lucide-react";

function formatKES2(n: number) {
  return "KES " + n.toLocaleString("en-KE", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function timeAgo(ms: number) {
  const sec = Math.floor((Date.now() - ms) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  const d = Math.floor(sec / 86400);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

/** Build a chart of cumulative value over the past `days` days, projecting forward `forwardDays`. */
function buildCurve(invested: number, ratePct: number, daysHeld: number, forwardDays = 7) {
  const total = Math.max(2, Math.ceil(daysHeld) + forwardDays);
  const points: { day: number; value: number; isFuture: boolean }[] = [];
  for (let d = 0; d <= total; d++) {
    points.push({
      day: d,
      value: invested + projectEarnings(invested, ratePct, d),
      isFuture: d > daysHeld,
    });
  }
  return { points, total, nowDay: Math.min(daysHeld, total) };
}

export function MyHoldingScreen() {
  const { productId } = useParams({ from: "/my/$productId" });
  const navigate = useNavigate();
  const { items: all, loading } = useLiveInvestments();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState("");

  const product = getProduct(productId);
  const deposits = useMemo(
    () => all.filter((i) => i.productId === productId).sort((a, b) => b.investedAt - a.investedAt),
    [all, productId]
  );

  if (!product) {
    return (
      <AppShell>
        <div className="px-5 pt-10 text-center">
          <p className="text-sm text-muted-foreground">Product not found.</p>
          <Link to="/app" className="mt-3 inline-block text-sm font-bold text-primary-bright">
            Back to dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const c = colorMap[product.color];

  if (loading) {
    return (
      <AppShell>
        <div className="px-5 pt-10 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Loading account details...</p>
        </div>
      </AppShell>
    );
  }

  if (!deposits.length) {
    return (
      <AppShell>
        <div className="px-5 pt-10 text-center">
          <p className="text-sm text-muted-foreground">You haven't invested in this product yet.</p>
          <button
            onClick={() => setTopUpOpen(true)}
            className={`mt-4 rounded-full bg-gradient-to-r ${c.from} ${c.to} px-5 py-2.5 text-sm font-bold text-white shadow-md`}
          >
            Start with {product.name}
          </button>
          <InvestFlow product={product} open={topUpOpen} onClose={() => setTopUpOpen(false)} />
        </div>
      </AppShell>
    );
  }

  const totalInvested = deposits.reduce((s, d) => s + d.amount, 0);
  const totalEarned = deposits.reduce((s, d) => s + earningsNow(d), 0);
  const currentValue = totalInvested + totalEarned;
  const oldest = Math.min(...deposits.map((d) => d.investedAt));
  const daysHeld = Math.max(0.01, (Date.now() - oldest) / 86_400_000);

  const dailyDrip = projectEarnings(totalInvested, product.ratePct, 1);
  const weekProj = projectEarnings(totalInvested, product.ratePct, 7);
  const monthProj = projectEarnings(totalInvested, product.ratePct, 30);
  const perSecond = dailyDrip / 86_400;
  const canWithdrawDate = canWithdrawAfter(oldest);
  const withdrawalUnlocked = Date.now() >= canWithdrawDate;

  const { points, total, nowDay } = buildCurve(totalInvested, product.ratePct, daysHeld, 7);
  const maxV = points[points.length - 1].value;
  const minV = points[0].value;
  const W = 320;
  const H = 110;
  const x = (d: number) => (d / total) * W;
  const y = (v: number) => H - ((v - minV) / (maxV - minV || 1)) * H;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.day).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const areaPath = `${path} L ${W} ${H} L 0 ${H} Z`;
  const nowX = x(nowDay);
  const nowY = y(totalInvested + projectEarnings(totalInvested, product.ratePct, daysHeld));

  return (
    <AppShell>
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6">
        <button
          onClick={() => navigate({ to: "/app" })}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-bold text-foreground">My Investment</p>
        <button
          onClick={() => navigator.share?.({ title: product.name, text: `I'm earning ${formatKES(dailyDrip)}/day on PataFedha 🚀` }).catch(() => {})}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground active:scale-95"
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </header>

      {/* Hero card */}
      <section className="mt-4 px-5">
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${c.from} ${c.to} p-5 text-white shadow-elevated`}
        >
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15" />
          <div className="absolute -bottom-16 -left-6 h-36 w-36 rounded-full bg-white/10" />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
                {product.icon}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-extrabold leading-tight">{product.name}</p>
                <p className="text-[11px] font-medium text-white/80">{product.rate}</p>
              </div>
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-white/70">
              Current value
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tabular-nums">{formatKES2(currentValue)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-white/90">
              <TrendingUp className="mr-1 inline h-3 w-3" />
              +{formatKES2(totalEarned)} earned
            </p>
          </div>
        </div>
      </section>

      {/* Live drip */}
      <section className="mt-3 px-5">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                Earning right now
              </p>
              <p className="mt-0.5 text-2xl font-extrabold tabular-nums text-emerald-700">
                +KES {perSecond.toFixed(4)}
                <span className="ml-1 text-xs font-bold text-emerald-600/70">/sec</span>
              </p>
            </div>
            <Zap className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-white/70 p-2 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Today</p>
              <p className="mt-0.5 text-sm font-extrabold tabular-nums text-emerald-800">+{formatKES(dailyDrip)}</p>
            </div>
            <div className="rounded-xl bg-white/70 p-2 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">This week</p>
              <p className="mt-0.5 text-sm font-extrabold tabular-nums text-emerald-800">+{formatKES(weekProj)}</p>
            </div>
            <div className="rounded-xl bg-white/70 p-2 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">This month</p>
              <p className="mt-0.5 text-sm font-extrabold tabular-nums text-emerald-800">+{formatKES(monthProj)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Growth chart */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Growth curve</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              past · projected
            </span>
          </div>
          <div className="mt-3 -mx-1">
            <svg viewBox={`0 0 ${W} ${H + 20}`} className="h-32 w-full">
              <defs>
                <linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.58 0.16 160)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="oklch(0.58 0.16 160)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#growthFill)" />
              <path d={path} fill="none" stroke="oklch(0.55 0.16 160)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* now marker */}
              <line x1={nowX} x2={nowX} y1={0} y2={H} stroke="oklch(0.55 0.16 160)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              <circle cx={nowX} cy={nowY} r="5" fill="white" stroke="oklch(0.55 0.16 160)" strokeWidth="2.5" />
              <text x={nowX} y={H + 14} fontSize="9" textAnchor="middle" fill="oklch(0.55 0.02 260)" fontWeight="700">
                NOW
              </text>
            </svg>
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>{formatKES(totalInvested)} start</span>
            <span className="text-emerald-700">{formatKES(maxV)} in 7 days</span>
          </div>
        </div>
      </section>

      {/* Social proof thrill */}
      <section className="mt-4 px-5">
        <SocialProofTicker productName={product.name} />
      </section>

      {/* Action buttons */}
      <section className="mt-4 grid grid-cols-2 gap-2 px-5">
        <button
          onClick={() => setTopUpOpen(true)}
          className={`flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r ${c.from} ${c.to} py-3 text-sm font-extrabold text-white shadow-md active:scale-[0.98]`}
        >
          <Plus className="h-4 w-4" /> Top Up
        </button>
        <button
          onClick={async () => {
            if (!withdrawalUnlocked) {
              setWithdrawMsg(
                `Withdrawal opens after 7 days. Available on ${new Date(canWithdrawDate).toLocaleDateString()}.`,
              );
              return;
            }
            try {
              await createWithdrawal(product.id, currentValue);
              setWithdrawMsg("Withdrawal request submitted. Processing will begin immediately.");
            } catch (error) {
              setWithdrawMsg(error instanceof Error ? error.message : "Failed to create withdrawal request.");
            }
          }}
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-background py-3 text-sm font-extrabold text-foreground active:scale-[0.98]"
        >
          <ArrowDownToLine className="h-4 w-4" /> Withdraw
        </button>
      </section>
      {withdrawMsg && (
        <section className="mt-2 px-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
            {withdrawMsg}
          </div>
        </section>
      )}

      {/* What you're investing in */}
      <section className="mt-6 px-5">
        <h3 className="flex items-center gap-1.5 text-base font-bold text-foreground">
          <Info className="h-4 w-4 text-primary-bright" />
          What you're investing in
        </h3>
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="mt-3 h-32 w-full rounded-2xl object-cover shadow-card"
          />
        )}
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">{product.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.pills.map((pill) => (
            <span
              key={pill}
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${c.pill}`}
            >
              {pill}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {product.why.map((reason) => (
            <div key={reason} className="flex items-start gap-2 rounded-xl border border-border bg-background p-2.5">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-bright" />
              <p className="text-xs font-medium text-foreground">{reason}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-border bg-background p-2.5 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Payout</p>
            <p className="mt-0.5 text-xs font-bold text-foreground">{product.payout}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-2.5 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Risk</p>
            <p className="mt-0.5 text-xs font-bold text-foreground">{product.risk}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-2.5 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Min</p>
            <p className="mt-0.5 text-xs font-bold text-foreground">{formatKES(product.min)}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />
          <p className="text-[11px] font-semibold text-emerald-800">
            CBK licensed · CMA regulated · Funds insured up to KES 500,000
          </p>
        </div>
      </section>

      {/* Deposit history */}
      <section className="mt-6 px-5">
        <h3 className="flex items-center gap-1.5 text-base font-bold text-foreground">
          <Calendar className="h-4 w-4 text-primary-bright" />
          Your deposits
        </h3>
        <div className="mt-3 space-y-2">
          {deposits.map((d) => {
            const earned = earningsNow(d);
            return (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 shadow-card"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg} ${c.text} text-lg font-bold`}>
                  +
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">{formatKES(d.amount)}</p>
                    <span className="text-xs font-extrabold tabular-nums text-emerald-700">
                      +{formatKES2(earned)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {timeAgo(d.investedAt)} · {d.method.toUpperCase()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="sticky bottom-20 mt-8 px-5">
        <button
          onClick={() => setTopUpOpen(true)}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${c.from} ${c.to} py-3.5 font-extrabold text-white shadow-glow active:scale-[0.98]`}
        >
          <Plus className="h-4 w-4" /> Add more — earn even faster
        </button>
      </div>

      <InvestFlow product={product} open={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </AppShell>
  );
}
