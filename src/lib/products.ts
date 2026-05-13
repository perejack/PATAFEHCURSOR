import cardPesaPlus from "@/assets/card-pesa-plus.jpg";
import cardKcb from "@/assets/card-kcb.jpg";
import cardEquity from "@/assets/card-equity.jpg";
import cardCoop from "@/assets/card-coop.jpg";
import cardJar from "@/assets/card-jar.jpg";
import cardFloat from "@/assets/card-float.jpg";
import cardHisa from "@/assets/card-hisa.jpg";

export type Product = {
  id: string;
  icon: string;
  image?: string;
  name: string;
  rate: string;
  ratePct: number; // approx annualized for calc
  hook: string;
  description: string;
  min: number;
  pills: string[];
  color: "green" | "blue" | "amber" | "purple";
  payout: string;
  risk: "Low" | "Medium" | "High";
  why: string[];
};

const images: Record<string, string> = {
  "pesa-plus": cardPesaPlus,
  "kcb-wekeza": cardKcb,
  "equity-jijengee": cardEquity,
  "coop-maisha": cardCoop,
  "pesa-jar": cardJar,
  "mpesa-float": cardFloat,
  "safaricom-hisa": cardHisa,
};

export const products: Product[] = [
  {
    id: "pesa-plus",
    icon: "📱",
    name: "Safaricom Pesa Plus",
    rate: "40% daily drip",
    ratePct: 14600,
    hook: "Your M-Pesa was earning KES 0. Flip this switch.",
    description:
      "Your idle M-Pesa balance auto-earns. No extra steps — switch on and watch it grow.",
    min: 250,
    pills: ["Withdraw anytime", "M-Pesa native", "No lock-in"],
    color: "green",
    payout: "Daily",
    risk: "Low",
    why: [
      "No lock-in — your money stays liquid",
      "Auto-syncs with your M-Pesa balance",
      "Earnings credited every 24 hours",
    ],
  },
  {
    id: "kcb-wekeza",
    icon: "🏦",
    name: "KCB Wekeza Account",
    rate: "40% daily · KCB-backed",
    ratePct: 14600,
    hook: "Kenya's biggest bank. Your smallest deposit. Growing daily.",
    description:
      "Digital savings pocket backed by KCB. Earn daily interest, access funds in 24 hours.",
    min: 500,
    pills: ["KCB backed", "Compound daily", "24hr access"],
    color: "blue",
    payout: "Daily",
    risk: "Low",
    why: [
      "Backed by Kenya's largest bank",
      "Compounding works while you sleep",
      "Withdrawals settle in under 24 hours",
    ],
  },
  {
    id: "equity-jijengee",
    icon: "🌱",
    name: "Equity Jijengee Fund",
    rate: "40% daily · SACCO power",
    ratePct: 14600,
    hook: "Join 15 million Equity members growing together.",
    description:
      "Pool your savings with millions of members. Inspired by Kenya's SACCO spirit — the more who join, the more everyone earns.",
    min: 250,
    pills: ["Group power", "Equity heritage", "Daily interest"],
    color: "amber",
    payout: "Daily",
    risk: "Low",
    why: [
      "Strength in numbers — 15M+ members",
      "SACCO model rewards loyal savers",
      "Trusted Equity Bank custodianship",
    ],
  },
  {
    id: "coop-maisha",
    icon: "🤝",
    name: "Co-op Maisha Fund",
    rate: "40% daily · loan eligible",
    ratePct: 14600,
    hook: "Digital SACCO. Real SACCO power. From KES 250.",
    description:
      "Digital SACCO powered by Co-operative Bank. Earn daily interest and unlock a loan at 2x your savings balance.",
    min: 250,
    pills: ["SACCO model", "Loan at 2x savings", "Daily interest"],
    color: "purple",
    payout: "Daily",
    risk: "Low",
    why: [
      "Loans at 2x your saved balance",
      "Co-operative Bank backed",
      "Real SACCO benefits, fully digital",
    ],
  },
  {
    id: "pesa-jar",
    icon: "🫙",
    name: "Daily Pesa Jar",
    rate: "40% daily · visual jar",
    ratePct: 14600,
    hook: "Watch your jar fill. Watch your money grow.",
    description:
      "Watch a jar fill up in real time on your dashboard. Every 10 days 1% is added automatically. Simple, visual, addictive.",
    min: 250,
    pills: ["Live visual jar", "No lock-in", "Auto-compounding"],
    color: "amber",
    payout: "Every 10 days",
    risk: "Low",
    why: [
      "Visual progress keeps you motivated",
      "Auto-compounding by default",
      "No fees, no lock-in",
    ],
  },
  {
    id: "mpesa-float",
    icon: "💸",
    name: "M-Pesa Float Pool",
    rate: "45% daily · agent float",
    ratePct: 16425,
    hook: "M-Pesa agents need your float. You earn while they serve.",
    description:
      "Lend your idle balance to verified M-Pesa agents for 24 hours. They need float to serve customers — you earn daily interest.",
    min: 250,
    pills: ["24hr lending cycles", "Daily payouts", "M-Pesa ecosystem"],
    color: "green",
    payout: "Daily",
    risk: "Medium",
    why: [
      "Powers Kenya's mobile money ecosystem",
      "Verified agents only — fully insured",
      "Short 24-hour cycles, daily payouts",
    ],
  },
  {
    id: "safaricom-hisa",
    icon: "📡",
    name: "Safaricom Hisa",
    rate: "35% daily + dividends",
    ratePct: 12775,
    hook: "Use Safaricom every day. Own a piece of it from KES 10.",
    description:
      "Fractional shares in Kenya's most profitable company. Dividends paid quarterly — your own personal Safaricom salary.",
    min: 10,
    pills: ["Quarterly dividends", "NSE listed", "Kenya's #1 stock"],
    color: "green",
    payout: "Quarterly",
    risk: "Medium",
    why: [
      "Own a slice of Kenya's #1 company",
      "Quarterly dividend payouts",
      "Capital growth as Safaricom grows",
    ],
  },
];

products.forEach((p) => {
  p.image = images[p.id];
});

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const colorMap: Record<
  Product["color"],
  { bg: string; text: string; bar: string; ring: string; from: string; to: string; pill: string }
> = {
  green: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    bar: "bg-emerald-500",
    ring: "ring-emerald-300",
    from: "from-emerald-500",
    to: "to-teal-600",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    bar: "bg-blue-500",
    ring: "ring-blue-300",
    from: "from-blue-600",
    to: "to-indigo-700",
    pill: "bg-blue-50 text-blue-700 border-blue-200",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    bar: "bg-amber-500",
    ring: "ring-amber-300",
    from: "from-amber-500",
    to: "to-orange-600",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    bar: "bg-purple-500",
    ring: "ring-purple-300",
    from: "from-fuchsia-500",
    to: "to-purple-700",
    pill: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  },
};

export const formatKES = (n: number) =>
  "KES " + Math.round(n).toLocaleString("en-KE");
