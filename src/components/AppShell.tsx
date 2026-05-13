import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-muted">
        <div className="relative mx-auto flex min-h-screen w-full max-w-[420px] items-center justify-center bg-background">
          <p className="text-sm font-semibold text-muted-foreground">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-muted">
      <div className="relative mx-auto min-h-screen w-full max-w-[420px] bg-background pb-24 shadow-[0_0_40px_-10px_rgba(0,0,0,0.08)]">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
