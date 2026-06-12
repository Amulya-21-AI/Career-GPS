import Link from "next/link";
import { Sparkles, Trash2, Mail, Settings, LogOut } from "lucide-react";

export const metadata = {
  title: "Data Deletion — FutureMe",
  description: "How to delete your personal data from FutureMe.",
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 w-fit">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <span>Future<span className="text-violet-600">Me</span></span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Data Deletion</h1>
        <p className="text-slate-500 mb-10">Last updated: 12 June 2026</p>

        <p className="text-slate-700 leading-relaxed mb-10">
          You have the right to delete your personal data from FutureMe at any time. This page
          explains exactly what data we hold and how to delete each type.
        </p>

        {/* Method 1 */}
        <div className="mb-8 p-6 border border-slate-200 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Method 1 — Delete from your browser (instant)
              </h2>
              <p className="text-slate-600 text-sm mb-3">
                Your profile, quiz answers, career matches, interest test results, and chat history
                are stored only in your browser&apos;s localStorage. Clearing it removes everything
                instantly.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 space-y-2">
                <p className="font-medium">Steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open FutureMe in your browser</li>
                  <li>Press <kbd className="bg-white border border-slate-300 px-1.5 py-0.5 rounded text-xs">F12</kbd> to open Developer Tools</li>
                  <li>Go to <strong>Application → Local Storage → localhost:3000</strong></li>
                  <li>Right-click and select <strong>&quot;Clear All&quot;</strong></li>
                </ol>
                <p className="text-slate-500 mt-2">
                  Or simply clear your browser&apos;s site data: <strong>Settings → Privacy → Clear browsing data → Cookies and site data</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Method 2 */}
        <div className="mb-8 p-6 border border-slate-200 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Method 2 — Revoke Google access
              </h2>
              <p className="text-slate-600 text-sm mb-3">
                If you connected your Google account, you can revoke FutureMe&apos;s access to your
                Gmail and Calendar at any time. This immediately stops FutureMe from reading your
                Google data.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 space-y-2">
                <p className="font-medium">Steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Go to{" "}
                    <a
                      href="https://myaccount.google.com/permissions"
                      className="text-violet-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      myaccount.google.com/permissions
                    </a>
                  </li>
                  <li>Find <strong>FutureMe</strong> in the list of connected apps</li>
                  <li>Click <strong>Remove Access</strong></li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Method 3 */}
        <div className="mb-8 p-6 border border-slate-200 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Method 3 — Request complete data deletion (email)
              </h2>
              <p className="text-slate-600 text-sm mb-3">
                If you want us to manually delete all server-side data associated with your session
                (OAuth tokens, session files), send us an email and we will process it within
                <strong> 7 business days</strong>.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700">
                <p className="font-medium mb-2">Send an email to:</p>
                <a
                  href="mailto:kurapatiamulya2128@gmail.com?subject=FutureMe Data Deletion Request&body=Please delete all personal data associated with my account. My registered email is: [your email]"
                  className="text-violet-600 underline font-medium"
                >
                  kurapatiamulya2128@gmail.com
                </a>
                <p className="text-slate-500 mt-2">
                  Subject: <em>FutureMe Data Deletion Request</em><br />
                  Include the email address you used to connect Google.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What we delete */}
        <div className="mb-10 p-6 bg-slate-50 rounded-2xl">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-slate-600" />
            What gets deleted
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 font-semibold text-slate-700">Data type</th>
                <th className="text-left py-2 font-semibold text-slate-700">Location</th>
                <th className="text-left py-2 font-semibold text-slate-700">Deletion method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 text-slate-700">Profile &amp; quiz answers</td>
                <td className="py-2 text-slate-500">Browser localStorage</td>
                <td className="py-2 text-violet-600">Method 1</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-700">Chat history</td>
                <td className="py-2 text-slate-500">Browser localStorage</td>
                <td className="py-2 text-violet-600">Method 1</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-700">Career matches &amp; saved careers</td>
                <td className="py-2 text-slate-500">Browser localStorage</td>
                <td className="py-2 text-violet-600">Method 1</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-700">Google OAuth tokens</td>
                <td className="py-2 text-slate-500">Server session file</td>
                <td className="py-2 text-violet-600">Method 2 or 3</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-700">Session cookie</td>
                <td className="py-2 text-slate-500">Browser cookie</td>
                <td className="py-2 text-violet-600">Method 1 (clear cookies)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Note */}
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <p className="font-medium mb-1">Note on Gmail and Calendar content</p>
          <p>
            FutureMe does not permanently store the content of your emails or calendar events.
            They are fetched live when you use Agent mode and are not saved to any database.
            Revoking Google access (Method 2) is sufficient to stop all future access.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 flex gap-6 text-sm text-slate-500">
          <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms of Service</Link>
          <Link href="/" className="hover:text-violet-600 transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
