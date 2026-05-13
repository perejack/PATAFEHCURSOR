import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Zap, Users, Star, CheckCircle2, PiggyBank, LineChart, Smartphone } from "lucide-react";
import landingHero from "@/assets/landing-page-hero.jpg";
import featureGrow from "@/assets/landing-feature-grow.jpg";
import community from "@/assets/landing-community.jpg";

export function LandingScreen() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-md">
              <Sparkles className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div>
              <p className="text-base font-extrabold leading-none tracking-tight">PataFedha</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Get Money</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#trust" className="hover:text-foreground">Trust</a>
          </nav>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            Open App <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Sparkles className="h-3 w-3" /> Kenya's #1 Micro-Investment App
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Get Money.
              </span>
              <br />
              <span className="bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                Every Single Day.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Start investing from <span className="font-bold text-emerald-700">KES 250</span> in M-Pesa Plus, KCB Wekeza,
              Safaricom Hisa and more. Watch your money grow daily — straight from your phone.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105 active:scale-95"
              >
                Launch Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                See how it works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600" /> CBK Licensed</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-blue-600" /> CMA Regulated</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9 · 12K reviews</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-400/40 via-amber-300/30 to-fuchsia-400/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/30 shadow-2xl backdrop-blur">
              <img
                src={landingHero}
                alt="A young Kenyan investor growing wealth on PataFedha"
                width={1536}
                height={1280}
                className="h-full w-full object-cover"
              />
              {/* Floating stat cards */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">Today</p>
                  <p className="text-sm font-bold text-emerald-700">+KES 1,240</p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">Members</p>
                  <p className="text-sm font-bold text-fuchsia-700">50,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee stats */}
        <div className="border-y border-border/60 bg-muted/40">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-5 py-6 md:grid-cols-4">
            {[
              { k: "KES 2.4B+", v: "Invested" },
              { k: "50,000+", v: "Active Kenyans" },
              { k: "10%", v: "Daily yield" },
              { k: "4.9★", v: "App rating" },
            ].map((s) => (
              <div key={s.v} className="text-center">
                <p className="text-2xl font-extrabold tracking-tight md:text-3xl bg-gradient-to-r from-emerald-700 to-teal-500 bg-clip-text text-transparent">
                  {s.k}
                </p>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative mx-auto w-full max-w-6xl px-5 py-20">
        <div className="mb-12 max-w-2xl">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            Why PataFedha
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            Built for the{" "}
            <span className="bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-transparent">
              hustler
            </span>
            , the{" "}
            <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
              saver
            </span>
            , and the{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              dreamer
            </span>
            .
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: PiggyBank,
              title: "Start from KES 250",
              desc: "No big capital, no waiting. Top up directly from M-Pesa in seconds.",
              from: "from-emerald-500", to: "to-teal-500", bg: "bg-emerald-50", text: "text-emerald-700",
            },
            {
              icon: LineChart,
              title: "Daily growth, visible",
              desc: "Watch your earnings tick up live. No guesswork, no hidden fees.",
              from: "from-blue-500", to: "to-indigo-500", bg: "bg-blue-50", text: "text-blue-700",
            },
            {
              icon: ShieldCheck,
              title: "Regulated & safe",
              desc: "CBK licensed, CMA regulated. Your money protected by Kenyan law.",
              from: "from-fuchsia-500", to: "to-rose-500", bg: "bg-fuchsia-50", text: "text-fuchsia-700",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-3xl border border-border bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.from} ${f.to} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`} />
              <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${f.bg} ${f.text}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="relative mt-4 text-lg font-bold">{f.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Feature highlight with image */}
        <div className="mt-16 grid items-center gap-10 rounded-[2rem] border border-border bg-gradient-to-br from-emerald-50 via-amber-50 to-rose-50 p-6 md:grid-cols-2 md:p-12">
          <div>
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
              Live earnings
            </span>
            <h3 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
              Your money,{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                growing in real-time
              </span>
              .
            </h3>
            <p className="mt-4 text-base text-muted-foreground">
              Every second your portfolio earns. See the counter tick. See the progress. Withdraw to M-Pesa
              instantly, anytime.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Instant M-Pesa deposits & withdrawals", "Daily yield up to 10%", "Smart goal tracker", "Quarterly NSE dividends"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-foreground">{t}</span>
                  </li>
                )
              )}
            </ul>
            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-foreground px-6 py-3 text-sm font-bold text-background shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Try it now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-300/40 to-emerald-300/40 blur-2xl" />
            <img
              src={featureGrow}
              alt="Stacks of coins growing on a smartphone"
              width={1024}
              height={1024}
              loading="lazy"
              className="relative w-full rounded-[2rem] object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* COMMUNITY / HOW */}
      <section id="how" className="relative bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(29,158,117,0.5), transparent 40%), radial-gradient(circle at 80% 60%, rgba(168,85,247,0.4), transparent 40%)" }} />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-fuchsia-500/40 to-blue-500/40 blur-2xl" />
            <img
              src={community}
              alt="Happy Kenyan investors community"
              width={1280}
              height={896}
              loading="lazy"
              className="relative w-full rounded-[2rem] object-cover shadow-2xl"
            />
          </div>
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur">
              Join the movement
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
              50,000 Kenyans are already{" "}
              <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent">
                getting money
              </span>
              .
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              From Nairobi to Kisumu, Mombasa to Eldoret — students, boda riders, mama mbogas and CEOs
              are all building wealth, one daily yield at a time.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { n: 1, t: "Sign up in 60 seconds", d: "Just your phone number. No paperwork." },
                { n: 2, t: "Top up from M-Pesa", d: "Start with as little as KES 250." },
                { n: 3, t: "Watch it grow daily", d: "Withdraw anytime, straight to your phone." },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-extrabold text-white shadow-lg">
                    {s.n}
                  </div>
                  <div>
                    <p className="text-base font-bold">{s.t}</p>
                    <p className="text-sm text-white/60">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-emerald-900 shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              <Smartphone className="h-4 w-4" /> Open the app
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="trust" className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-10 text-center text-white shadow-2xl md:p-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl" />

          <Zap className="mx-auto h-10 w-10 text-amber-300" />
          <h2 className="relative mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
            Ready to start getting money?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base text-white/80 md:text-lg">
            Open your dashboard now. Your first KES 250 could be earning by tonight.
          </p>
          <Link
            to="/signup"
            className="relative mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-extrabold text-emerald-700 shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            Launch Dashboard <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} PataFedha. CBK Licensed · CMA Regulated.</p>
          <p>Made with 💚 in Nairobi, Kenya.</p>
        </div>
      </footer>
    </div>
  );
}
