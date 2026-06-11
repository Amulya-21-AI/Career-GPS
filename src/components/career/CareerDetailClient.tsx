"use client";
import Link from "next/link";
import type { Career } from "@/types";
import { useQuizStore } from "@/store/quizStore";
import { typeBadgeClass, typeLabel, difficultyLabel, riskLabel, demandLabel, scoreBg, cn } from "@/lib/utils";
import { Bookmark, BarChart2, ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";
import { getCareerById } from "@/data/careers";

function ScoreMeter({ label, score, max = 10 }: { label: string; score: number; max?: number }) {
  const pct = (score / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
        <span>{label}</span>
        <span>{score}/{max}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function CareerDetailClient({ career }: { career: Career }) {
  const { toggleSaveCareer, savedCareers, toggleCompare, compareList } = useQuizStore();
  const isSaved = savedCareers.includes(career.id);
  const inCompare = compareList.includes(career.id);

  const relatedCareers = career.relatedCareers
    .map((id) => getCareerById(id))
    .filter(Boolean) as Career[];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Careers
        </Link>

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeBadgeClass(career.type)}`}>
                  {typeLabel(career.type)}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{career.category}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{career.title}</h1>
              <p className="text-slate-600 leading-relaxed">{career.description}</p>
            </div>
            <div className="flex gap-2 sm:flex-col">
              <button
                onClick={() => toggleSaveCareer(career.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${isSaved ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <Bookmark className="w-4 h-4" /> {isSaved ? "Saved" : "Save"}
              </button>
              <button
                onClick={() => toggleCompare(career.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${inCompare ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                <BarChart2 className="w-4 h-4" /> Compare
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900">{career.salaryRangeEntry}</div>
              <div className="text-xs text-slate-500">Entry salary</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900">{career.timelineMonths}mo</div>
              <div className="text-xs text-slate-500">Time to entry</div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-bold px-2 py-0.5 rounded-full ${scoreBg(100 - career.difficultyScore * 10)}`}>
                {difficultyLabel(career.difficultyScore)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Difficulty</div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-bold px-2 py-0.5 rounded-full ${career.demandScore >= 8 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                {demandLabel(career.demandScore)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Market demand</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Day in life */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-slate-900 mb-3">☀️ A Day in the Life</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{career.dayInLife}</p>
            </div>

            {/* Suited for */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-slate-900 mb-3">✅ This is a great fit if you...</h2>
              <ul className="space-y-1.5">
                {career.suitedFor.map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
              <h2 className="font-bold text-slate-900 mt-5 mb-3">⚠️ This may not suit you if you...</h2>
              <ul className="space-y-1.5">
                {career.notSuitedFor.map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-slate-600">
                    <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500">✗</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-slate-900 mb-3">🛠 Required Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {career.requiredSkills.map((s) => (
                  <span key={s} className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <h3 className="font-semibold text-slate-700 mb-2 text-sm">Nice to Have</h3>
              <div className="flex flex-wrap gap-2">
                {career.niceToHaveSkills.map((s) => (
                  <span key={s} className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-slate-900 mb-3">⚙️ Tools & Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {career.tools.map((t) => (
                  <span key={t} className="bg-slate-100 text-slate-700 text-sm px-3 py-1.5 rounded-xl font-medium">{t}</span>
                ))}
              </div>
            </div>

            {/* Entry pathways */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-slate-900 mb-3">🗺 Entry Pathways</h2>
              <ul className="space-y-2">
                {career.entryPathways.map((path) => (
                  <li key={path} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-blue-500">→</span> {path}
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects & Portfolio */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-slate-900 mb-3">🏗 Beginner Projects</h2>
              <ul className="space-y-1.5 mb-4">
                {career.beginnerProjects.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-indigo-400">◦</span> {p}
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold text-slate-700 mb-2 text-sm">Portfolio Ideas</h3>
              <ul className="space-y-1.5">
                {career.portfolioIdeas.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-indigo-400">◦</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-slate-900 mb-3">📚 Free Learning Resources</h2>
              <div className="space-y-2 mb-5">
                {career.freeResources.map((r) => (
                  <a
                    key={r.title}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-800 group-hover:text-blue-700">{r.title}</div>
                      <div className="text-xs text-slate-500">{r.platform} · Free</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                  </a>
                ))}
              </div>
              <h3 className="font-semibold text-slate-700 mb-2 text-sm">Paid Certifications</h3>
              <div className="space-y-2">
                {career.paidCertifications.map((cert) => (
                  <a
                    key={cert.title}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-800 group-hover:text-indigo-700">{cert.title}</div>
                      <div className="text-xs text-slate-500">{cert.provider} · {cert.cost} · {cert.duration}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Salary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-800 mb-3 text-sm">💰 Salary Range (India)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Entry</span><span className="font-semibold">{career.salaryRangeEntry}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Mid</span><span className="font-semibold">{career.salaryRangeMid}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Senior</span><span className="font-semibold">{career.salaryRangeSenior}</span></div>
              </div>
            </div>

            {/* Scores */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-800 mb-3 text-sm">📊 Career Metrics</h3>
              <div className="space-y-3">
                <ScoreMeter label="Demand" score={career.demandScore} />
                <ScoreMeter label="Growth Potential" score={career.growthPotential} />
                <ScoreMeter label="Remote Friendliness" score={career.remoteFriendlyScore} />
                <ScoreMeter label="Difficulty" score={career.difficultyScore} />
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Risk Level</span>
                  <span className="font-medium">{riskLabel(career.riskScore)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timeline to Entry</span>
                  <span className="font-medium">{career.timelineMonths} months</span>
                </div>
              </div>
            </div>

            {/* Related */}
            {relatedCareers.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-800 mb-3 text-sm">🔗 Related Careers</h3>
                <div className="space-y-1.5">
                  {relatedCareers.map((rc) => (
                    <Link
                      key={rc.id}
                      href={`/careers/${rc.id}`}
                      className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {rc.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/quiz"
              className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              Find if this fits you →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
