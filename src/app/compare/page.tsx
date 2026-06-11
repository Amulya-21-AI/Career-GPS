"use client";
import Link from "next/link";
import { useQuizStore } from "@/store/quizStore";
import { getCareerById } from "@/data/careers";
import { typeBadgeClass, typeLabel } from "@/lib/utils";
import { X, BarChart2 } from "lucide-react";

function ScoreBar({ value, max = 10 }: { value: number; max?: number }) {
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
}

export default function ComparePage() {
  const { compareList, toggleCompare } = useQuizStore();
  const selectedCareers = compareList.map((id) => getCareerById(id)).filter(Boolean);

  const rows = [
    { label: "Category", render: (c: ReturnType<typeof getCareerById>) => c!.category },
    { label: "Type", render: (c: ReturnType<typeof getCareerById>) => <span className={`text-xs px-2 py-0.5 rounded-full ${typeBadgeClass(c!.type)}`}>{typeLabel(c!.type)}</span> },
    { label: "Entry Salary", render: (c: ReturnType<typeof getCareerById>) => c!.salaryRangeEntry },
    { label: "Mid Salary", render: (c: ReturnType<typeof getCareerById>) => c!.salaryRangeMid },
    { label: "Senior Salary", render: (c: ReturnType<typeof getCareerById>) => c!.salaryRangeSenior },
    { label: "Timeline", render: (c: ReturnType<typeof getCareerById>) => `${c!.timelineMonths} months` },
    { label: "Demand", render: (c: ReturnType<typeof getCareerById>) => <><span className="text-sm font-bold">{c!.demandScore}/10</span><ScoreBar value={c!.demandScore} /></> },
    { label: "Growth Potential", render: (c: ReturnType<typeof getCareerById>) => <><span className="text-sm font-bold">{c!.growthPotential}/10</span><ScoreBar value={c!.growthPotential} /></> },
    { label: "Remote Score", render: (c: ReturnType<typeof getCareerById>) => <><span className="text-sm font-bold">{c!.remoteFriendlyScore}/10</span><ScoreBar value={c!.remoteFriendlyScore} /></> },
    { label: "Difficulty", render: (c: ReturnType<typeof getCareerById>) => <><span className="text-sm font-bold">{c!.difficultyScore}/10</span><ScoreBar value={c!.difficultyScore} /></> },
    { label: "Risk Score", render: (c: ReturnType<typeof getCareerById>) => <><span className="text-sm font-bold">{c!.riskScore}/10</span><ScoreBar value={c!.riskScore} /></> },
    {
      label: "Top Skills", render: (c: ReturnType<typeof getCareerById>) => (
        <div className="flex flex-wrap gap-1">
          {c!.requiredSkills.slice(0, 3).map((s) => (
            <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      )
    },
    {
      label: "Entry Pathway", render: (c: ReturnType<typeof getCareerById>) => (
        <span className="text-xs text-slate-600">{c!.entryPathways[0]}</span>
      )
    },
  ];

  if (selectedCareers.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <BarChart2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-3">No careers selected</h1>
          <p className="text-slate-500 mb-6">Browse careers and click the compare button to add up to 3 careers for side-by-side comparison.</p>
          <Link href="/careers" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-block">
            Browse Careers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Career Comparison</h1>
            <p className="text-slate-500 mt-1">Comparing {selectedCareers.length} career{selectedCareers.length > 1 ? "s" : ""} side-by-side</p>
          </div>
          <Link href="/careers" className="text-sm text-blue-600 hover:underline">+ Add more</Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Header row */}
          <div className={`grid border-b border-slate-200`} style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr)` }}>
            <div className="p-4 bg-slate-50 border-r border-slate-200"></div>
            {selectedCareers.map((career) => (
              <div key={career!.id} className="p-4 border-r border-slate-200 last:border-r-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/careers/${career!.id}`} className="font-bold text-slate-900 hover:text-blue-600 text-sm leading-tight block">
                      {career!.title}
                    </Link>
                  </div>
                  <button
                    onClick={() => toggleCompare(career!.id)}
                    className="flex-shrink-0 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Data rows */}
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`grid border-b border-slate-100 last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
              style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr)` }}
            >
              <div className="p-3 px-4 border-r border-slate-200 flex items-center">
                <span className="text-xs font-semibold text-slate-600">{row.label}</span>
              </div>
              {selectedCareers.map((career) => (
                <div key={career!.id} className="p-3 px-4 border-r border-slate-100 last:border-r-0 flex items-center text-sm text-slate-700">
                  {row.render(career)}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Add more careers from the <Link href="/careers" className="text-blue-600 hover:underline">careers page</Link> to compare.
        </div>
      </div>
    </div>
  );
}
