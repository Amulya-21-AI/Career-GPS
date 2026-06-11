"use client";
import Link from "next/link";
import { Sparkles, MessageCircle, FlaskConical, ArrowRight, BookOpen, Target, TrendingUp } from "lucide-react";
import { useQuizStore } from "@/store/quizStore";

function ScorePill({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80 ? "bg-emerald-100 text-emerald-700" :
    score >= 60 ? "bg-violet-100 text-violet-700" :
    "bg-amber-100 text-amber-700";
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl ${color}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className="font-bold">{score}%</span>
    </div>
  );
}

export default function DashboardPage() {
  const { profile, report, interestTestResult, savedCareers, chatMessages } = useQuizStore();

  const hasProfile = profile?.name || profile?.stage;
  const topMatches = report?.topMatches?.slice(0, 3) ?? [];
  const nextActions = report?.sevenDayPlan?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {hasProfile && profile.name ? `Welcome back, ${profile.name}.` : "Your FutureMe Dashboard"}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {hasProfile ? "Here's where you stand and what to do next." : "Complete the quiz to unlock your personalised insights."}
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/chat"
            className="bg-violet-600 text-white rounded-2xl p-5 flex items-start gap-3 hover:bg-violet-700 transition-colors group"
          >
            <MessageCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Talk to Future Me</p>
              <p className="text-violet-200 text-xs mt-0.5">
                {chatMessages.length > 0 ? `${chatMessages.length} messages so far` : "Start the conversation"}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto opacity-60 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/interest-test"
            className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-3 hover:border-violet-300 hover:bg-violet-50/50 transition-all group"
          >
            <FlaskConical className="w-6 h-6 text-violet-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Interest Test</p>
              <p className="text-slate-500 text-xs mt-0.5">
                {interestTestResult ? "Completed — view results" : "8 questions · 3 minutes"}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/quiz"
            className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-3 hover:border-violet-300 hover:bg-violet-50/50 transition-all group"
          >
            <Target className="w-6 h-6 text-violet-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Career Quiz</p>
              <p className="text-slate-500 text-xs mt-0.5">
                {report ? "Completed — view report" : "Get your career matches"}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top career matches */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900">Your Top Career Matches</h2>
                {report && (
                  <Link href="/quiz" className="text-xs text-violet-600 hover:underline">View full report</Link>
                )}
              </div>
              {topMatches.length > 0 ? (
                <div className="space-y-3">
                  {topMatches.map((m) => (
                    <ScorePill
                      key={m.career.id}
                      score={Math.round(m.matchScore)}
                      label={m.career.title}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Complete the career quiz to see your matches.</p>
                  <Link href="/quiz" className="mt-3 inline-flex items-center gap-1 text-sm text-violet-600 font-medium hover:underline">
                    Take the quiz <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Interest test scores */}
            {interestTestResult && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-900">Interest Test Results</h2>
                  <Link href="/interest-test" className="text-xs text-violet-600 hover:underline">Retake</Link>
                </div>
                <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 mb-4 flex gap-2">
                  <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-violet-900">{interestTestResult.summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(["interestFit", "skillFit", "disciplineLevel", "careerScope", "creativePotential", "riskLevel", "streamAlignment"] as const).map((key) => (
                    <div key={key} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <div className="flex-1">
                        <p className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                      </div>
                      <span className="font-bold text-violet-600">{interestTestResult[key]}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7-day plan */}
            {nextActions.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="font-bold text-slate-900 mb-4">Your Next 7 Days</h2>
                <ol className="space-y-3">
                  {nextActions.map((action, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
                        {i + 1}
                      </span>
                      <span className="text-slate-700 leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Profile snapshot */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4">Your Profile</h2>
              {hasProfile ? (
                <dl className="space-y-2 text-sm">
                  {profile.name && <div className="flex justify-between"><dt className="text-slate-500">Name</dt><dd className="font-medium text-slate-800">{profile.name}</dd></div>}
                  {profile.stage && <div className="flex justify-between"><dt className="text-slate-500">Stage</dt><dd className="font-medium text-slate-800 capitalize">{profile.stage}</dd></div>}
                  {profile.educationStream && <div className="flex justify-between"><dt className="text-slate-500">Stream</dt><dd className="font-medium text-slate-800">{profile.educationStream}</dd></div>}
                  {profile.riskTolerance && <div className="flex justify-between"><dt className="text-slate-500">Risk</dt><dd className="font-medium text-slate-800 capitalize">{profile.riskTolerance}</dd></div>}
                  {(profile.interests?.length ?? 0) > 0 && (
                    <div>
                      <dt className="text-slate-500 mb-1">Interests</dt>
                      <dd className="flex flex-wrap gap-1">
                        {profile.interests?.slice(0, 4).map((i) => (
                          <span key={i} className="bg-violet-50 text-violet-700 text-xs px-2 py-0.5 rounded-full">{i}</span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-slate-500 text-sm">No profile yet. Take the quiz to get started.</p>
              )}
              <Link href="/quiz" className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs text-violet-600 font-medium hover:underline">
                {hasProfile ? "Update profile" : "Take the quiz"} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Saved careers */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-900">Saved Careers</h2>
                {savedCareers.length > 0 && (
                  <Link href="/saved" className="text-xs text-violet-600 hover:underline">View all</Link>
                )}
              </div>
              {savedCareers.length > 0 ? (
                <p className="text-sm text-slate-700">{savedCareers.length} career{savedCareers.length !== 1 ? "s" : ""} saved</p>
              ) : (
                <div className="text-center py-4">
                  <BookOpen className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs">Bookmark careers while exploring to find them here.</p>
                  <Link href="/careers" className="mt-2 inline-flex items-center gap-1 text-xs text-violet-600 font-medium hover:underline">
                    Explore careers <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
