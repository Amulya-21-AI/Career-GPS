"use client";
import { useQuizStore } from "@/store/quizStore";
import QuizCard from "../QuizCard";
import NavButtons from "../NavButtons";
import { cn } from "@/lib/utils";

const riskOptions = [
  { value: "low", label: "🏦 Low Risk", desc: "I prefer stable, established paths with steady income" },
  { value: "medium", label: "⚖️ Medium Risk", desc: "I'm open to some uncertainty if the upside is good" },
  { value: "high", label: "🚀 High Risk", desc: "I'm OK with uncertainty — big upside matters more to me" },
];

const incomeOptions = [
  "₹3–6 LPA (starting is fine)",
  "₹6–10 LPA (comfortable start)",
  "₹10–20 LPA (I need decent income)",
  "₹20+ LPA (high income is a priority)",
  "Income is secondary to purpose",
];

const timelineOptions = [
  { value: "asap", label: "ASAP / Already working" },
  { value: "3months", label: "Within 3 months" },
  { value: "6months", label: "6 months" },
  { value: "1year", label: "1 year" },
  { value: "2years", label: "1–2 years" },
  { value: "flexible", label: "Flexible — I'm a long-term thinker" },
];

interface Props { onNext: () => void; onBack: () => void; }

export default function Step8Preferences({ onNext, onBack }: Props) {
  const { profile, updateProfile } = useQuizStore();

  return (
    <QuizCard title="Your preferences & goals" subtitle="These help us understand what kind of career environment suits you.">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Risk Tolerance</label>
          <div className="space-y-2">
            {riskOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateProfile({ riskTolerance: opt.value as "low" | "medium" | "high" })}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border transition-all",
                  profile.riskTolerance === opt.value
                    ? "bg-blue-50 border-blue-400"
                    : "bg-white border-slate-200 hover:border-blue-300"
                )}
              >
                <div className="font-medium text-sm text-slate-800">{opt.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Desired Income Level</label>
          <div className="space-y-1.5">
            {incomeOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => updateProfile({ desiredIncome: opt })}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all",
                  profile.desiredIncome === opt
                    ? "bg-blue-50 border-blue-400 font-medium text-blue-800"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Timeline to Start Career</label>
          <div className="grid grid-cols-2 gap-2">
            {timelineOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateProfile({ timeline: opt.value })}
                className={cn(
                  "text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all",
                  profile.timeline === opt.value
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canProceed={true} />
    </QuizCard>
  );
}
