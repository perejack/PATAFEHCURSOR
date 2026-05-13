import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { products, colorMap, formatKES, type Product } from "@/lib/products";
import { ArrowRight, Search, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { InvestFlow } from "@/components/InvestFlow";
import { ProductPeek } from "@/components/ProductPeek";

const nameGradients: Record<string, string> = {
  green: "bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700",
  blue: "bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700",
  amber: "bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500",
  purple: "bg-gradient-to-r from-fuchsia-600 via-purple-500 to-violet-700",
};

const pillPalette = [
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-violet-50 text-violet-700 border-violet-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-sky-50 text-sky-700 border-sky-200",
];

export function InvestScreen() {
  const [q, setQ] = useState("");
  const [peek, setPeek] = useState<Product | null>(null);
  const [active, setActive] = useState<Product | null>(null);
  const filtered = products.filter((p) =>
    (p.name + p.hook).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AppShell>
      {/* Hero header */}
      <header className="relative overflow-hidden px-5 pb-5 pt-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-fuchsia-300/40 via-amber-200/30 to-emerald-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 top-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-300/40 to-purple-300/30 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
            <Sparkles className="h-3 w-3" /> Curated for Kenya
          </span>

          <h1 className="mt-3 text-[28px] font-extrabold leading-[1.1] tracking-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-fuchsia-600 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Investment
            </span>
          </h1>

          <p className="mt-2 text-sm font-medium">
            <span className="text-muted-foreground">Start from </span>
            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-700">
              KES 250
            </span>
            <span className="text-muted-foreground"> — </span>
            <span className="font-semibold text-fuchsia-600">grow every day.</span>
          </p>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-background px-3.5 py-2.5 shadow-card">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search investments..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              {filtered.length}
            </kbd>
          </div>
        </div>
      </header>

      <div className="space-y-4 px-5 pb-4">
        {filtered.map((p, idx) => {
          const c = colorMap[p.color];
          return (
            <div
              key={p.id}
              className="group block overflow-hidden rounded-3xl border border-border bg-background shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated [animation:slide-up_0.4s_ease-out_both]"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <Link
                to="/invest/$productId"
                params={{ productId: p.id }}
                className="block"
              >
                {/* Image hero */}
                <div className="relative h-32 w-full overflow-hidden">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={800}
                      height={512}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                  {/* Floating icon badge */}
                  <div
                    className={`absolute -bottom-5 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-lg ring-4 ${c.ring}`}
                  >
                    {p.icon}
                  </div>

                  {/* Rate badge */}
                  <div
                    className={`absolute right-3 top-3 rounded-full bg-gradient-to-r ${c.from} ${c.to} px-2.5 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {p.rate}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-4 pt-7">
                  <h3
                    className={`bg-clip-text text-[17px] font-extrabold leading-tight tracking-tight text-transparent ${nameGradients[p.color]}`}
                  >
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-xs italic leading-relaxed text-muted-foreground">
                    "{p.hook}"
                  </p>

                  {/* Pills — colorful */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-gradient-to-r from-emerald-100 to-teal-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                      <Zap className="h-2.5 w-2.5" /> Min {formatKES(p.min)}
                    </span>
                    {p.pills.map((pill, i) => (
                      <span
                        key={pill}
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${pillPalette[(idx + i) % pillPalette.length]}`}
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>

              {/* Action row — separate so Invest Now doesn't navigate */}
              <div className="flex items-center justify-between px-4 pb-4 pt-3">
                <Link
                  to="/invest/$productId"
                  params={{ productId: p.id }}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                >
                  View details →
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPeek(p);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${c.from} ${c.to} px-4 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95`}
                >
                  Invest Now <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
            <p className="text-sm font-semibold text-foreground">No investments found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different search term.</p>
          </div>
        )}
      </div>

      <ProductPeek
        product={peek}
        open={!!peek}
        onClose={() => setPeek(null)}
        ctaLabel="Proceed to Invest"
        onProceed={() => {
          const p = peek;
          setPeek(null);
          setActive(p);
        }}
      />

      {active && (
        <InvestFlow product={active} open={!!active} onClose={() => setActive(null)} />
      )}
    </AppShell>
  );
}
