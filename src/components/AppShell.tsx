import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-muted">
      <div className="relative mx-auto min-h-screen w-full max-w-[420px] bg-background pb-24 shadow-[0_0_40px_-10px_rgba(0,0,0,0.08)]">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
