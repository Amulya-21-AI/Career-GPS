// @ts-nocheck
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, MessageCircle, FlaskConical, Compass, BarChart2, Map, CheckCircle2 } from "lucide-react";
import { careers } from "@/data/careers";

const mockChat = [
  { role: "user", content: "Am I on the right track?" },
  { role: "ai", content: "You are — but you're playing it too safe. The skills you have right now are worth more in niche markets than you realise. I wish I had moved faster at your stage." },
];

export default function Home() {
  const total = careers.length;
  const emerging = careers.filter((c) => c.type === "emerging").length;

  return (
    <main>
      {/* Hero */}
      <section className="gradient-hero py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 text-sm text-violet-700 font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI Career Advisor · {total} career paths · {emerging} emerging roles
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            I am you,<br />
            <span className="text-violet-600">five years ahead.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            FutureMe is an AI that speaks as your successful future self — giving you the honest career advice you actually need, matched to who you really are.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
            >
              Talk to Your Future Self <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/careers"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Explore Careers
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-500 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Free · No account required · 5 minutes
          </p>
        </div>
      </section>

      {/* AI Chat Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">What does your future self say?</h2>
            <p className="text-slate-500">Real advice from the version of you who already figured it out.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            {mockChat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center mr-3 mt-0.5">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-violet-600 text-white rounded-br-md"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-200">
              <Link
                href="/quiz"
                className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
              >
                Start your conversation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How FutureMe works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Tell us about yourself", desc: "A 5-minute quiz about your education, skills, interests, values, and what you want your life to look like." },
              { step: "02", title: "Meet your future self", desc: "Your AI future self analyses your profile and gives you honest, specific advice — not generic career tips." },
              { step: "03", title: "Get your roadmap", desc: "Career matches, skill gaps, and a week-by-week action plan tailored to exactly where you are right now." },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="text-3xl font-black text-violet-100 mb-4">{item.step}</div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Everything your future self brings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: MessageCircle, title: "Future Self Chat", desc: "Ask anything. Career pivots, skill gaps, whether your plan makes sense — get straight answers from the version of you who already figured it out." },
              { icon: FlaskConical, title: "Interest Test", desc: "8 scenario-based questions that reveal your hidden strengths, risk level, creative potential, and how well your path aligns with who you are." },
              { icon: Compass, title: "Career Matching", desc: `A transparent algorithm scores ${total}+ careers against your unique profile — including emerging and niche roles most people never discover.` },
              { icon: Map, title: "Career Roadmaps", desc: "7-day, 30-day, and 90-day action plans with specific projects, resources, and certifications tailored to your current level." },
              { icon: BarChart2, title: "Skill Gap Analysis", desc: "Know exactly what's missing, what to build first, and how long it'll take to be job-ready for each path." },
              { icon: CheckCircle2, title: "Saved & Compared", desc: "Save careers, compare up to 3 side-by-side on every dimension that matters — salary, demand, difficulty, remote score." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-6 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-violet-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Your future self is waiting.</h2>
          <p className="text-violet-200 mb-8 text-lg">5 minutes. {total}+ career paths. No fluff.</p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-white text-violet-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-violet-50 transition-colors"
          >
            Start the Free Quiz <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6">
            <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>FutureMe helps you explore options, not make decisions for you.</strong> Career paths depend on many personal factors. Use this as a starting point for self-discovery, not a guarantee of employment or success.
            </p>
          </div>
          <p className="text-sm text-slate-500">© 2026 FutureMe. Built to help you explore, not to decide for you.</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/data-deletion" className="hover:text-violet-600 transition-colors">Data Deletion</Link>
            <span>·</span>
            <Link href="/connect" className="hover:text-violet-600 transition-colors">Connect Accounts</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
