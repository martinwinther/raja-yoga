"use client";

import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // For now, we'll use a mailto link approach
    // In production, you might want to use a service like Formspree, SendGrid, or an API route
    const subject = encodeURIComponent("Contact from Daily Sutra");
    const body = encodeURIComponent(
      `Email: ${email}\n\nMessage:\n${message}`
    );
    const mailtoLink = `mailto:support@dailysutra.app?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Us"
        subtitle="We&apos;re here to help. Reach out with questions, feedback, or support requests."
      />

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm">
          <h2 className="text-sm font-medium text-[hsl(var(--text))] mb-2">
            Get in Touch
          </h2>
          <p className="text-sm text-[hsl(var(--muted))] mb-4">
            For support, questions, or feedback, please use the form below or email us directly at{" "}
            <a
              href="mailto:support@dailysutra.app"
              className="text-[hsl(var(--accent))] hover:underline"
            >
              support@dailysutra.app
            </a>
            . We typically respond within 48 hours.
          </p>

          {submitted ? (
            <div className="rounded-lg bg-green-500/20 border border-green-400/30 px-4 py-3">
              <p className="text-sm text-green-100">
                Thank you! Your email client should open with your message. If it doesn&apos;t, please email us directly at{" "}
                <a
                  href="mailto:support@dailysutra.app"
                  className="underline"
                >
                  support@dailysutra.app
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm text-[hsl(var(--muted))]">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm text-[hsl(var(--muted))]">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7"
                  placeholder="How can we help you?"
                />
              </div>

              {error && (
                <p className="text-xs text-red-300">{error}</p>
              )}

              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm">
          <h2 className="text-sm font-medium text-[hsl(var(--text))] mb-2">
            Other Ways to Reach Us
          </h2>
          <ul className="space-y-2 text-sm text-[hsl(var(--muted))]">
            <li>
              <strong className="text-[hsl(var(--text))]">Email:</strong>{" "}
              <a
                href="mailto:support@dailysutra.app"
                className="text-[hsl(var(--accent))] hover:underline"
              >
                support@dailysutra.app
              </a>
            </li>
            <li>
              <strong className="text-[hsl(var(--text))]">Response Time:</strong> We typically respond within 48 hours during business days.
            </li>
          </ul>
        </div>
      </GlassCard>
    </div>
  );
}

