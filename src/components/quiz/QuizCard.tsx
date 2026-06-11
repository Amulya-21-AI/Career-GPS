import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function QuizCard({ title, subtitle, children, className }: Props) {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8", className)}>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1.5 text-slate-500 text-sm leading-relaxed">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
