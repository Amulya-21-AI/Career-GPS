import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — FutureMe",
  description: "How FutureMe collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 w-fit">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <span>Future<span className="text-violet-600">Me</span></span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-10">Last updated: 12 June 2026</p>

        <div className="prose prose-slate max-w-none space-y-10 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p>
              FutureMe (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is an AI-powered career guidance platform operated by
              Amulya Kurapati, based in India. This Privacy Policy explains how we collect, use,
              store, and protect your personal information when you use FutureMe at{" "}
              <code className="text-violet-600">localhost:3000</code> or any deployed domain.
            </p>
            <p className="mt-3">
              By using FutureMe, you agree to this Privacy Policy. If you do not agree, please
              discontinue use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>

            <h3 className="font-semibold text-slate-800 mb-2">2a. Information You Provide</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Career profile data (name, age range, education, skills, interests, goals)</li>
              <li>Quiz and interest test responses</li>
              <li>Chat messages sent to the Future Me AI</li>
            </ul>

            <h3 className="font-semibold text-slate-800 mb-2 mt-4">2b. Google Account Data (only if you connect Google)</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Your Google account email address and display name</li>
              <li>Gmail message subjects, senders, and text snippets (read-only, up to 20 recent emails)</li>
              <li>Upcoming Google Calendar event titles and times (read-only, next 7 days)</li>
            </ul>
            <p className="mt-2 text-sm text-slate-500">
              We access Google data only when you explicitly click &quot;Connect Google&quot; and authorise the connection. We request the minimum scopes necessary.
            </p>

            <h3 className="font-semibold text-slate-800 mb-2 mt-4">2c. Automatically Collected Data</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Session identifier (stored in an HTTP-only cookie)</li>
              <li>Basic server logs (request path, timestamp) for error monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To generate personalised AI career guidance through the Future Me persona</li>
              <li>To match your profile against our career knowledge base (60+ careers)</li>
              <li>To provide context-aware responses using your emails and calendar when connected</li>
              <li>To improve the relevance of career recommendations within your session</li>
            </ul>
            <p className="mt-3 font-medium">
              We do NOT use your data to train AI models, sell to advertisers, or share with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Data Storage and Retention</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Profile and quiz data</strong> — stored in your browser&apos;s localStorage only.
                It never leaves your device unless you use the AI chat.
              </li>
              <li>
                <strong>Google OAuth tokens</strong> — stored in a local file on the server for the
                duration of your session. Tokens are not stored in any external database.
              </li>
              <li>
                <strong>Gmail and Calendar content</strong> — fetched live at the time of your request
                and passed to the AI. We do not store email content permanently.
              </li>
              <li>
                <strong>Chat messages</strong> — stored in your browser&apos;s localStorage only.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Third-Party Services</h2>
            <p>FutureMe uses the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>Anthropic Claude API</strong> — your messages and profile data are sent to
                Anthropic to generate AI responses. Anthropic&apos;s{" "}
                <a href="https://www.anthropic.com/privacy" className="text-violet-600 underline" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>{" "}
                applies.
              </li>
              <li>
                <strong>Google APIs</strong> — Gmail, Calendar, and People APIs. Google&apos;s{" "}
                <a href="https://policies.google.com/privacy" className="text-violet-600 underline" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>{" "}
                applies to data accessed via these APIs.
              </li>
              <li>
                <strong>Clerk</strong> (optional authentication) — if you create an account, Clerk
                handles authentication. Clerk&apos;s{" "}
                <a href="https://clerk.com/privacy" className="text-violet-600 underline" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>{" "}
                applies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Google API Scopes — Limited Use Disclosure</h2>
            <p>
              FutureMe&apos;s use of information received from Google APIs adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                className="text-violet-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Google data is used only to provide career guidance features within FutureMe</li>
              <li>Google data is not transferred to third parties except as necessary to provide the service</li>
              <li>Google data is not used for serving advertisements</li>
              <li>Google data is not used to train generalised AI/ML models</li>
              <li>Humans do not read your Gmail or Calendar data — it is processed only by automated systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Your Rights (India — DPDP Act 2023)</h2>
            <p>Under India&apos;s Digital Personal Data Protection Act 2023, you have the right to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Withdraw consent at any time by disconnecting your Google account</li>
              <li>Nominate a person to exercise these rights on your behalf</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, email us at{" "}
              <a href="mailto:kurapatiamulya2128@gmail.com" className="text-violet-600 underline">
                kurapatiamulya2128@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Security</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>OAuth tokens are stored server-side in HTTP-only cookies (not accessible to JavaScript)</li>
              <li>All communication is over HTTPS in production</li>
              <li>We do not store passwords — authentication is handled by Google OAuth or Clerk</li>
              <li>API keys are stored as environment variables and never exposed to the client</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Children&apos;s Privacy</h2>
            <p>
              FutureMe is intended for users aged 13 and above. We do not knowingly collect personal
              data from children under 13. If you believe a child has provided us with personal data,
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page
              with an updated date. Continued use of FutureMe after changes constitutes acceptance of
              the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">11. Contact Us</h2>
            <p>For any privacy-related questions or data requests:</p>
            <ul className="list-none mt-2 space-y-1">
              <li><strong>Name:</strong> Amulya Kurapati</li>
              <li><strong>Email:</strong>{" "}
                <a href="mailto:kurapatiamulya2128@gmail.com" className="text-violet-600 underline">
                  kurapatiamulya2128@gmail.com
                </a>
              </li>
              <li><strong>Country:</strong> India</li>
            </ul>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 flex gap-6 text-sm text-slate-500">
          <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms of Service</Link>
          <Link href="/data-deletion" className="hover:text-violet-600 transition-colors">Data Deletion</Link>
          <Link href="/" className="hover:text-violet-600 transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
