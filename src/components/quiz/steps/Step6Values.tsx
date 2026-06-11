"use client";
import { useQuizStore } from "@/store/quizStore";
import QuizCard from "../QuizCard";
import NavButtons from "../NavButtons";
import { cn } from "@/lib/utils";

const valueOptions = [
  { value: "creativity", label: "🎨 Creativity", desc: "I want to create, design, and express" },
  { value: "stability", label: "🏛️ Stability", desc: "Steady income, job security, predictability" },
  { value: "impact", label: "🌍 Social Impact", desc: "My work should make a difference to others" },
  { value: "growth", label: "📈 Career Growth", desc: "I want to climb fast and reach senior roles" },
  { value: "autonomy", label: "🦅 Autonomy", desc: "Freedom to make my own decisions at work" },
  { value: "income", label: "💰 High Income", desc: "Earning well is a primary motivator" },
  { value: "recognition", label: "⭐ Recognition", desc: "I want my work to be seen and appreciated" },
  { value: "helping-others", label: "🤲 Helping Others", desc: "I feel fulfilled when I help people" },
  { value: "innovation", label: "🚀 Innovation", desc: "Building new things and working on cutting-edge problems" },
  { value: "learning", label: "📚 Continuous Learning", desc: "I love picking up new skills and knowledge constantly" },
];

interface Props { onNext: () => void; onBack: () => void; }

export default function Step6Values({ onNext, onBack }: Props) {
  const { profile, updateProfile } = useQuizStore();

  const toggle = (val: string) => {
    const current = profile.values || [];
    updateProfile({
      values: current.includes(val) ? current.filter((v) => v !== val) : [...current, val],
    });
  };

  const canProceed = (profile.values || []).length >= 2;

  return (
    <QuizCard title="What do you value in a career?" subtitle="Pick at least 2 things that matter most to you professionally.">
      <div className="space-y-2 mb-2">
        {valueOptions.map((v) => (
          <button
            key={v.value}
            onClick={() => toggle(v.value)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-xl border transition-all",
              (profile.values || []).includes(v.value)
                ? "bg-blue-50 border-blue-400"
                : "bg-white border-slate-200 hover:border-blue-300"
            )}
          >
            <div className="font-medium text-sm text-slate-800">{v.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{v.desc}</div>
          </button>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canProceed={canProceed} />
    </QuizCard>
  );
}
