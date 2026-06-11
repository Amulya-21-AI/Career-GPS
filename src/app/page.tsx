import Link from "next/link";
import { ArrowRight, Compass, BarChart2, Map, Sparkles, Shield, GraduationCap, Users, Briefcase } from "lucide-react";
import { careers } from "@/data/careers";

const typeColors: Record<string, string> = {
  emerging: "bg-emerald-100 text-emerald-700",
  niche: "bg-orange-100 text-orange-700",
  conventional: "bg-blue-100 text-blue-700",
  unconventional: "bg-purple-100 text-purple-700",
};

const exampleCareers = [
  { title: "AI Automation Specialist", type: "emerging", match: "92%" },
  { title: "Behavioral Designer", type: "niche", match: "88%" },
  { title: "Climate Risk Analyst", type: "emerging", match: "85%" },
  { title: "Game Economy Designer", type: "niche", match: "81%" },
  { title: "Sports Data Analyst", type: "niche", match: "79%" },
  { title: "Prompt Engineer", type: "emerging", match: "77%" },
];

export default function Home() {
  const totalCareers = careers.length;
  const emerging = careers.filter((c) => c.type === "emerging").length;

  return (
    <main>
      {/* Hero */}
      <section className="gradient-hero py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {totalCareers} career paths · {emerging} emerging roles
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Discover career paths<br />
            <span className="text-blue-600">you didn&apos;t know existed</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Career GPS matches you to conventional, unconventional, niche, and emerging careers based on who you actually are — not just your degree.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quiz" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Start the Free Quiz <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/careers" className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              Explore All Careers
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-500 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> No account required · Free · 5 minutes
          </p>
        </div>
      </section>

      {/* Example matches */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Careers you might not have considered</h2>
            <p className="text-slate-500">These are real paths in our database. How many do you know?</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {exampleCareers.map((c) => (
              <div key={c.title} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[c.type]}`}>{c.type}</span>
                  <span className="text-sm font-bold text-slate-700">{c.match}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800">{c.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How Career GPS works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Take the Smart Quiz", desc: "15-minute quiz covering your education, skills, interests, values, and work preferences." },
              { step: "02", title: "Get Your Matches", desc: "Our algorithm scores 60+ careers against your profile — top, safe, wildcard, and stretch matches." },
              { step: "03", title: "Get Your Roadmap", desc: "Full GPS Report with skill gaps, learning resources, certifications, and a 90-day action plan." },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="text-3xl font-black text-blue-100 mb-4">{item.step}</div>
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
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Everything you need to choose with confidence</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Compass, title: "Smart Career Matching", desc: "A transparent algorithm scores 60+ careers against your unique profile — no black box." },
              { icon: BarChart2, title: "Skill Gap Analysis", desc: "Know exactly what you're missing, what to build first, and how long it'll take to be job-ready." },
              { icon: Map, title: "Career Roadmaps", desc: "7-day, 30-day, and 90-day action plans with specific resources, certifications, and projects." },
              { icon: Sparkles, title: "Wildcard Discoveries", desc: "Emerging and niche careers you never knew existed — before everyone else gets there." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-6 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-blue-600" />
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

      {/* Audiences */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Built for every stage of your journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: GraduationCap, title: "After 12th Grade", desc: "Explore 60+ careers beyond the standard science/commerce tracks before making costly commitments." },
              { icon: Users, title: "College Students & Graduates", desc: "Turn your degree into a clear career direction with a gap analysis and learning roadmap." },
              { icon: Briefcase, title: "Working Professionals", desc: "Find careers where your skills transfer and understand exactly what a pivot requires." },
            ].map((a) => (
              <div key={a.title} className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                  <a.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{a.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to find your direction?</h2>
          <p className="text-blue-100 mb-8 text-lg">5 minutes. {totalCareers}+ careers. Zero guesswork.</p>
          <Link href="/quiz" className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
            Start Free Quiz <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer / Disclaimer */}
      <footer className="py-10 px-4 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6">
            <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Career GPS helps you explore options. It does not make life decisions for you.</strong> Career paths depend on many personal factors. Use this as a starting point for self-discovery, not as a guarantee of employment or success.
            </p>
          </div>
          <p className="text-sm text-slate-500">© 2026 Career GPS. Built to help you explore, not to decide for you.</p>
        </div>
      </footer>
    </main>
  );
}
