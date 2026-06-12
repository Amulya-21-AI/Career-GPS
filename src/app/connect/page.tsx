"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface ServiceCard {
  id: "google" | "instagram";
  name: string;
  icon: string;
  description: string;
  permissions: string[];
  connectUrl: string;
  color: string;
}

const SERVICES: ServiceCard[] = [
  {
    id: "google",
    name: "Google (Gmail + Calendar)",
    icon: "G",
    description:
      "Let Future Me read your emails and calendar to give you personalised, context-aware career guidance based on your actual job search activity.",
    permissions: [
      "Read Gmail messages (read-only)",
      "Read Google Calendar events",
      "Read your Google profile",
    ],
    connectUrl: "/api/auth/google",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "IG",
    description:
      "Future Me can understand your passions and online presence from your Instagram posts — helping align your career path with who you actually are.",
    permissions: [
      "Read your public posts and profile",
      "Understand your interests from captions",
    ],
    connectUrl: "/api/auth/instagram",
    color: "from-pink-500 to-orange-500",
  },
];

export default function ConnectPage() {
  const searchParams = useSearchParams();
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "google") {
      setBanner({ type: "success", text: "Gmail & Calendar connected! Future Me can now read your emails." });
      setConnected((prev) => ({ ...prev, google: true }));
    } else if (success === "instagram") {
      setBanner({ type: "success", text: "Instagram connected! Future Me can now understand your interests." });
      setConnected((prev) => ({ ...prev, instagram: true }));
    } else if (error) {
      const msgs: Record<string, string> = {
        google_denied: "Google connection was cancelled.",
        google_failed: "Google connection failed. Check your OAuth credentials.",
        instagram_denied: "Instagram connection was cancelled.",
        instagram_failed: "Instagram connection failed. Check your app credentials.",
      };
      setBanner({ type: "error", text: msgs[error] ?? "Connection failed." });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 text-white">
      {/* Navbar */}
      <nav className="border-b border-violet-800/30 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-violet-300">
          Future Me
        </Link>
        <div className="flex gap-4 text-sm text-violet-300">
          <Link href="/chat" className="hover:text-white transition-colors">Chat</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Connect Your World
          </h1>
          <p className="text-violet-300 text-lg leading-relaxed">
            Future Me becomes dramatically more useful when it can see your actual life —
            your emails, your schedule, your online presence. Connect your accounts to unlock
            hyper-personalised career guidance.
          </p>
        </div>

        {/* Banner */}
        {banner && (
          <div
            className={`mb-8 p-4 rounded-xl border text-sm ${
              banner.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            {banner.type === "success" ? "✓ " : "✗ "}{banner.text}
          </div>
        )}

        {/* Privacy note */}
        <div className="mb-8 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-sm text-violet-300">
          <strong className="text-violet-200">Your data stays private.</strong> Future Me reads
          your accounts to personalise its advice only — nothing is stored permanently or shared.
          Tokens are held in memory for your session and cleared when you disconnect.
        </div>

        {/* Service cards */}
        <div className="space-y-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/40 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center font-bold text-sm flex-shrink-0`}
                >
                  {service.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    {connected[service.id] && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                        ✓ Connected this session
                      </span>
                    )}
                  </div>

                  <p className="text-violet-300 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="text-xs text-violet-400 mb-4 space-y-1">
                    {service.permissions.map((p) => (
                      <li key={p} className="flex items-center gap-2">
                        <span className="text-violet-500">•</span> {p}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={service.connectUrl}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${service.color} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
                  >
                    Connect {service.name.split(" ")[0]}
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Setup guide */}
        <div className="mt-10 p-5 bg-white/3 border border-white/8 rounded-xl text-sm text-violet-400">
          <p className="font-medium text-violet-300 mb-2">Need to set up credentials first?</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>
              <strong className="text-violet-300">Google:</strong> Create a project at{" "}
              <code className="text-violet-200">console.cloud.google.com</code>, enable Gmail API +
              People API + Calendar API, create OAuth credentials, add{" "}
              <code className="text-violet-200">GOOGLE_CLIENT_ID</code> and{" "}
              <code className="text-violet-200">GOOGLE_CLIENT_SECRET</code> to{" "}
              <code className="text-violet-200">.env.local</code>.
            </li>
            <li className="mt-2">
              <strong className="text-violet-300">Instagram:</strong> Create a Meta app at{" "}
              <code className="text-violet-200">developers.facebook.com</code>, add Instagram
              product, add{" "}
              <code className="text-violet-200">INSTAGRAM_APP_ID</code> and{" "}
              <code className="text-violet-200">INSTAGRAM_APP_SECRET</code>.
            </li>
          </ol>
          <p className="mt-3">
            Also set <code className="text-violet-200">NEXT_PUBLIC_APP_URL=http://localhost:3000</code>{" "}
            in <code className="text-violet-200">.env.local</code>.
          </p>
        </div>

        {/* CTA to chat */}
        <div className="mt-8 text-center">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-medium transition-colors"
          >
            Go to Chat →
          </Link>
          <p className="text-violet-400 text-sm mt-2">
            The agent works even without connections — it just gets much better with them.
          </p>
        </div>
      </div>
    </div>
  );
}
