"use client";
import { useQuizStore } from "@/store/quizStore";
import QuizCard from "../QuizCard";
import NavButtons from "../NavButtons";

interface SliderProps {
  label: string;
  desc: string;
  value: number;
  onChange: (val: number) => void;
  lowLabel: string;
  highLabel: string;
}

function Slider({ label, desc, value, onChange, lowLabel, highLabel }: SliderProps) {
  return (
    <div className="space-y-2">
      <div>
        <div className="font-medium text-sm text-slate-800">{label}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
      <div className="space-y-1">
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>{lowLabel}</span>
          <span className="font-semibold text-blue-600">{value}/10</span>
          <span>{highLabel}</span>
        </div>
      </div>
    </div>
  );
}

interface Props { onNext: () => void; onBack: () => void; }

export default function Step7Comfort({ onNext, onBack }: Props) {
  const { profile, updateProfile } = useQuizStore();

  return (
    <QuizCard title="Your comfort levels" subtitle="Rate how comfortable you are with each of these on a 1-10 scale.">
      <div className="space-y-6">
        <Slider
          label="🖥️ Technology Comfort"
          desc="How comfortable are you learning and using tech tools, software, and code?"
          value={profile.techComfort || 5}
          onChange={(v) => updateProfile({ techComfort: v })}
          lowLabel="Not at all"
          highLabel="Very comfortable"
        />
        <Slider
          label="👥 People-Facing Comfort"
          desc="How comfortable are you talking, presenting, or collaborating with others?"
          value={profile.peopleComfort || 5}
          onChange={(v) => updateProfile({ peopleComfort: v })}
          lowLabel="Prefer to avoid"
          highLabel="Love it"
        />
        <Slider
          label="🎨 Creative Work Comfort"
          desc="How comfortable are you with design, ideation, artistic, or storytelling work?"
          value={profile.creativeComfort || 5}
          onChange={(v) => updateProfile({ creativeComfort: v })}
          lowLabel="Not creative"
          highLabel="Highly creative"
        />
        <Slider
          label="📊 Analytical Work Comfort"
          desc="How comfortable are you with data, numbers, logic, and structured problem-solving?"
          value={profile.analyticalComfort || 5}
          onChange={(v) => updateProfile({ analyticalComfort: v })}
          lowLabel="Avoid numbers"
          highLabel="Love analysis"
        />
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canProceed={true} />
    </QuizCard>
  );
}
