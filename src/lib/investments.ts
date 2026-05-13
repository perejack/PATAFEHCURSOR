import { useEffect, useState } from "react";
import { products, type Product } from "./products";
import { getCurrentUser } from "./auth";
import { supabase } from "./supabase";

export type Investment = {
  id: string;
  productId: string;
  amount: number;
  investedAt: number; // ms
  method: "mpesa" | "bank" | "card";
};

export function getProductFor(inv: Investment): Product | undefined {
  return products.find((p) => p.id === inv.productId);
}

/** Current accrued earnings since investedAt, computed continuously. */
export function earningsNow(inv: Investment, now = Date.now()): number {
  const p = getProductFor(inv);
  if (!p) return 0;
  return accruedEarningsWithWeeklyRandomness(inv.amount, p.ratePct, inv.id, inv.investedAt, now);
}

export function projectEarnings(amount: number, ratePct: number, days: number) {
  return (amount * (ratePct / 100) * days) / 365;
}

/** Psychologically framed projection labels */
export function framedProjections(amount: number, ratePct: number) {
  const tomorrow = projectEarnings(amount, ratePct, 1);
  const week = projectEarnings(amount, ratePct, 7);
  const month = projectEarnings(amount, ratePct, 30);
  return { tomorrow, week, month };
}

/** React hook: returns investments + a tick that updates every second so earnings animate. */
export function useLiveInvestments() {
  const [items, setItems] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  useEffect(() => {
    let mounted = true;
    const onChange = () => {
      void loadInvestments().then((next) => {
        if (!mounted) return;
        setItems(next);
        setLoading(false);
      });
    };
    onChange();
    window.addEventListener("patafedha:investments", onChange as EventListener);
    return () => {
      mounted = false;
      window.removeEventListener("patafedha:investments", onChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return { items, loading };
}

export async function loadInvestments(): Promise<Investment[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("investments")
    .select("id, product_id, amount, invested_at, payment_method")
    .eq("user_id", user.id)
    .order("invested_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: String(row.id),
    productId: String(row.product_id),
    amount: Number(row.amount),
    investedAt: new Date(String(row.invested_at)).getTime(),
    method: (row.payment_method ?? "mpesa") as Investment["method"],
  }));
}

export async function addInvestment(inv: Investment) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Please login first");

  const { error } = await supabase.from("investments").insert({
    id: inv.id,
    user_id: user.id,
    product_id: inv.productId,
    amount: inv.amount,
    invested_at: new Date(inv.investedAt).toISOString(),
    payment_method: inv.method,
    status: "active",
  });
  if (error) throw error;

  await supabase.from("payment_transactions").insert({
    id: inv.id,
    user_id: user.id,
    amount: inv.amount,
    type: "deposit",
    method: inv.method,
    status: "completed",
    reference: inv.id,
    metadata: { productId: inv.productId },
  });

  window.dispatchEvent(new Event("patafedha:investments"));
}

export function canWithdrawAfter(investedAt: number) {
  return investedAt + 7 * 86_400_000;
}

export async function createWithdrawal(productId: string, amount: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Please login first");

  const requestId = crypto.randomUUID();
  const { error: withdrawalError } = await supabase.from("withdrawals").insert({
    id: requestId,
    user_id: user.id,
    product_id: productId,
    amount,
    status: "pending",
    available_at: new Date().toISOString(),
  });
  if (withdrawalError) throw withdrawalError;

  const { error: txError } = await supabase.from("payment_transactions").insert({
    id: `WD-${requestId}`,
    user_id: user.id,
    amount,
    type: "withdrawal",
    method: "mpesa",
    status: "pending",
    reference: requestId,
    metadata: { productId },
  });
  if (txError) throw txError;
}

function accruedEarningsWithWeeklyRandomness(
  amount: number,
  ratePct: number,
  investmentId: string,
  investedAt: number,
  now: number,
) {
  const dayMs = 86_400_000;
  if (now <= investedAt) return 0;
  const fullDays = Math.floor((now - investedAt) / dayMs);
  const partial = ((now - investedAt) % dayMs) / dayMs;

  let total = 0;
  for (let d = 0; d < fullDays; d++) {
    const dayDate = investedAt + d * dayMs;
    total += dailyRandomEarning(amount, ratePct, investmentId, dayDate);
  }
  total += dailyRandomEarning(amount, ratePct, investmentId, investedAt + fullDays * dayMs) * partial;
  return total;
}

function dailyRandomEarning(amount: number, ratePct: number, investmentId: string, dayMs: number) {
  const weekStart = startOfWeekUtc(dayMs);
  const expectedWeekly = projectEarnings(amount, ratePct, 7);
  const split = randomWeeklySplit(expectedWeekly, `${investmentId}:${weekStart}`);
  const dayIndex = Math.floor((dayMs - weekStart) / 86_400_000);
  return split[Math.max(0, Math.min(6, dayIndex))];
}

function randomWeeklySplit(total: number, seedKey: string) {
  const rand = mulberry32(hash(seedKey));
  const weights = Array.from({ length: 7 }, () => 0.7 + rand() * 0.6);
  const sum = weights.reduce((s, w) => s + w, 0);
  return weights.map((w) => (w / sum) * total);
}

function startOfWeekUtc(ms: number) {
  const date = new Date(ms);
  const day = date.getUTCDay();
  const mondayOffset = (day + 6) % 7;
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - mondayOffset);
  return date.getTime();
}

function hash(input: string) {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(seedFactory: () => number) {
  let a = seedFactory();
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
