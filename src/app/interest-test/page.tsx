"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { useQuizStore } from "@/store/quizStore";
import type { InterestTestResult } from "@/types";

const QUESTIONS = [
  {
    id: "q1",
    question: "You have a free weekend with no obligations. What do you naturally drift towards?",
    options: [
      { label: "Building or fixing something hands-on", value: "builder" },
      { label: "Researching a topic that caught my interest", value: "researcher" },
      { label: "Connecting with people or organising a group", value: "connector" },
      { label: "Creating something — writing, art, music, design", value: "creator" },
    ],
  },
  {
    id: "q2",
    question: "A project at work/college has no clear answer. You tend to:",
    options: [
      { label: "Dig into data and find patterns", value: "analytical" },
      { label: "Brainstorm wildly and experiment", value: "creative" },
      { label: "Talk to people who've solved it before", value: "social" },
      { label: "Build a structured plan and execute it", value: "systematic" },
    ],
  },
  {
    id: "q3",
    question: "Which risk feels most acceptable to you right now?",
    options: [
      { label: "Taking a low-paying role to learn something new", value: "low-pay" },
      { label: "Jumping into a field where I have no credentials yet", value: "no-credentials" },
      { label: "Starting something with no guarantee it'll work", value: "entrepreneurial" },
      { label: "Staying in a stable path even if it's slow", value: "stability" },
    ],
  },
  {
    id: "q4",
    question: "Your dream work environment looks like:",
    options: [
      { label: "Remote, async, deep focus work", value: "remote-deep" },
      { label: "Collaborative office with constant feedback", value: "office-collab" },
      { label: "Mixed — some alone time, some team time", value: "hybrid" },
      { label: "Anywhere, as long as I'm building my own thing", value: "entrepreneurial" },
    ],
  },
  {
    id: "q5",
    question: "Would you rather:",
    options: [
      { label: "Be a known expert in a narrow field", value: "specialist" },
      { label: "Be someone who can do 5 things well", value: "generalist" },
      { label: "Lead a team that executes on big ideas", value: "leader" },
      { label: "Create things people use or experience directly", value: "creator" },
    ],
  },
  {
    id: "q6",
    question: "When you imagine yourself 5 years from now, what matters most?",
    options: [
      { label: "High income — I want financial security", value: "income" },
      { label: "Impact — I want to matter to people or society", value: "impact" },
      { label: "Autonomy — I want control over my time and work", value: "autonomy" },
      { label: "Recognition — I want to be respected in my field", value: "recognition" },
    ],
  },
  {
    id: "q7",
    question: "Which description fits how you learn best?",
    options: [
      { label: "I learn by doing — projects, experiments, mistakes", value: "hands-on" },
      { label: "I learn by watching and reading before I try", value: "theory-first" },
      { label: "I learn through conversation and teaching others", value: "social-learner" },
      { label: "I learn in bursts when I'm deeply motivated", value: "intrinsic" },
    ],
  },
  {
    id: "q8",
    question: "The career advice that resonates with you most is:",
    options: [
      { label: "Follow the money — skills + demand = opportunity", value: "pragmatic" },
      { label: "Follow your curiosity — interest compounds over time", value: "curious" },
      { label: "Follow the gap — find what the world needs and fill it", value: "strategic" },
      { label: "Follow your strengths — double down on what you're already good at", value: "strengths" },
    ],
  },
];

const DIM_LABELS: Record<string, string> = {
  interestFit: "Interest Fit",
  skillFit: "Skill Fit",
  disciplineLevel: "Discipline Level",
  careerScope: "Career Scope",
  creativePotential: "Creative Potential",
  riskLevel: "Risk Tolerance",
  streamAlignment: "Stream Alignment",
};

function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-700 font-medium">{label}</span>
        <span className="text-violet-600 font-bold">{score}/10</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-700"
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}

export default function InterestTestPage() {
  const { setInterestTestResult, interestTestResult, profile } = useQuizStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterestTestResult | null>(interestTestResult);

  const q = QUESTIONS[current];
  const answered = Object.keys(answers).length;
  const allDone = answered === QUESTIONS.length;

  async function submit() {
    setLoading(true);
    try {
      const formatted: Record<string, string> = {};
      QUESTIONS.forEach((q) => {
        const ans = answers[q.id];
        const opt = q.options.find((o) => o.value === ans);
        formatted[q.question] = opt?.label ?? ans;
      });

      const res = await fetch("/api/interest-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formatted, profile }),
      });
      const data = await res.json();
      const r: InterestTestResult = { ...data, completedAt: new Date().toISOString() };
      setResult(r);
      setInterestTestResult(r);
    } catch {
      // mock fallback
      const r: InterestTestResult = {
        interestFit: 7,
        skillFit: 6,
        disciplineLevel: 6,
        careerScope: 8,
        creativePotential: 7,
        riskLevel: 5,
        streamAlignment: 7,
        summary: "Your interests and path are more aligned than you think. The biggest move is converting curiosity into visible projects.",
        completedAt: new Date().toISOString(),
      };
      setResult(r);
      setInterestTestResult(r);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const dims = Object.entries(DIM_LABELS).map(([key, label]) => ({
      key,
      label,
      score: result[key as keyof InterestTestResult] as number,
    }));
    const avg = Math.round(dims.reduce((s, d) => s + d.score, 0) / dims.length);

    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-violet-600 px-6 py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-white mb-1">Your Interest Profile</h1>
              <p className="text-violet-200 text-sm">Overall Score: {avg}/10</p>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                <div className="flex gap-2 items-start">
                  <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-violet-900 leading-relaxed">{result.summary}</p>
                </div>
              </div>
              <div className="space-y-4">
                {dims.map((d) => (
                  <ScoreBar key={d.key} score={d.score} label={d.label} />
                ))}
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/chat"
                  className="flex-1 flex items-center justify-center gap-2 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
                >
                  Talk to your future self <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
                >
                  View dashboard
                </Link>
              </div>
              <button
                onClick={() => { setResult(null); setAnswers({}); setCurrent(0); }}
                className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors mt-1"
              >
                Retake the test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Question {current + 1} of {QUESTIONS.length}</span>
            <span>{answered} answered</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
          <p className="font-semibold text-slate-900 text-lg leading-snug mb-6">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, [q.id]: opt.value }));
                  if (current < QUESTIONS.length - 1) {
                    setTimeout(() => setCurrent((c) => c + 1), 200);
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  answers[q.id] === opt.value
                    ? "border-violet-400 bg-violet-50 text-violet-800 font-medium"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-200 hover:bg-violet-50/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
            disabled={current === 0}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {current < QUESTIONS.length - 1 ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              disabled={!answers[q.id]}
              className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!allDone || loading}
              className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Scoring…" : "See my results"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
