"use client";
import { useQuizStore } from "@/store/quizStore";
import QuizCard from "../QuizCard";
import NavButtons from "../NavButtons";
import { cn } from "@/lib/utils";

const streams = [
  "Science (PCM)", "Science (PCB)", "Commerce", "Arts / Humanities",
  "Engineering", "Computer Science", "Medicine / Health Sciences",
  "Management / BBA", "Design", "Law", "Social Work / Sociology",
  "Other",
];

const commonSubjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
  "Economics", "Accounting", "Business Studies", "History", "Geography",
  "Political Science", "Psychology", "Sociology", "English Literature",
  "Statistics", "Finance", "Marketing", "HR Management",
  "Environmental Science", "Data Science",
];

interface Props { onNext: () => void; onBack: () => void; }

export default function Step2Education({ onNext, onBack }: Props) {
  const { profile, updateProfile } = useQuizStore();

  const toggleSubject = (subject: string) => {
    const current = profile.subjects || [];
    updateProfile({
      subjects: current.includes(subject)
        ? current.filter((s) => s !== subject)
        : [...current, subject],
    });
  };

  const canProceed = !!(profile.educationStream);

  return (
    <QuizCard title="Your education background" subtitle="This helps us understand what knowledge you already have.">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Education Stream *</label>
          <div className="flex flex-wrap gap-2">
            {streams.map((s) => (
              <button
                key={s}
                onClick={() => updateProfile({ educationStream: s })}
                className={cn(
                  "px-3 py-2 rounded-xl border text-sm font-medium transition-all",
                  profile.educationStream === s
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Degree / Qualification</label>
          <input
            type="text"
            placeholder="e.g. B.Com, B.Tech (CS), 12th (PCM), pursuing BBA..."
            value={profile.degree || ""}
            onChange={(e) => updateProfile({ degree: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Key Subjects Studied <span className="text-slate-400 font-normal">(pick all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {commonSubjects.map((subject) => (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={cn(
                  "px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
                  (profile.subjects || []).includes(subject)
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                )}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canProceed={canProceed} />
    </QuizCard>
  );
}
