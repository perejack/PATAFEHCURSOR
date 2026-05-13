import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct, formatKES, colorMap } from "@/lib/products";
import { ArrowLeft, Bookmark, Check, Star } from "lucide-react";
import { useMemo, useState } from "react";
import reviewers from "@/assets/reviewers.jpg";
import { InvestFlow } from "@/components/InvestFlow";

type Tab = "overview" | "returns" | "how" | "reviews";

export function ProductDetailScreen() {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? getProduct(productId) : undefined;
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [flowOpen, setFlowOpen] = useState(false);
  const [amount, setAmount] = useState<number>(500);
  const [days, setDays] = useState<number>(90);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <p className="text-lg font-bold">Product not found</p>
          <Link to="/invest" className="mt-3 inline-block text-primary">Back to Invest</Link>
        </div>
      </div>
    );
  }

  const c = colorMap[product.color];

  const dailyRate = product.ratePct / 100 / 365;
  const projected = useMemo(() => Math.round(amount * (1 + dailyRate * days)), [amount, days, dailyRate]);
  const earnFor = (d: number) => Math.round(amount * dailyRate * d);

  return (
    <div className="min-h-screen w-full bg-muted">
      <div className="relative mx-auto min-h-screen w-full max-w-[420px] bg-background pb-32 [animation:slide-up_0.3s_ease-out]">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
          <button
            onClick={() => navigate("/invest")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold text-foreground">Investment Details</p>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        {/* Hero */}
        <div className="px-5 pt-6">
          <div className={`flex h-20 w-20 items-center justify-center rounded-3xl text-5xl ${c.bg}`}>
            {product.icon}
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">{product.name}</h1>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-sm font-bold text-primary">
            {product.rate}
          </div>
          <p className="mt-3 text-sm italic leading-relaxed text-primary-bright">"{product.hook}"</p>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-border px-5">
          <div className="flex gap-1">
            {(["overview", "returns", "how", "reviews"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative flex-1 py-2.5 text-xs font-semibold capitalize ${
                  tab === t ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t === "how" ? "How It Works" : t}
                {tab === t && <span className="absolute -bottom-px left-2 right-2 h-0.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-5 pb-8 pt-5">
          {tab === "overview" && (
            <div className="space-y-5 [animation:fade-in_0.25s_ease-out]">
              <p className="text-sm leading-relaxed text-foreground/90">{product.description}</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { l: "Min. Investment", v: formatKES(product.min) },
                  { l: "Return Rate", v: product.rate },
                  { l: "Payout", v: product.payout },
                  { l: "Risk Level", v: product.risk },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border border-border bg-card p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.l}</p>
                    <p className="mt-1 text-sm font-bold text-foreground">{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.pills.map((p) => (
                  <span key={p} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {p}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Why Kenyans love this</p>
                <ul className="mt-2 space-y-1.5">
                  {product.why.map((w) => (
                    <li key={w} className="flex items-start gap-2 text-sm text-foreground/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-bright" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "returns" && (
            <div className="space-y-5 [animation:fade-in_0.25s_ease-out]">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-sm font-bold text-foreground">Return Calculator</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  If I invest{" "}
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                    className="mx-1 w-20 rounded-md border border-border bg-background px-1.5 py-0.5 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                  KES for{" "}
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                    className="mx-1 w-16 rounded-md border border-border bg-background px-1.5 py-0.5 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                  days I earn
                </p>
                <p className="mt-3 text-3xl font-bold text-primary-bright tabular-nums">
                  +{formatKES(projected - amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Total payout: <span className="font-semibold text-foreground">{formatKES(projected)}</span>
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">Period</th>
                      <th className="px-3 py-2 text-right">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[30, 90, 180, 365].map((d) => (
                      <tr key={d} className="border-t border-border">
                        <td className="px-3 py-2.5 text-foreground">{d === 365 ? "1 year" : `${d} days`}</td>
                        <td className="px-3 py-2.5 text-right font-bold text-primary-bright">
                          +{formatKES(earnFor(d))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "how" && (
            <div className="space-y-3 [animation:fade-in_0.25s_ease-out]">
              {[
                { t: "Deposit via M-Pesa", d: "Pay the amount you choose. Money lands instantly." },
                { t: "Money is put to work", d: "We invest into the partner product on your behalf." },
                { t: "Earn returns daily", d: "Watch your earnings grow on the live counter." },
                { t: "Withdraw anytime to M-Pesa", d: "One tap and your money is back in your phone." },
              ].map((s, i) => (
                <div key={i} className="flex gap-3 rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{s.t}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "reviews" && (
            <div className="space-y-3 [animation:fade-in_0.25s_ease-out]">
              <div className="overflow-hidden rounded-2xl border border-border">
                <img src={reviewers} alt="Happy investors" className="h-32 w-full object-cover" loading="lazy" />
              </div>
              {[
                { name: "Brian K.", initials: "BK", stars: 5, q: "Started with KES 500. Now earning daily without doing anything!" },
                { name: "Wanjiru M.", initials: "WM", stars: 5, q: "I love seeing the live counter tick up. It feels real." },
                { name: "Otieno P.", initials: "OP", stars: 4, q: "Withdrew to M-Pesa in seconds. Trust earned." },
              ].map((r) => (
                <div key={r.name} className="rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft font-bold text-primary">
                      {r.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < r.stars ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm italic text-foreground/90">"{r.q}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky bottom CTA */}
        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[420px] -translate-x-1/2 border-t border-border bg-background/95 p-4 backdrop-blur">
          <div className="flex gap-2">
            <button className="flex-1 rounded-2xl border border-border bg-background py-3 text-sm font-semibold text-foreground active:scale-[0.98]">
              Save for Later
            </button>
            <button
              onClick={() => {
                setAmount((a) => (a < product.min ? product.min : a));
                setFlowOpen(true);
              }}
              className={`flex-[1.4] rounded-2xl bg-gradient-to-r ${c.from} ${c.to} py-3 text-sm font-bold text-white shadow-lg active:scale-[0.98]`}
            >
              Invest Now
            </button>
          </div>
        </div>
      </div>

      <InvestFlow
        product={product}
        open={flowOpen}
        onClose={() => setFlowOpen(false)}
        initialAmount={amount}
      />
    </div>
  );
}
