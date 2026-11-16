import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Plain-English privacy policy for AI Showcase covering analytics, newsletter emails, affiliate links, and advertising cookies.",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 pb-6 border-b border-[oklch(0.88_0.02_50)] dark:border-[oklch(0.2_0.02_45)]">
        <p className="font-mono text-xs uppercase tracking-widest text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)] mb-2">
          Legal &amp; Transparency
        </p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[oklch(0.5_0.03_40)] dark:text-[oklch(0.65_0.03_45)] font-mono">
          Last updated: November 2026
        </p>
      </div>

      <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[oklch(0.25_0.02_40)] dark:text-[oklch(0.82_0.02_55)]">
        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">
            1. Overview
          </h2>
          <p>
            AI Showcase (<span className="font-mono">aishowcase.qzz.io</span>) is a developer
            portfolio, AI tools directory, and technical journal. This policy explains in plain
            English what limited data is collected when you browse the site and how it is used.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">
            2. Analytics (@vercel/analytics)
          </h2>
          <p>
            We use Vercel Analytics and Vercel Speed Insights to understand overall traffic trends
            (such as popular pages, referrers, country-level geography, and page-load performance).
            Vercel Analytics is privacy-focused and does not use third-party advertising cookies or
            track you across other websites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">
            3. Newsletter Emails
          </h2>
          <p>
            If you subscribe to the newsletter in the footer or on the homepage, we store the email
            address you submit solely to send you AI Showcase updates and digests. We never sell,
            rent, or share subscriber email addresses with third parties. You can unsubscribe or
            request deletion at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">
            4. Contact Form, Reviews &amp; Local Storage
          </h2>
          <p>
            If you submit a message on the contact page, your name, email address, and message are
            forwarded via Resend so we can reply. If you submit a tool review, your display name
            and review content are stored in our PostgreSQL database. We also use browser{" "}
            <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-muted">localStorage</code>{" "}
            solely to remember your light/dark theme preference.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">
            5. Affiliate Links
          </h2>
          <p>
            Some outbound links in the AI Tools Directory are affiliate links (marked with{" "}
            <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-muted">
              rel=&quot;sponsored noopener&quot;
            </code>
            ). If you click an affiliate link and sign up or make a purchase, we may earn a small
            commission at no extra cost to you. The destination website may set its own referral
            cookie according to its privacy policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">
            6. Advertising &amp; Ad-Network Cookies
          </h2>
          <p>
            When display advertising is enabled on the site, third-party ad networks (such as Google
            AdSense) may use cookies or similar technologies to serve ads based on your prior visits
            to this or other websites, measure ad performance, and prevent fraud. You can opt out of
            personalized advertising at any time through{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)]"
            >
              Google Ad Settings
            </a>{" "}
            or by adjusting your browser&apos;s cookie controls.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-[oklch(0.15_0.02_40)] dark:text-[oklch(0.92_0.02_60)]">
            7. Contact
          </h2>
          <p>
            Questions or requests regarding your data? Reach out via the{" "}
            <Link
              href="/contact"
              className="underline text-[oklch(0.55_0.14_30)] dark:text-[oklch(0.68_0.12_30)]"
            >
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
