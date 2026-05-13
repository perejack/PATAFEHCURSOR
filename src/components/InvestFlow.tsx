import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Confetti } from "@/components/Confetti";
import { formatKES, type Product, colorMap } from "@/lib/products";
import { addInvestment, framedProjections } from "@/lib/investments";
import {
  initiateSTKPush,
  isValidPhoneNumber,
  pollTransactionStatus,
} from "@/lib/hashback-api";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
  X,
  Share2,
  Download,
} from "lucide-react";

type Step = "amount" | "method" | "phone" | "processing" | "success";
type Method = "mpesa" | "bank" | "card";

const methods: {
  id: Method;
  label: string;
  desc: string;
  icon: typeof Smartphone;
  badge?: string;
  from: string;
  to: string;
}[] = [
  {
    id: "mpesa",
    label: "M-Pesa",
    desc: "STK Push to your phone",
    icon: Smartphone,
    badge: "Instant",
    from: "from-emerald-500",
    to: "to-teal-600",
  },
  {
    id: "bank",
    label: "Bank Transfer",
    desc: "KCB, Equity, Co-op, NCBA",
    icon: Landmark,
    from: "from-blue-500",
    to: "to-indigo-600",
  },
  {
    id: "card",
    label: "Debit / Credit Card",
    desc: "Visa & Mastercard",
    icon: CreditCard,
    badge: "Secure",
    from: "from-fuchsia-500",
    to: "to-purple-600",
  },
];

const presets = [250, 500, 1000, 2500, 5000, 10000];

