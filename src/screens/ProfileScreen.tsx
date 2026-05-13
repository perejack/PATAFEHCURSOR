import { AppShell } from "@/components/AppShell";
import {
  ChevronRight,
  Download,
  FileText,
  Gift,
  HelpCircle,
  History,
  LogOut,
  Settings,
  Trophy,
} from "lucide-react";
import avatarJames from "@/assets/avatar-james.jpg";
import { signOutUser, useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

const items = [
  { icon: Gift, label: "Referral Program", value: "8 friends · KES 1,200" },
  { icon: History, label: "Investment History", value: "142 days" },
  { icon: Download, label: "Download Statement", value: "PDF / CSV" },
  { icon: Settings, label: "Notification Settings", value: "" },
  { icon: HelpCircle, label: "Help & Support", value: "" },
  { icon: FileText, label: "Terms & Conditions", value: "" },
];

const milestones = [
  { icon: "🎯", t: "First KES 100 earned", earned: true },
  { icon: "🚀", t: "First KES 1,000 earned", earned: true },
  { icon: "🔥", t: "30-day streak", earned: true },
  { icon: "💎", t: "First KES 10,000", earned: false },
];

export function ProfileScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell>
      <header className="bg-gradient-to-b from-primary-soft to-transparent px-5 pb-2 pt-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={avatarJames}
              alt="James"
              className="h-20 w-20 rounded-full border-4 border-background object-cover shadow-elevated"
            />
            <span className="absolute -bottom-1 right-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-[9px] font-bold uppercase text-white shadow-sm">
              Gold
            </span>
          </div>
          <h2 className="mt-3 text-xl font-bold text-foreground">
            {(user?.user_metadata?.full_name as string | undefined) ?? "PataFedha Member"}
          </h2>
          <p className="text-xs text-muted-foreground">{user?.email ?? "No email found"}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-semibold text-amber-600 shadow-card">
            <Trophy className="h-3.5 w-3.5" /> Gold Member
          </div>
        </div>
      </header>

      {/* Referral highlight */}
      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-bright p-4 text-white shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium opacity-80">Earn KES 150 per friend</p>
              <p className="text-lg font-bold">Your referral code</p>
            </div>
            <Gift className="h-8 w-8 opacity-60" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-xl bg-white/20 px-3 py-2 font-mono text-sm font-bold tracking-widest backdrop-blur">
              JAMES150
            </span>
            <button className="ml-auto rounded-xl bg-white px-4 py-2 text-xs font-bold text-primary">
              Share
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="opacity-70">Friends referred</p>
              <p className="text-base font-bold">8</p>
            </div>
            <div>
              <p className="opacity-70">Bonus earned</p>
              <p className="text-base font-bold">KES 1,200</p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="mt-6 px-5">
        <h2 className="text-base font-bold text-foreground">Your Badges</h2>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {milestones.map((m) => (
            <div
              key={m.t}
              className={`flex flex-col items-center rounded-2xl border p-2.5 text-center ${
                m.earned ? "border-primary/30 bg-primary-soft" : "border-border bg-card opacity-50"
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <p className="mt-1 text-[10px] font-medium leading-tight text-foreground">{m.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section className="mt-6 px-5">
        <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-card">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <button
                key={it.label}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-muted ${
                  i !== items.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{it.label}</p>
                </div>
                <div className="flex items-center gap-2">
                  {it.value && (
                    <span
                      className={`text-xs font-medium ${
                        it.verified ? "text-primary-bright" : "text-muted-foreground"
                      }`}
                    >
                      {it.verified && "✓ "}
                      {it.value}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-4 px-5">
        <button
          onClick={async () => {
            await signOutUser();
            await navigate({ to: "/login" });
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 py-3.5 text-sm font-semibold text-destructive active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </section>

      <p className="mt-6 px-5 text-center text-[10px] text-muted-foreground">
        PataFedha v1.0 · CBK Licensed · CMA Regulated
      </p>
    </AppShell>
  );
}
