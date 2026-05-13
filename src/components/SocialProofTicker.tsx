import { useEffect, useState } from "react";
import { TrendingUp, Wallet, Sparkles } from "lucide-react";

const FIRST_NAMES = [
  "Wanjiku", "Otieno", "Kamau", "Achieng", "Mwangi", "Njoki", "Kipchoge",
  "Faith", "Brian", "Cynthia", "James", "Mercy", "David", "Grace", "Peter",
  "Sharon", "Kelvin", "Joy", "Dennis", "Lucy", "Eric", "Maureen", "Kevin",
];
const TOWNS = ["Nairobi", "Kisumu", "Mombasa", "Eldoret", "Nakuru", "Thika", "Machakos", "Kakamega", "Nyeri"];

type Event = {
  id: number;
  text: string;
  amount: number;
  kind: "withdraw" | "invest" | "earn" | "milestone";
};

const VERBS = {
  withdraw: ["just withdrew their profits 💸", "cashed out earnings to M-Pesa 🤑", "withdrew weekly profits ✅"],
  invest: ["just topped up their investment 📈", "started investing today 🚀", "added to their position 💪"],
  earn: ["just earned a daily payout ☀️", "received their daily drip 💧", "got paid by this product 🎉"],
  milestone: ["hit a 30-day streak 🔥", "doubled their money this month 🏆", "reached KES 10,000 in earnings 🎯"],
};

function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeEvent(productName: string, id: number): Event {
  const kinds: Event["kind"][] = ["withdraw", "withdraw", "earn", "invest", "milestone"];
  const kind = rand(kinds);
  const name = rand(FIRST_NAMES);
  const town = rand(TOWNS);
  const amount = Math.round((50 + Math.random() * 4000) / 50) * 50;
  const verb = rand(VERBS[kind]);
  const text =
    kind === "milestone"
      ? `${name} from ${town} ${verb}`
      : `${name} from ${town} ${verb} · KES ${amount.toLocaleString()}`;
  return { id, text, amount, kind };
}

export function SocialProofTicker({ productName }: { productName: string }) {
  const [events, setEvents] = useState<Event[]>(() =>
    Array.from({ length: 4 }, (_, i) => makeEvent(productName, i))
  );

  useEffect(() => {
    let id = 100;
    const t = setInterval(() => {
      setEvents((prev) => [makeEvent(productName, id++), ...prev].slice(0, 6));
    }, 3500);
    return () => clearInterval(t);
  }, [productName]);

  const iconFor = (k: Event["kind"]) => {
    if (k === "withdraw") return <Wallet className="h-3.5 w-3.5" />;
    if (k === "invest") return <TrendingUp className="h-3.5 w-3.5" />;
    if (k === "milestone") return <Sparkles className="h-3.5 w-3.5" />;
    return <Sparkles className="h-3.5 w-3.5" />;
  };
  const colorFor = (k: Event["kind"]) => {
    if (k === "withdraw") return "bg-emerald-100 text-emerald-700";
    if (k === "invest") return "bg-blue-100 text-blue-700";
    if (k === "milestone") return "bg-fuchsia-100 text-fuchsia-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-70" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live activity
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          across Kenya
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {events.map((e, i) => (
          <div
            key={e.id}
            className={`flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-2.5 text-xs transition-all ${
              i === 0 ? "[animation:slide-in-down_0.4s_ease-out]" : ""
            }`}
            style={{ opacity: 1 - i * 0.12 }}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${colorFor(e.kind)}`}
            >
              {iconFor(e.kind)}
            </div>
            <p className="flex-1 truncate font-medium text-foreground">{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
