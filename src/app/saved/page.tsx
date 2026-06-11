"use client";
import Link from "next/link";
import { useQuizStore } from "@/store/quizStore";
import { getCareerById } from "@/data/careers";
import { typeBadgeClass, typeLabel, difficultyLabel } from "@/lib/utils";
import { Bookmark, BookmarkX, ArrowRight } from "lucide-react";

export default function SavedPage() {
  const { savedCareers, toggleSaveCareer } = useQuizStore();
  const saved = savedCareers.map((id) => getCareerById(id)).filter(Boolean);

  if (saved.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-3">No saved careers yet</h1>
          <p className="text-slate-500 mb-6">Browse careers or take the quiz, then click the bookmark icon to save careers for later.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/careers" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm">
              Browse Careers
            </Link>
            <Link href="/quiz" className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors text-sm">
              Take Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Saved Careers</h1>
          <p className="text-slate-500">{saved.length} career{saved.length > 1 ? "s" : ""} saved</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((career) => (
            <div key={career!.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeBadgeClass(career!.type)}`}>
                  {typeLabel(career!.type)}
                </span>
                <button
                  onClick={() => toggleSaveCareer(career!.id)}
                  className="p-1.5 text-blue-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove from saved"
                >
                  <BookmarkX className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{career!.title}</h3>
              <p className="text-xs text-slate-500 mb-2">{career!.category}</p>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{career!.description}</p>
              <div className="text-xs text-slate-500 flex gap-3 mb-3">
                <span>💰 {career!.salaryRangeEntry}</span>
                <span>⏱ {career!.timelineMonths}mo</span>
              </div>
              <Link
                href={`/careers/${career!.id}`}
                className="flex items-center justify-center gap-1 w-full text-sm font-medium text-blue-600 border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
