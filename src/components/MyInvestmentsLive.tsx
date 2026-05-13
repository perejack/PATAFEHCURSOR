import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLiveInvestments, earningsNow, getProductFor, type Investment } from "@/lib/investments";
import { colorMap, formatKES } from "@/lib/products";
import { ProductPeek } from "@/components/ProductPeek";
import { Sparkles, TrendingUp, ArrowUpRight } from "lucide-react";

function timeAgo(ms: number) {
  const d = Math.floor((Date.now() - ms) / 86_400_000);
  if (d <= 0) return "today";
  if (d === 1) return "1 day ago";
  return `${d} days ago`;
}

export function MyInvestmentsLive() {
  const { items: investments, loading } = useLiveInvestments();
  const [active, setActive] = useState<Investment | null>(null);

  if (loading) {
    return (
      <section className="mt-6 px-5">
        <div className="rounded-3xl border border-border bg-background p-6 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Loading your investments...</p>
        </div>
      </section>
    );
  }

  if (!investments.length) {
    return (
      <section className="mt-6 px-5">
        <div className="rounded-3xl border border-dashed border-border bg-muted/30 p-6 text-center">
          <p className="text-sm font-bold text-foreground">You haven't invested yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Start from KES 250 and watch your money grow every single day.
          </p>
          <Link
            to="/invest"
            className="mt-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md active:scale-95"
          >
            Start Earning <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    );
  }

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const totalEarned = investments.reduce((s, i) => s + earningsNow(i), 0);

  return (
    <section className="mt-6 px-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-foreground">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          Your money, growing live
        </h2>
        <Link to="/portfolio" className="text-xs font-semibold text-primary-bright">
          See all
        </Link>
      </div>

      <div className="mt-3 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 p-3.5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              Earned so far
            </p>
            <p className="mt-0.5 text-2xl font-extrabold tabular-nums text-emerald-700">
              +KES {totalEarned.toFixed(2)}
              <span className="ml-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500 align-middle" />
            </p>
          </div>
          <p className="text-[11px] font-medium text-emerald-700/70">
            on {formatKES(totalInvested)} invested
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        {investments.map((inv) => {
          const p = getProductFor(inv);
          if (!p) return null;
          const c = colorMap[p.color];
          const earned = earningsNow(inv);
          const value = inv.amount + earned;
          return (
            <button
              key={inv.id}
              onClick={() => setActive(inv)}
              className="group flex w-full items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left shadow-card transition-all active:scale-[0.99]"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ring-2 ${c.ring} ${c.bg}`}
              >
                {p.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-bold text-foreground">{p.name}</p>
                  <p className="shrink-0 text-sm font-extrabold tabular-nums text-foreground">
                    {formatKES(value)}
                  </p>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p className="text-[11px] text-muted-foreground">
                    {formatKES(inv.amount)} · invested {timeAgo(inv.investedAt)}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    <TrendingUp className="h-2.5 w-2.5" />
                    +KES {earned.toFixed(2)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <ProductPeekWrapper inv={active} onClose={() => setActive(null)} />
    </section>
  );
}

function ProductPeekWrapper({ inv, onClose }: { inv: Investment | null; onClose: () => void }) {
  const navigate = useNavigate();
  const product = inv ? getProductFor(inv) ?? null : null;
  return (
    <ProductPeek
      product={product}
      open={!!inv && !!product}
      onClose={onClose}
      ctaLabel="Proceed"
      onProceed={() => {
        if (!product) return;
        onClose();
        navigate(`/my/${product.id}`);
      }}
    />
  );
}

