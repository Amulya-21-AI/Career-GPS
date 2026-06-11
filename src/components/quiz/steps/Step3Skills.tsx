"use client";
import { useQuizStore } from "@/store/quizStore";
import QuizCard from "../QuizCard";
import NavButtons from "../NavButtons";
import { cn } from "@/lib/utils";

const skillOptions = [
  "Microsoft Excel", "Python", "SQL", "Data Analysis", "PowerPoint Presentations",
  "Research & Writing", "Graphic Design", "Video Editing", "Social Media Management",
  "Public Speaking", "Project Management", "Customer Service", "Sales & Negotiation",
  "Coding / Programming", "Content Writing", "Photography", "Teaching / Tutoring",
  "Financial Analysis", "Marketing", "HR / Recruitment", "Event Planning",
  "Foreign Language", "Problem Solving", "Critical Thinking", "Leadership",
  "Adobe Photoshop / Illustrator", "Canva", "Figma", "SEO / Digital Marketing",
  "No formal skills yet",
];

interface Props { onNext: () => void; onBack: () => void; }

export default function Step3Skills({ onNext, onBack }: Props) {
  const { profile, updateProfile } = useQuizStore();

  const toggle = (skill: string) => {
    const current = profile.currentSkills || [];
    updateProfile({
      currentSkills: current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill],
    });
  };

  return (
    <QuizCard title="Your current skills" subtitle="Don't worry if you have few skills — everyone starts somewhere. Pick whatever applies.">
      <div className="flex flex-wrap gap-2 mb-2">
        {skillOptions.map((skill) => (
          <button
            key={skill}
            onClick={() => toggle(skill)}
            className={cn(
              "px-3 py-2 rounded-xl border text-xs font-medium transition-all",
              (profile.currentSkills || []).includes(skill)
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
            )}
          >
            {skill}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400 mb-2">
        Selected: {(profile.currentSkills || []).length} skills
      </p>
      <NavButtons onBack={onBack} onNext={onNext} canProceed={true} />
    </QuizCard>
  );
}
