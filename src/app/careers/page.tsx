"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { careers, careerCategories } from "@/data/careers";
import type { Career } from "@/types";
import { cn, typeBadgeClass, typeLabel, difficultyLabel } from "@/lib/utils";
import { Search, Bookmark, BarChart2 } from "lucide-react";
import { useQuizStore } from "@/store/quizStore";

const types = ["all", "conventional", "unconventional", "emerging", "niche"] as const;

export default function CareersPage() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { toggleSaveCareer, savedCareers, toggleCompare, compareList } = useQuizStore();

  const filtered = useMemo(() => {
    return careers.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      const matchType = activeType === "all" || c.type === activeType;
      const matchCat = activeCategory === "all" || c.category === activeCategory;
      return matchSearch && matchType && matchCat;
    });
  }, [search, activeType, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Explore Careers</h1>
          <p className="text-slate-500">{careers.length} career paths across {careerCategories.length} categories</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search careers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize",
                    activeType === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn("px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                  activeCategory === "all" ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                )}
              >
                All
              </button>
              {careerCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn("px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                    activeCategory === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-4">{filtered.length} careers found</p>

        {/* Career Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((career) => {
            const isSaved = savedCareers.includes(career.id);
            const inCompare = compareList.includes(career.id);
            return (
              <div key={career.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeBadgeClass(career.type)}`}>
                        {typeLabel(career.type)}
                      </span>
                      <span className="text-xs text-slate-400">{career.category}</span>
                    </div>
                    <h3 className="font-bold text-slate-900">{career.title}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleSaveCareer(career.id)}
                      className={cn("p-1.5 rounded-lg border transition-colors",
                        isSaved ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-400 hover:text-blue-600"
                      )}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleCompare(career.id)}
                      title={compareList.length >= 3 && !inCompare ? "Max 3 comparisons" : "Compare"}
                      disabled={compareList.length >= 3 && !inCompare}
                      className={cn("p-1.5 rounded-lg border transition-colors",
                        inCompare ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-200 text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                      )}
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">{career.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {career.requiredSkills.slice(0, 3).map((s) => (
                    <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">{s}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>💰 {career.salaryRangeEntry}</span>
                  <span>⏱ {career.timelineMonths}mo</span>
                  <span className="capitalize">{difficultyLabel(career.difficultyScore)}</span>
                </div>

                <Link
                  href={`/careers/${career.id}`}
                  className="block w-full text-center text-sm font-medium text-blue-600 border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  View Details →
                </Link>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg font-medium mb-2">No careers found</p>
            <p className="text-sm">Try adjusting your filters or search term.</p>
          </div>
        )}

        {compareList.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3">
            <span className="text-sm font-medium">{compareList.length} selected for comparison</span>
            <Link href="/compare" className="bg-white text-indigo-700 px-3 py-1.5 rounded-xl text-sm font-bold hover:bg-indigo-50">
              Compare →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
