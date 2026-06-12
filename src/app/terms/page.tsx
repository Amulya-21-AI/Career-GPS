import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Terms of Service — FutureMe",
  description: "Terms and conditions for using the FutureMe career guidance platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 w-fit">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <span>Future<span className="text-violet-600">Me</span></span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-10">Last updated: 12 June 2026</p>

        <div className="prose prose-slate max-w-none space-y-10 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using FutureMe (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the
              Service. These Terms apply to all users of FutureMe, including visitors, registered
              users, and users who connect third-party accounts (Google, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Description of Service</h2>
            <p>
              FutureMe is an AI-powered career guidance platform that helps users explore career
              paths, assess their skills and interests, and receive personalised guidance through an
              AI persona called &quot;Future Me.&quot; The Service includes:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Career quiz and profile builder</li>
              <li>AI chat with the Future Me persona (powered by Anthropic Claude)</li>
              <li>Career exploration, comparison, and matching tools</li>
              <li>Interest test and scoring</li>
              <li>Optional integration with Google services (Gmail, Calendar)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. AI-Generated Advice Disclaimer</h2>
            <p className="font-medium text-slate-900">
              FutureMe provides AI-generated career guidance for informational purposes only.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>
                AI responses are not a substitute for advice from qualified career counsellors,
                educators, or industry professionals.
              </li>
              <li>
                We do not guarantee that any career path suggested by the AI will result in
                employment, income, or any specific outcome.
              </li>
              <li>
                Career decisions are personal and should be made based on your own research,
                judgment, and consultation with qualified advisors.
              </li>
              <li>
                Salary figures, timelines, and demand scores in the career database are estimates
                based on available data and may not reflect current market conditions.
              </li>
              <li>
                FutureMe and its operators are not liable for any career decisions made based on
                AI-generated content.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. User Responsibilities</h2>
            <p>By using FutureMe, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Provide accurate information in your profile and quiz responses</li>
              <li>Use the Service only for lawful, personal, non-commercial purposes</li>
              <li>Not attempt to reverse-engineer, scrape, or misuse the Service</li>
              <li>Not use the Service to generate harmful, illegal, or misleading content</li>
              <li>
                Take responsibility for any third-party accounts (Google, etc.) you connect to
                FutureMe
              </li>
              <li>Not share your account or session with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Third-Party Integrations</h2>
            <p>
              FutureMe allows you to optionally connect your Google account (Gmail, Calendar). By
              connecting these accounts:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                You authorise FutureMe to access the data described in our{" "}
                <Link href="/privacy" className="text-violet-600 underline">Privacy Policy</Link>{" "}
                for the purpose of generating career guidance
              </li>
              <li>
                You acknowledge that Google&apos;s own Terms of Service and Privacy Policy govern
                Google&apos;s handling of your data
              </li>
              <li>
                You can revoke access at any time from your Google Account settings or from the
                FutureMe Connect page
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Intellectual Property</h2>
            <p>
              All content, design, code, and career data in FutureMe is owned by or licensed to
              Amulya Kurapati. You may not reproduce, distribute, or create derivative works from
              any part of the Service without explicit written permission.
            </p>
            <p className="mt-3">
              Content you submit (quiz responses, chat messages) remains yours. By submitting it,
              you grant us a limited licence to process it for the purpose of providing the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, FutureMe and its operators shall
              not be liable for any indirect, incidental, special, consequential, or punitive
              damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Loss of income or employment opportunities</li>
              <li>Decisions made based on AI-generated career advice</li>
              <li>Unauthorised access to your data by third parties</li>
              <li>Service interruptions or data loss</li>
            </ul>
            <p className="mt-3">
              Our total liability to you for any claim arising from use of the Service shall not
              exceed INR 0 (the Service is provided free of charge).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate access to FutureMe at our discretion,
              without notice, for conduct that violates these Terms or is harmful to other users,
              the Service, or third parties. You may stop using the Service at any time. On
              termination, your locally stored data (profile, chat history) remains on your device
              until you clear it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to the
              exclusive jurisdiction of the courts in Hyderabad, Telangana, India. These Terms
              comply with the Indian Information Technology Act 2000 and the Digital Personal Data
              Protection Act 2023.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify users by updating the
              &quot;Last updated&quot; date at the top of this page. Continued use of the Service after
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">11. Contact</h2>
            <p>For questions about these Terms:</p>
            <ul className="list-none mt-2 space-y-1">
              <li><strong>Name:</strong> Amulya Kurapati</li>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:kurapatiamulya2128@gmail.com" className="text-violet-600 underline">
                  kurapatiamulya2128@gmail.com
                </a>
              </li>
              <li><strong>Country:</strong> India</li>
            </ul>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 flex gap-6 text-sm text-slate-500">
          <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link>
          <Link href="/data-deletion" className="hover:text-violet-600 transition-colors">Data Deletion</Link>
          <Link href="/" className="hover:text-violet-600 transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
