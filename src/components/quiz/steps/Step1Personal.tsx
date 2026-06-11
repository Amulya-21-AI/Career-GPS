"use client";
import { useQuizStore } from "@/store/quizStore";
import QuizCard from "../QuizCard";
import NavButtons from "../NavButtons";
import { cn } from "@/lib/utils";

const stages = [
  { value: "after12th", label: "Just finished 12th grade" },
  { value: "college", label: "Current college student" },
  { value: "freshGrad", label: "Recent graduate (0–2 years)" },
  { value: "professional", label: "Working professional" },
];

const ageRanges = ["15–17", "18–21", "22–25", "26–30", "31–35", "35+"];

interface Props { onNext: () => void; onBack: () => void; }

export default function Step1Personal({ onNext, onBack }: Props) {
  const { profile, updateProfile } = useQuizStore();

  const canProceed = !!(profile.name && profile.ageRange && profile.stage);

  return (
    <QuizCard title="Tell us about yourself" subtitle="This helps us personalize your career matches.">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name *</label>
          <input
            type="text"
            placeholder="What should we call you?"
            value={profile.name || ""}
            onChange={(e) => updateProfile({ name: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Age Range *</label>
          <div className="flex flex-wrap gap-2">
            {ageRanges.map((age) => (
              <button
                key={age}
                onClick={() => updateProfile({ ageRange: age })}
                className={cn(
                  "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                  profile.ageRange === age
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                )}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Current Stage *</label>
          <div className="space-y-2">
            {stages.map((s) => (
              <button
                key={s.value}
                onClick={() => updateProfile({ stage: s.value as "after12th" | "college" | "freshGrad" | "professional" })}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                  profile.stage === s.value
                    ? "bg-blue-50 border-blue-400 text-blue-800"
                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Country / Region</label>
          <input
            type="text"
            placeholder="e.g. India"
            value={profile.country || "India"}
            onChange={(e) => updateProfile({ country: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canProceed={canProceed} />
    </QuizCard>
  );
}
