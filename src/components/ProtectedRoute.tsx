import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    let cancelled = false;
    void getCurrentUser().then((user) => {
      if (!cancelled) setState(user ? "in" : "out");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm font-semibold text-muted-foreground">Loading your account…</p>
      </div>
    );
  }

  if (state === "out") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
