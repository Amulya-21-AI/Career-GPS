"use client";
import { useQuizStore } from "@/store/quizStore";
import QuizCard from "../QuizCard";
import NavButtons from "../NavButtons";
import { cn } from "@/lib/utils";

const workStyles = [
  { value: "independent", label: "🧑‍💻 Work independently", desc: "Prefer to own my work and work solo most of the time" },
  { value: "collaborative", label: "🤝 Work collaboratively", desc: "Love working in teams, brainstorming together" },
  { value: "structured", label: "📋 Structured environment", desc: "Clear processes, defined roles, predictable days" },
  { value: "flexible", label: "🌊 Flexible environment", desc: "Variety, change, and less rigidity suits me" },
  { value: "fast-paced", label: "⚡ Fast-paced", desc: "High energy, lots happening, never boring" },
  { value: "slow-paced", label: "🧘 Slow-paced / Thoughtful", desc: "Deep work, careful thinking, quality over speed" },
  { value: "remote", label: "🏠 Prefer remote work", desc: "Work from home or anywhere" },
  { value: "in-person", label: "🏢 Prefer in-person", desc: "Office or on-site environment" },
  { value: "hybrid", label: "🔄 Hybrid is fine", desc: "Mix of both remote and in-person" },
];

interface Props { onNext: () => void; onBack: () => void; }

export default function Step5WorkStyle({ onNext, onBack }: Props) {
  const { profile, updateProfile } = useQuizStore();

  const toggle = (val: string) => {
    const current = profile.workStyle || [];
    updateProfile({
      workStyle: current.includes(val) ? current.filter((s) => s !== val) : [...current, val],
    });
  };

  return (
    <QuizCard title="How do you like to work?" subtitle="Pick everything that describes your ideal work environment.">
      <div className="space-y-2 mb-2">
        {workStyles.map((ws) => (
          <button
            key={ws.value}
            onClick={() => toggle(ws.value)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-xl border transition-all",
              (profile.workStyle || []).includes(ws.value)
                ? "bg-blue-50 border-blue-400"
                : "bg-white border-slate-200 hover:border-blue-300"
            )}
          >
            <div className="font-medium text-sm text-slate-800">{ws.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{ws.desc}</div>
          </button>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canProceed={true} />
    </QuizCard>
  );
}
