"use client";
import Link from "next/link";
import type { GPSReport, CareerMatch } from "@/types";
import { useQuizStore } from "@/store/quizStore";
import { scoreColor, scoreBg, difficultyLabel, typeBadgeClass, typeLabel, riskLabel } from "@/lib/utils";
import { MapPin, CheckCircle2, AlertTriangle, BookOpen, Target, Lightbulb, ArrowRight, Bookmark, BarChart2, RefreshCw } from "lucide-react";

interface Props { report: GPSReport; }

function MatchCard({ match, rank }: { match: CareerMatch; rank?: number }) {
  const { toggleSaveCareer, savedCareers, toggleCompare, compareList } = useQuizStore();
  const isSaved = savedCareers.includes(match.career.id);
  const inCompare = compareList.includes(match.career.id);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {rank && (
              <span className="text-xs font-bold bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                {rank}
              </span>
            )}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeBadgeClass(match.career.type)}`}>
              {typeLabel(match.career.type)}
            </span>
            <span className="text-xs text-slate-500">{match.career.category}</span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg">{match.career.title}</h3>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-2xl font-black ${scoreColor(match.matchScore)}`}>
            {match.matchScore}%
          </div>
          <div className="text-xs text-slate-500">match</div>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{match.career.description}</p>

      {/* Score breakdown */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Interest", val: match.interestFit },
          { label: "Skills", val: match.skillFit },
          { label: "Values", val: match.valuesFit },
        ].map((s) => (
          <div key={s.label} className="bg-slate-50 rounded-lg p-2 text-center">
            <div className={`text-sm font-bold ${scoreColor(s.val)}`}>{s.val}%</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Why / Concerns */}
      <div className="space-y-2 mb-3">
        <div className="flex gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600">{match.whyMatches[0]}</p>
        </div>
        {match.concerns[0] !== "No major concerns — strong overall fit" && (
          <div className="flex gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600">{match.concerns[0]}</p>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">⏱ {match.career.timelineMonths}mo to entry</span>
        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">💰 {match.career.salaryRangeEntry}</span>
        <span className={`px-2 py-1 rounded-lg ${scoreBg(100 - match.career.difficultyScore * 10)}`}>
          {difficultyLabel(match.career.difficultyScore)}
        </span>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/careers/${match.career.id}`}
          className="flex-1 text-center text-sm font-medium text-blue-600 border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
        >
          View Full Details
        </Link>
        <button
          onClick={() => toggleSaveCareer(match.career.id)}
          className={`px-3 py-2 rounded-xl border text-sm transition-colors ${isSaved ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          title={isSaved ? "Saved" : "Save"}
        >
          <Bookmark className="w-4 h-4" />
        </button>
        <button
          onClick={() => toggleCompare(match.career.id)}
          className={`px-3 py-2 rounded-xl border text-sm transition-colors ${inCompare ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          title="Add to compare"
        >
          <BarChart2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children, color = "blue" }: { title: string; icon: React.ElementType; children: React.ReactNode; color?: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg bg-${color}-100 flex items-center justify-center`}>
          <Icon className={`w-4 h-4 text-${color}-600`} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function GPSReportComponent({ report }: Props) {
  const { profile, resetQuiz } = useQuizStore();
  const firstName = report.userProfile.name?.split(" ")[0] || "Explorer";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Career GPS Report</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Your Career GPS Report, {firstName} 🎯
          </h1>
          <p className="opacity-80 text-sm">
            Based on your education, skills, interests, and values — here are your personalized career paths.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
              🎓 {report.userProfile.educationStream || "Any stream"}
            </span>
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
              ⚡ {report.userProfile.riskTolerance} risk tolerance
            </span>
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
              📅 Generated {new Date(report.generatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Strengths */}
        <Section title="Your Detected Strengths" icon={CheckCircle2} color="emerald">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex flex-wrap gap-2">
              {report.strengthsDetected.map((s) => (
                <span key={s} className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-sm font-medium">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* Top Matches */}
        <Section title="Your Top Career Matches" icon={Target} color="blue">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.topMatches.map((match, i) => (
              <MatchCard key={match.career.id} match={match} rank={i + 1} />
            ))}
          </div>
        </Section>

        {/* Safe Matches */}
        {report.safeMatches.length > 0 && (
          <Section title="Safe Bets 🛡️" icon={CheckCircle2} color="green">
            <p className="text-sm text-slate-500 mb-4">Stable, established career paths that align with your background.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.safeMatches.map((match) => (
                <MatchCard key={match.career.id} match={match} />
              ))}
            </div>
          </Section>
        )}

        {/* Wildcard Matches */}
        {report.wildcardMatches.length > 0 && (
          <Section title="Wildcard Discoveries ⚡" icon={Lightbulb} color="amber">
            <p className="text-sm text-slate-500 mb-4">Emerging and unconventional careers you might not have considered.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.wildcardMatches.map((match) => (
                <MatchCard key={match.career.id} match={match} />
              ))}
            </div>
          </Section>
        )}

        {/* Stretch Careers */}
        {report.stretchMatches.length > 0 && (
          <Section title="Stretch Goals 🚀" icon={ArrowRight} color="purple">
            <p className="text-sm text-slate-500 mb-4">High-difficulty, high-reward careers worth exploring if you're ambitious.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.stretchMatches.map((match) => (
                <MatchCard key={match.career.id} match={match} />
              ))}
            </div>
          </Section>
        )}

        {/* Skill Gaps */}
        {report.overallGaps.length > 0 && (
          <Section title="Key Skill Gaps to Address" icon={AlertTriangle} color="amber">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-sm text-slate-500 mb-4">These skills appear most often in your top matches. Building them will unlock the most opportunities.</p>
              <div className="flex flex-wrap gap-2">
                {report.overallGaps.map((gap) => (
                  <span key={gap} className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-sm font-medium">
                    📚 {gap}
                  </span>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Action Plans */}
        <Section title="Your Action Plans" icon={BookOpen} color="indigo">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Next 7 Days", items: report.sevenDayPlan, color: "blue" },
              { label: "Next 30 Days", items: report.thirtyDayPlan, color: "indigo" },
              { label: "Next 90 Days", items: report.ninetyDayPlan, color: "purple" },
            ].map((plan) => (
              <div key={plan.label} className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-800 mb-3">{plan.label}</h3>
                <ul className="space-y-2">
                  {plan.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Disclaimer + actions */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Remember:</strong> Career GPS helps you explore options. These are starting points for research, not guaranteed outcomes. Your career will be shaped by your effort, opportunities, and personal context.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/careers" className="flex-1 text-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Explore All Careers
          </Link>
          <Link href="/compare" className="flex-1 text-center bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
            Compare Careers
          </Link>
          <button
            onClick={resetQuiz}
            className="flex items-center justify-center gap-2 border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