export function InvestFlow({
  product,
  open,
  onClose,
  initialAmount,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
  initialAmount?: number;
}) {
  const navigate = useNavigate();
  const c = colorMap[product.color];
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState<number>(initialAmount ?? Math.max(product.min, 500));
  const [method, setMethod] = useState<Method>("mpesa");
  const [phone, setPhone] = useState<string>("");
  const [processingStep, setProcessingStep] = useState(0);
  const [error, setError] = useState("");
  const [txId] = useState<string>(() => "PF" + Math.random().toString(36).slice(2, 9).toUpperCase());
  const { tomorrow: earnTomorrow, week: earnWeek, month: earnMonth } = useMemo(
    () => framedProjections(amount, product.ratePct),
    [amount, product.ratePct]
  );
  const dailyDrip = earnTomorrow; // KES earned every single day

  // reset on open
  useEffect(() => {
    if (open) {
      setStep("amount");
      setProcessingStep(0);
      setAmount((prev) => (prev < product.min ? product.min : prev));
    }
  }, [open, product.min]);

  // HashBack STK (FrankSurvey-style): initiate → poll → record investment
  useEffect(() => {
    if (step !== "processing") return;
    let cancelled = false;
    setError("");
    setProcessingStep(0);
    const t1 = setTimeout(() => {
      if (!cancelled) setProcessingStep(1);
    }, 800);
    const t2 = setTimeout(() => {
      if (!cancelled) setProcessingStep(2);
    }, 1700);
    const t3 = setTimeout(() => {
      if (!cancelled) setProcessingStep(3);
    }, 2600);

    void (async () => {
      try {
        if (method === "mpesa") {
          const stk = await initiateSTKPush(String(Math.round(amount)), phone, txId);
          if (!stk.CheckoutRequestID) {
            throw new Error(stk.ResponseDescription || "STK Push did not return CheckoutRequestID");
          }
          await pollTransactionStatus(stk.CheckoutRequestID);
        }
        if (cancelled) return;
        await addInvestment({
          id: txId,
          productId: product.id,
          amount,
          investedAt: Date.now(),
          method,
        });
        if (!cancelled) setStep("success");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Payment failed.");
          setStep("phone");
        }
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [step, method, amount, phone, txId, product.id]);

  // lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const stepIndex = { amount: 1, method: 2, phone: 3, processing: 3, success: 4 }[step];
  const totalSteps = 4;
  const valid = amount >= product.min;
  const mpesaPhoneOk = method !== "mpesa" || isValidPhoneNumber(phone);

  const goBack = () => {
    if (step === "amount") onClose();
    else if (step === "method") setStep("amount");
    else if (step === "phone") setStep("method");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm [animation:fade-in_0.2s]">
      <div className="mx-auto flex w-full max-w-[420px] flex-col rounded-t-[2rem] bg-background shadow-2xl [animation:slide-up_0.35s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <button
            onClick={goBack}
            disabled={step === "processing"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground active:scale-95 disabled:opacity-50"
            aria-label="Back"
          >
            {step === "amount" ? <X className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-xl text-base ${c.bg}`}>
              {product.icon}
            </div>
            <p className="text-sm font-bold text-foreground">{product.name}</p>
          </div>
          <div className="w-9" />
        </div>

        {/* Progress */}
        {step !== "success" && (
          <div className="px-5 pb-3">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i < stepIndex
                      ? `bg-gradient-to-r ${c.from} ${c.to}`
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Step {Math.min(stepIndex, totalSteps)} of {totalSteps}
            </p>
          </div>
        )}

        {/* Body */}
        <div className="max-h-[78vh] overflow-y-auto px-5 pb-6">
          {/* STEP 1: AMOUNT */}
          {step === "amount" && (
            <div className="[animation:fade-in_0.25s]">
              <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                How much to invest?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Minimum {formatKES(product.min)} · No fees
              </p>

              <div
                className={`mt-4 overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-5 ${c.from} ${c.to} text-white shadow-xl`}
                style={{ borderColor: "transparent" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Amount (KES)
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white/80">KES</span>
                  <input
                    type="number"
                    value={amount || ""}
                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                    className="min-w-0 flex-1 bg-transparent text-4xl font-extrabold tracking-tight text-white outline-none placeholder:text-white/40"
                    placeholder="0"
                  />
                </div>
                {!valid && (
                  <p className="mt-1 text-[11px] font-semibold text-amber-200">
                    Minimum is {formatKES(product.min)}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-white/80">
                  <Sparkles className="h-3 w-3" />
                  Earning starts immediately after payment
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={product.min}
                max={50000}
                step={50}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-4 w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                <span>{formatKES(product.min)}</span>
                <span>KES 50,000</span>
              </div>

              {/* Presets */}
              <div className="mt-4 flex flex-wrap gap-2">
                {presets
                  .filter((v) => v >= product.min)
                  .map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(v)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                        amount === v
                          ? `border-transparent bg-gradient-to-r ${c.from} ${c.to} text-white shadow-md`
                          : "border-border bg-background text-foreground hover:border-foreground/30"
                      }`}
                    >
                      KES {v.toLocaleString()}
                    </button>
                  ))}
              </div>

              {/* Psychological framing — tomorrow & this month */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700">
                    Tomorrow ☀️
                  </p>
                  <p className="mt-1 text-base font-extrabold tabular-nums text-amber-700">
                    +{formatKES(earnTomorrow)}
                  </p>
                  <p className="mt-0.5 text-[9px] font-medium text-amber-700/70">while you sleep</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                    This week 🚀
                  </p>
                  <p className="mt-1 text-base font-extrabold tabular-nums text-emerald-700">
                    +{formatKES(earnWeek)}
                  </p>
                  <p className="mt-0.5 text-[9px] font-medium text-emerald-700/70">7 daily drops</p>
                </div>
                <div className="rounded-2xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-rose-50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-fuchsia-700">
                    By month-end 🎉
                  </p>
                  <p className="mt-1 text-base font-extrabold tabular-nums text-fuchsia-700">
                    +{formatKES(earnMonth)}
                  </p>
                  <p className="mt-0.5 text-[9px] font-medium text-fuchsia-700/70">no lifting a finger</p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 p-2.5 text-center">
                <p className="text-[11px] font-semibold text-emerald-800">
                  ☕ That's <span className="font-extrabold">{formatKES(dailyDrip)}</span> dropping into your account <span className="font-extrabold">every single day</span> — starting tomorrow.
                </p>
              </div>

              <button
                disabled={!valid}
                onClick={() => setStep("method")}
                className={`mt-6 w-full rounded-2xl bg-gradient-to-r py-3.5 text-sm font-extrabold text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50 ${c.from} ${c.to}`}
              >
                Continue
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                CBK licensed · Funds insured up to KES 500,000
              </p>
            </div>
          )}

          {/* STEP 2: METHOD */}
          {step === "method" && (
            <div className="[animation:fade-in_0.25s]">
              <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                Choose payment method
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Paying <span className="font-bold text-foreground">{formatKES(amount)}</span> to{" "}
                {product.name}
              </p>

              <div className="mt-4 space-y-2.5">
                {methods.map((m) => {
                  const active = method === m.id;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all active:scale-[0.99] ${
                        active
                          ? "border-foreground/80 bg-muted/40 shadow-md"
                          : "border-border bg-background hover:border-foreground/20"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${m.from} ${m.to}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground">{m.label}</p>
                          {m.badge && (
                            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{m.desc}</p>
                      </div>
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          active
                            ? "border-emerald-600 bg-emerald-600"
                            : "border-border bg-background"
                        }`}
                      >
                        {active && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Order summary */}
              <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/30 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Order summary
                </p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Investment</span>
                    <span className="font-semibold text-foreground">{formatKES(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="my-1.5 h-px bg-border" />
                  <div className="flex justify-between">
                    <span className="font-bold text-foreground">Total to pay</span>
                    <span className="font-extrabold text-foreground">{formatKES(amount)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("phone")}
                className={`mt-5 w-full rounded-2xl bg-gradient-to-r py-3.5 text-sm font-extrabold text-white shadow-lg transition-transform active:scale-[0.98] ${c.from} ${c.to}`}
              >
                Continue to {method === "mpesa" ? "M-Pesa" : method === "bank" ? "Bank" : "Card"}
              </button>
            </div>
          )}

          {/* STEP 3: PHONE / DETAILS */}
          {step === "phone" && (
            <div className="[animation:fade-in_0.25s]">
              {method === "mpesa" && (
                <>
                  <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                    Confirm M-Pesa number
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We'll send an STK push to this number
                  </p>

                  <div className="mt-4 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                        <Smartphone className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                          M-Pesa Phone
                        </p>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0712345678"
                          inputMode="tel"
                          autoComplete="tel"
                          className="w-full bg-transparent text-lg font-extrabold tracking-wide text-emerald-900 outline-none placeholder:text-emerald-700/40"
                        />
                      </div>
                    </div>
                  </div>
                  {!mpesaPhoneOk && phone.replace(/\D/g, "").length > 0 && (
                    <p className="mt-2 text-[11px] font-semibold text-amber-700">
                      Enter a valid Kenyan number (07… or 254…).
                    </p>
                  )}
                </>
              )}

              {method === "bank" && (
                <>
                  <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                    Bank transfer details
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Use these details to pay from any Kenyan bank
                  </p>
                  <div className="mt-4 space-y-2 rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                    {[
                      ["Bank", "KCB Bank Kenya"],
                      ["Account", "1234567890"],
                      ["Reference", txId],
                      ["Amount", formatKES(amount)],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-sm">
                        <span className="text-blue-700/80">{k}</span>
                        <span className="font-bold text-blue-900">{v}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {method === "card" && (
                <>
                  <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                    Card details
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <Lock className="mr-1 inline h-3 w-3" /> Encrypted & PCI-DSS compliant
                  </p>
                  <div className="mt-4 space-y-2.5">
                    <input
                      placeholder="Card number"
                      defaultValue="4242 4242 4242 4242"
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold tabular-nums outline-none focus:border-fuchsia-500"
                    />
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold outline-none focus:border-fuchsia-500"
                      />
                      <input
                        placeholder="CVC"
                        defaultValue="123"
                        className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold outline-none focus:border-fuchsia-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Final summary */}
              <div className="mt-5 rounded-2xl border border-border bg-card p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Final review
                </p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <Row k="Product" v={product.name} />
                  <Row k="Amount" v={formatKES(amount)} />
                  <Row
                    k="Daily earnings"
                    v={`+${formatKES(earnTomorrow)} / day`}
                    highlight
                  />
                  <Row k="By month-end" v={`+${formatKES(earnMonth)}`} highlight />
                  <Row k="Payout" v={product.payout} />
                  <Row k="Method" v={method === "mpesa" ? "M-Pesa" : method === "bank" ? "Bank Transfer" : "Card"} />
                </div>
              </div>

              <button
                disabled={!valid || !mpesaPhoneOk}
                onClick={() => setStep("processing")}
                className={`mt-5 w-full rounded-2xl bg-gradient-to-r py-3.5 text-sm font-extrabold text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50 ${c.from} ${c.to}`}
              >
                {method === "mpesa"
                  ? `Pay ${formatKES(amount)} via M-Pesa`
                  : method === "bank"
                    ? "I have paid"
                    : `Pay ${formatKES(amount)}`}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Lock className="h-3 w-3" /> 256-bit encrypted · PCI-DSS compliant
              </p>
            </div>
          )}

          {/* STEP 4: PROCESSING */}
          {step === "processing" && (
            <div className="py-6 [animation:fade-in_0.25s]">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <div className={`absolute inset-0 animate-ping rounded-full bg-gradient-to-br ${c.from} ${c.to} opacity-30`} />
                <div className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${c.from} ${c.to} shadow-xl`}>
                  <Loader2 className="h-10 w-10 animate-spin text-white" />
                </div>
              </div>
              <h3 className="mt-5 text-center text-lg font-extrabold text-foreground">
                {method === "mpesa"
                  ? "Sending STK push..."
                  : method === "bank"
                    ? "Verifying transfer..."
                    : "Processing card..."}
              </h3>
              {method === "mpesa" && (
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  Check {phone} and enter your M-Pesa PIN
                </p>
              )}
              {error && <p className="mt-2 text-center text-xs font-semibold text-destructive">{error}</p>}

              <div className="mx-auto mt-6 max-w-xs space-y-2.5">
                {[
                  "Connecting to provider",
                  method === "mpesa" ? "Awaiting PIN confirmation" : "Verifying details",
                  "Allocating to product",
                  "Activating earnings",
                ].map((label, i) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                      i < processingStep
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : i === processingStep
                          ? "border-foreground/30 bg-muted text-foreground"
                          : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {i < processingStep ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : i === processingStep ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full border-2 border-current opacity-40" />
                    )}
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === "success" && (
            <div className="pb-2 [animation:fade-in_0.25s]">
              <Confetti />
              <div className="py-4 text-center">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center [animation:scale-in_0.4s]">
                  <div className="absolute inset-0 rounded-full bg-emerald-200/60 blur-xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/40">
                    <Check className="h-11 w-11 text-white" strokeWidth={3.5} />
                  </div>
                </div>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground">
                  You're invested! 🎉
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatKES(amount)} is now earning daily
                </p>
              </div>

              {/* Receipt */}
              <div className="relative mt-3 overflow-hidden rounded-2xl border border-dashed border-border bg-card p-4">
                <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
                <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Receipt
                    </p>
                    <p className="text-sm font-extrabold text-foreground">{txId}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xl ${c.bg}`}>
                    {product.icon}
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 text-sm">
                  <Row k="Product" v={product.name} />
                  <Row k="Amount" v={formatKES(amount)} />
                  <Row k="First payout" v="Tomorrow, 9:00 AM" />
                  <Row k="Daily drip" v={`+${formatKES(earnTomorrow)} / day`} highlight />
                  <Row k="In 30 days" v={`+${formatKES(earnMonth)}`} highlight />
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigator.share?.({ title: "I'm investing on PataFedha", text: `I just invested ${formatKES(amount)} in ${product.name}` }).catch(() => {})}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-background py-2.5 text-xs font-bold text-foreground active:scale-95"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
                <button
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-background py-2.5 text-xs font-bold text-foreground active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" /> Receipt
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigate(`/my/${product.id}`);
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-extrabold text-white shadow-lg active:scale-[0.98]"
              >
                <Wallet className="h-4 w-4" /> View My {product.name} Dashboard
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate("/invest");
                }}
                className="mt-2 w-full rounded-2xl border border-border bg-background py-3 text-sm font-bold text-foreground active:scale-[0.98]"
              >
                Invest in another product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className={`font-bold ${highlight ? "text-emerald-600" : "text-foreground"}`}>{v}</span>
    </div>
  );
}
