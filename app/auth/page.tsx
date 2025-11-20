"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";
import { useAuth } from "../../context/auth-context";

export default function AuthPage() {
  const { user, authError, authLoading, signUp, signIn } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    try {
      if (mode === "signup") {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      // Error is handled in auth context
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome to 52 Weeks of Raja Yoga"
        subtitle="Create a free account to begin your 1-month trial and track your journey through the Yoga Sūtras."
      />

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`btn-ghost text-xs ${
                mode === "signup"
                  ? "border border-[hsla(var(--border),0.7)] bg-white/10"
                  : ""
              }`}
              onClick={() => {
                setMode("signup");
                setEmail("");
                setPassword("");
              }}
            >
              Sign up
            </button>
            <button
              type="button"
              className={`btn-ghost text-xs ${
                mode === "login"
                  ? "border border-[hsla(var(--border),0.7)] bg-white/10"
                  : ""
              }`}
              onClick={() => {
                setMode("login");
                setEmail("");
                setPassword("");
              }}
            >
              Log in
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[hsl(var(--muted))]">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[hsla(var(--border),0.7)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[hsl(var(--muted))]">
                Password
              </label>
              <input
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[hsla(var(--border),0.7)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))]"
                required
                minLength={6}
              />
            </div>

            {authError && (
              <p className="text-xs text-red-300">{authError}</p>
            )}

            <button
              type="submit"
              className="btn-primary mt-2"
              disabled={authLoading}
            >
              {authLoading
                ? mode === "signup"
                  ? "Creating account…"
                  : "Signing in…"
                : mode === "signup"
                ? "Create account"
                : "Sign in"}
            </button>

            <p className="mt-3 text-[10px] text-[hsl(var(--muted))]">
              Your account is used to sync your 52-week journey and manage your
              free trial and future subscription.
            </p>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}

