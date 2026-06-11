"use client";
import { useQuizStore } from "@/store/quizStore";
import QuizCard from "../QuizCard";
import NavButtons from "../NavButtons";
import { cn } from "@/lib/utils";

const interestOptions = [
  "Technology", "Data & Analytics", "Design & Aesthetics", "Writing & Storytelling",
  "People & Relationships", "Nature & Environment", "Business & Entrepreneurship",
  "Art & Creativity", "Health & Wellness", "Science & Research",
  "Education & Teaching", "Social Impact", "Finance & Investment",
  "Law & Justice", "Media & Entertainment", "Sports & Fitness",
  "Food & Nutrition", "Travel & Culture", "Gaming", "Music",
  "Psychology & Human Behavior", "Policy & Governance", "Space & Future Tech",
  "Fashion & Lifestyle",
];

interface Props { onNext: () => void; onBack: () => void; }

export default function Step4Interests({ onNext, onBack }: Props) {
  const { profile, updateProfile } = useQuizStore();

  const toggle = (interest: string) => {
    const current = profile.interests || [];
    updateProfile({
      interests: current.includes(interest) ? current.filter((i) => i !== interest) : [...current, interest],
    });
  };

  const canProceed = (profile.interests || []).length >= 3;

  return (
    <QuizCard
      title="What genuinely interests you?"
      subtitle="Pick at least 3 things that you could spend hours on without getting bored."
    >
      <div className="flex flex-wrap gap-2 mb-2">
        {interestOptions.map((interest) => (
          <button
            key={interest}
            onClick={() => toggle(interest)}
            className={cn(
              "px-3 py-2 rounded-xl border text-sm font-medium transition-all",
              (profile.interests || []).includes(interest)
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
            )}
          >
            {interest}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400 mb-2">
        Selected: {(profile.interests || []).length} (minimum 3)
      </p>
      <NavButtons onBack={onBack} onNext={onNext} canProceed={canProceed} />
    </QuizCard>
  );
}
