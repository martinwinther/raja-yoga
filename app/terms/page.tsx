import Link from "next/link";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Terms of Service"
        subtitle="The terms and conditions governing your use of Daily Sutra."
      />

      <GlassCard>
        <div className="space-y-6 text-sm text-[hsl(var(--muted))]">
          <section>
            <p className="text-xs text-[hsl(var(--muted))] mb-4">
              <strong className="text-[hsl(var(--text))]">Last Updated:</strong> January 2025
            </p>
            <p>
              Please read these Terms of Service (&quot;Terms&quot;) carefully before using Daily Sutra. By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account, accessing, or using Daily Sutra, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              2. Description of Service
            </h2>
            <p className="mb-3">
              Daily Sutra is a web application that provides a structured 52-week journey through Patañjali&apos;s Yoga Sūtras. The service includes:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>A 52-week curriculum with weekly themes and practices</li>
              <li>Daily practice tracking and note-taking</li>
              <li>Weekly reflection and bookmarking features</li>
              <li>Progress statistics and data export</li>
              <li>Push notifications for practice reminders (optional)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              3. Account Registration
            </h2>
            <div className="space-y-3">
              <p>
                To use Daily Sutra, you must create an account by providing a valid email address and creating a password. You agree to:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
              <p>
                <strong className="text-[hsl(var(--text))]">Age Requirement:</strong> You must be at least 18 years old to create an account and use Daily Sutra. By creating an account, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              4. Free Trial and Paid Access
            </h2>
            <div className="space-y-3">
              <p>
                Daily Sutra offers a free trial that provides access to the first 4 weeks (28 days) of content. During the trial period, you can:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Access and edit content for weeks 1-4</li>
                <li>Mark daily practice and write notes</li>
                <li>Complete weekly reviews</li>
              </ul>
              <p>
                After the trial period, access to edit new content is restricted. To unlock full access to all 52 weeks, you must purchase a one-time payment upgrade. Once purchased, you have lifetime access to all content.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              5. Payment Terms
            </h2>
            <div className="space-y-3">
              <p>
                Payments are processed securely through Stripe. By making a purchase, you agree to:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Provide accurate payment information</li>
                <li>Authorize us to charge your payment method</li>
                <li>Pay all applicable fees and taxes</li>
              </ul>
              <p>
                All prices are displayed in your local currency (as determined by Stripe). Prices are subject to change, but any changes will not affect purchases you have already made.
              </p>
              <p>
                For information about refunds, please see our{" "}
                <Link href="/refund-policy" className="text-[hsl(var(--accent))] hover:underline">
                  Refund Policy
                </Link>
                .
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              6. User Content and Data
            </h2>
            <div className="space-y-3">
              <p>
                You retain ownership of all content you create within Daily Sutra, including your notes, reflections, and practice data. By using our service, you grant us a license to:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Store and process your content to provide the service</li>
                <li>Sync your content across your devices</li>
                <li>Back up your data to prevent loss</li>
              </ul>
              <p>
                You are responsible for the content you create and ensure it does not violate any laws or infringe on the rights of others. We reserve the right to remove content that violates these Terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              7. Intellectual Property
            </h2>
            <div className="space-y-3">
              <p>
                The Daily Sutra service, including its design, curriculum content, software, and all associated intellectual property, is owned by Daily Sutra or its licensors. The Yoga Sūtras text and translations are in the public domain or used under appropriate licenses.
              </p>
              <p>
                You may not:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Copy, modify, or distribute our service or content without permission</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Use our service for commercial purposes without authorization</li>
                <li>Remove any copyright or proprietary notices</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              8. Prohibited Uses
            </h2>
            <p className="mb-3">You agree not to use Daily Sutra to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful, offensive, or illegal content</li>
              <li>Interfere with or disrupt the service</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems to access the service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              9. Service Availability
            </h2>
            <p>
              We strive to provide reliable service but do not guarantee uninterrupted or error-free operation. We may temporarily suspend the service for maintenance, updates, or other reasons. We are not liable for any loss or inconvenience resulting from service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              10. Limitation of Liability
            </h2>
            <p className="mb-3">
              Daily Sutra is provided for educational and personal development purposes. To the maximum extent permitted by law:
            </p>
            <ul className="space-y-2 list-disc list-inside mb-3">
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability is limited to the amount you paid for the service</li>
              <li>We do not guarantee specific results from using the service</li>
              <li>The service is provided &quot;as is&quot; without warranties of any kind</li>
            </ul>
            <p>
              <strong className="text-[hsl(var(--text))]">Important:</strong> Daily Sutra is not a substitute for professional medical, psychological, or therapeutic advice. If you have health concerns, please consult a qualified professional.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              11. Account Termination
            </h2>
            <div className="space-y-3">
              <p>
                You may delete your account at any time through the Settings page. Upon deletion:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Your account and personal data will be deleted within 30 days</li>
                <li>You will lose access to all your journey data</li>
                <li>You will not be entitled to a refund unless required by law</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent or harmful activity.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              12. Changes to Terms
            </h2>
            <p>
              We may modify these Terms at any time. We will notify you of significant changes by posting the updated Terms on this page and updating the &quot;Last Updated&quot; date. Your continued use of the service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              13. Governing Law
            </h2>
            <p>
              These Terms are governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the service will be resolved through appropriate legal channels.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              14. Contact Information
            </h2>
            <p>
              If you have questions about these Terms, please contact us at:
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

