import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Info, Sparkles, X } from "lucide-react";
import { colorMap, type Product } from "@/lib/products";

export function ProductPeek({
  product,
  open,
  onClose,
  onProceed,
  ctaLabel = "Proceed",
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
  ctaLabel?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !product) return null;
  const c = colorMap[product.color];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm [animation:fade-in_0.2s]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex max-h-[92vh] w-full max-w-[420px] flex-col rounded-t-[2rem] bg-background shadow-2xl [animation:slide-up_0.35s_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-5 pb-2">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-bold text-foreground">{product.name}</p>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground active:scale-95"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-5">
          <h3 className="flex items-center gap-1.5 text-base font-bold text-foreground">
            <Info className="h-4 w-4 text-primary-bright" />
            What you're investing in
          </h3>

          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="mt-3 h-40 w-full rounded-2xl object-cover shadow-card"
            />
          )}

          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            {product.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.pills.map((pill) => (
              <span
                key={pill}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${c.pill}`}
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {product.why.map((reason) => (
              <div
                key={reason}
                className="flex items-start gap-2 rounded-xl border border-border bg-background p-2.5"
              >
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-bright" />
                <p className="text-xs font-medium text-foreground">{reason}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-border bg-background py-3.5 text-sm font-bold text-foreground active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={onProceed}
              className={`flex flex-[1.4] items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r ${c.from} ${c.to} py-3.5 text-sm font-extrabold text-white shadow-lg active:scale-[0.98]`}
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
