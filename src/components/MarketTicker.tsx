export function MarketTicker() {
  const items = [
    "NSE ▲+1.2%",
    "Gold ▲+0.8%",
    "T-Bills 16.5% p.a",
    "Crypto ▲+3.4%",
    "SACCO 12% p.a",
    "USD/KES 129.4",
    "Oil ▼-0.5%",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent" />
      <div className="flex gap-2 [animation:ticker_30s_linear_infinite]">
        {doubled.map((t, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
