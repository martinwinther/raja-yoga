import Link from "next/link";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information."
      />

      <GlassCard>
        <div className="space-y-6 text-sm text-[hsl(var(--muted))]">
          <section>
            <p className="text-xs text-[hsl(var(--muted))] mb-4">
              <strong className="text-[hsl(var(--text))]">Last Updated:</strong> January 2025
            </p>
            <p>
              This Privacy Policy describes how Daily Sutra (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects, uses, and protects your personal information when you use our service. By using Daily Sutra, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              1. Information We Collect
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-[hsl(var(--text))] mb-1">
                  Account Information
                </h3>
                <p>
                  When you create an account, we collect your email address and a password (which is encrypted and not accessible to us).
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[hsl(var(--text))] mb-1">
                  Journey Data
                </h3>
                <p>
                  We store your practice progress, including daily check-ins, notes, weekly reflections, bookmarks, and your journey start date. This data is associated with your account and synced across your devices.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[hsl(var(--text))] mb-1">
                  Subscription Information
                </h3>
                <p>
                  If you upgrade to a paid subscription, we store your subscription status and payment-related metadata (processed securely through Stripe, our payment processor).
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[hsl(var(--text))] mb-1">
                  Notification Preferences
                </h3>
                <p>
                  If you enable push notifications, we store your notification preferences and device tokens to send you reminders.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To provide and maintain our service</li>
              <li>To sync your journey data across devices</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send you push notifications (if enabled)</li>
              <li>To respond to your support requests</li>
              <li>To improve our service and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              3. Data Storage and Security
            </h2>
            <p className="mb-3">
              Your data is stored securely using Firebase (Google Cloud Platform). We use industry-standard security measures including:
            </p>
            <ul className="space-y-2 list-disc list-inside mb-3">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure authentication via Firebase Auth</li>
              <li>Access controls and security rules</li>
            </ul>
            <p>
              While we implement reasonable security measures, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              4. Third-Party Services
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-[hsl(var(--text))] mb-1">
                  Firebase (Google)
                </h3>
                <p>
                  We use Firebase for authentication, data storage, push notifications, and analytics. Firebase&apos;s privacy practices are governed by Google&apos;s Privacy Policy. Your data is stored in Firebase&apos;s secure cloud infrastructure.
                </p>
                <p className="mt-2">
                  <strong className="text-[hsl(var(--text))]">Analytics:</strong> We use Firebase Analytics to understand how users interact with our service, including page views, feature usage, and conversion events. This helps us improve the service. Analytics data is anonymized and aggregated.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[hsl(var(--text))] mb-1">
                  Stripe
                </h3>
                <p>
                  We use Stripe to process payments. Stripe collects and processes payment information according to their Privacy Policy. We do not store your full payment card details; this information is handled securely by Stripe.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              5. Cookies and Local Storage
            </h2>
            <p className="mb-3">
              We use the following technologies to store information:
            </p>
            <ul className="space-y-2 list-disc list-inside mb-3">
              <li>
                <strong className="text-[hsl(var(--text))]">Local Storage:</strong> We store your journey progress locally in your browser&apos;s local storage for faster access and offline functionality.
              </li>
              <li>
                <strong className="text-[hsl(var(--text))]">Firebase Cookies:</strong> Firebase uses cookies for authentication and session management.
              </li>
            </ul>
            <p>
              You can disable cookies in your browser settings, though this may affect the functionality of our service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              6. Your Rights (GDPR & CCPA)
            </h2>
            <p className="mb-3">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="space-y-2 list-disc list-inside mb-3">
              <li>
                <strong className="text-[hsl(var(--text))]">Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong className="text-[hsl(var(--text))]">Rectification:</strong> Correct inaccurate or incomplete data
              </li>
              <li>
                <strong className="text-[hsl(var(--text))]">Erasure:</strong> Request deletion of your account and data
              </li>
              <li>
                <strong className="text-[hsl(var(--text))]">Portability:</strong> Export your data in a machine-readable format (available in Settings)
              </li>
              <li>
                <strong className="text-[hsl(var(--text))]">Objection:</strong> Object to processing of your data
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:support@dailysutra.app"
                className="text-[hsl(var(--accent))] hover:underline"
              >
                support@dailysutra.app
              </a>
              . We will respond to your request within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              7. Data Retention
            </h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide our services. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or regulatory purposes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              8. Children&apos;s Privacy
            </h2>
            <p>
              Daily Sutra is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are under 18, please do not use this service. If you believe we have collected information from a child under 18, please contact us immediately at{" "}
              <a
                href="mailto:support@dailysutra.app"
                className="text-[hsl(var(--accent))] hover:underline"
              >
                support@dailysutra.app
              </a>
              {" "}and we will delete the information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              9. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              10. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
            </p>
            <p className="mt-2">
              <strong className="text-[hsl(var(--text))]">Email:</strong>{" "}
              <a
                href="mailto:support@dailysutra.app"
                className="text-[hsl(var(--accent))] hover:underline"
              >
                support@dailysutra.app
              </a>
            </p>
            <p className="mt-2">
              <Link href="/contact" className="text-[hsl(var(--accent))] hover:underline">
                Contact Form
              </Link>
            </p>
          </section>
        </div>
      </GlassCard>
    </div>
  );
}

