import { useEffect, useState } from "react";
import { formatKES } from "@/lib/products";
import { earningsNow, useLiveInvestments } from "@/lib/investments";

export function LiveEarningsCounter({ start = 127.4, perSec = 0.018 }: { start?: number; perSec?: number }) {
  const [v, setV] = useState(start);
  const { items } = useLiveInvestments();

  const derivedTotal = items.reduce((sum, inv) => sum + earningsNow(inv), 0);
  const derivedPerSec =
    items.length > 0
      ? items.reduce((sum, inv) => sum + (earningsNow(inv, Date.now() + 1000) - earningsNow(inv, Date.now())), 0)
      : perSec;

  useEffect(() => {
    setV(derivedTotal || start);
  }, [derivedTotal, start]);

  useEffect(() => {
    const id = setInterval(() => setV((x) => x + derivedPerSec * 10), 100);
    return () => clearInterval(id);
  }, [derivedPerSec]);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-5 shadow-card">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-primary-bright" />
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Your earnings today</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums text-foreground">
              {formatKES(Math.floor(v))}
              <span className="text-xl text-primary-bright">.{String(Math.floor((v % 1) * 100)).padStart(2, "0")}</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary-bright">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary-bright" />
              live
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Based on your active investments</p>
        </div>
        <div className="text-right">
          <span className="text-2xl">📈</span>
        </div>
      </div>
    </div>
  );
}
