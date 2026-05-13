import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { Sparkles } from "lucide-react";

export function AuthScreen({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, fullName);
      }
      await navigate({ to: "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-muted">
      <div className="relative mx-auto min-h-screen w-full max-w-[420px] bg-background p-6">
        <Link to="/" className="text-xs font-semibold text-primary-bright">
          ← Back to home
        </Link>
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-foreground">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin ? "Login to access your live investments." : "Sign up to start investing with real data."}
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-3">
          {!isLogin && (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Please wait..." : isLogin ? "Login" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? "No account yet?" : "Already have an account?"}{" "}
          <Link to={isLogin ? "/signup" : "/login"} className="font-bold text-primary">
            {isLogin ? "Sign up" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}
