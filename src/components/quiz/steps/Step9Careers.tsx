"use client";
import { useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import QuizCard from "../QuizCard";
import NavButtons from "../NavButtons";
import { Plus, X } from "lucide-react";

interface Props { onNext: () => void; onBack: () => void; }

function TagInput({
  label,
  placeholder,
  tags,
  onAdd,
  onRemove,
}: {
  label: string;
  placeholder: string;
  tags: string[];
  onAdd: (t: string) => void;
  onRemove: (t: string) => void;
}) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onAdd(val);
      setInput("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button onClick={handleAdd} className="px-3 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
            {t}
            <button onClick={() => onRemove(t)} className="hover:text-red-500">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Step9Careers({ onNext, onBack }: Props) {
  const { profile, updateProfile } = useQuizStore();

  const considered = profile.careersConsidered || [];
  const avoided = profile.careersAvoided || [];

  return (
    <QuizCard
      title="Career preferences"
      subtitle="Optional: tell us about careers you've already thought about. This improves your matches."
    >
      <div className="space-y-6">
        <TagInput
          label="Careers you've already considered"
          placeholder="e.g. Doctor, Software Engineer, CA..."
          tags={considered}
          onAdd={(t) => updateProfile({ careersConsidered: [...considered, t] })}
          onRemove={(t) => updateProfile({ careersConsidered: considered.filter((c) => c !== t) })}
        />
        <TagInput
          label="Careers you definitely DON'T want"
          placeholder="e.g. Sales, Accountant, Surgeon..."
          tags={avoided}
          onAdd={(t) => updateProfile({ careersAvoided: [...avoided, t] })}
          onRemove={(t) => updateProfile({ careersAvoided: avoided.filter((c) => c !== t) })}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          🎉 You&apos;re ready! Click <strong>Generate My Report</strong> to see your personalized career matches, skill gaps, and roadmap.
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Generate My Report ✨" canProceed={true} />
    </QuizCard>
  );
}
