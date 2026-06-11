interface Props {
  progress: number;
  step: number;
  total: number;
}

export default function ProgressBar({ progress, step, total }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-slate-500">
        <span>Step {step} of {total}</span>
        <span>{progress}% complete</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
