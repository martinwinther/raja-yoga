"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";
import { useAuth } from "../../context/auth-context";

export default function AuthPage() {
  const { user, authError, authLoading, signUp, signIn, resendVerificationEmail } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  useEffect(() => {
    if (user && user.emailVerified) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    try {
      if (mode === "signup") {
        await signUp(email, password);
        setShowVerificationMessage(true);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      // Error is handled in auth context
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
    } catch (error) {
      // Error is handled in auth context
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome to Daily Sutra"
        subtitle="Create a free account to begin your 1-month trial and track your journey through the Yoga Sūtras."
      />

      <GlassCard>
        {user && !user.emailVerified && (
          <div className="mb-4 rounded-lg bg-blue-500/20 border border-blue-400/30 px-4 py-3">
            <p className="text-sm text-blue-100 mb-2">
              Please check your email and click the verification link to complete your account setup.
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              className="text-xs text-blue-200 hover:text-blue-100 underline"
              disabled={authLoading}
            >
              {authLoading ? "Sending..." : "Resend verification email"}
            </button>
          </div>
        )}
        
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                mode === "signup"
                  ? "text-[hsl(var(--accent))] bg-[hsla(var(--accent),0.15)] backdrop-blur-sm"
                  : "text-[hsl(var(--muted))] hover:text-[hsl(var(--text))] hover:bg-white/5"
              }`}
              onClick={() => {
                setMode("signup");
                setEmail("");
                setPassword("");
              }}
            >
              Sign up
              {mode === "signup" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--accent))] rounded-full" />
              )}
            </button>
            <button
              type="button"
              className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                mode === "login"
                  ? "text-[hsl(var(--accent))] bg-[hsla(var(--accent),0.15)] backdrop-blur-sm"
                  : "text-[hsl(var(--muted))] hover:text-[hsl(var(--text))] hover:bg-white/5"
              }`}
              onClick={() => {
                setMode("login");
                setEmail("");
                setPassword("");
              }}
            >
              Log in
              {mode === "login" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--accent))] rounded-full" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-medium text-[hsl(var(--muted))]">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[hsla(var(--border),0.7)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))]"
                required
                aria-required="true"
                aria-invalid={authError ? "true" : "false"}
                aria-describedby={authError ? "email-error" : undefined}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-medium text-[hsl(var(--muted))]">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[hsla(var(--border),0.7)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))]"
                required
                minLength={6}
                aria-required="true"
                aria-invalid={authError ? "true" : "false"}
                aria-describedby={authError ? "password-error" : "password-help"}
              />
              <p id="password-help" className="sr-only">
                Password must be at least 6 characters long
              </p>
            </div>

            {authError && (
              <div role="alert" aria-live="assertive">
                <p id="email-error" className="text-xs text-red-300">{authError}</p>
                <p id="password-error" className="sr-only">{authError}</p>
              </div>
            )}

            {showVerificationMessage && (
              <div role="status" aria-live="polite">
                <p className="text-xs text-green-300">
                  Account created! Please check your email for a verification link.
                </p>
              </div>
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

