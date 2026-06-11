import { ArrowRight, Compass, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function Step0Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Career GPS Quiz</h1>
        <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
          Answer a few questions about yourself and we&apos;ll match you to career paths based on your unique profile — including careers you may never have considered.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { icon: Clock, label: "~10 minutes" },
          { icon: Compass, label: "60+ careers" },
          { icon: Shield, label: "No account needed" },
        ].map((item) => (
          <div key={item.label} className="bg-slate-50 rounded-xl p-3">
            <item.icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-700">{item.label}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onStart}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
      >
        Let&apos;s Start <ArrowRight className="w-5 h-5" />
      </button>
      <p className="text-xs text-slate-400">
        Career GPS helps you explore options. It does not make life decisions for you.
      </p>
    </div>
  );
}
