import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STAGES = [
  "Uploading audio...",
  "Transcribing meeting...",
  "Analyzing conversation...",
  "Extracting decisions...",
  "Extracting action items...",
  "Generating insights...",
  "Preparing results...",
];

// We only get one response back from the server, there's no real per-stage
// progress event. This walks through the stages on a timer so the wait
// doesn't feel like a dead spinner, and caps at the last stage until the
// actual request resolves - it never claims to be "done" before it is.
export default function ProcessingStages() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => Math.min(prev + 1, STAGES.length - 1));
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.round(((stageIndex + 1) / STAGES.length) * 90);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6" role="status" aria-live="polite">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 size={18} className="text-brand-600 animate-spin" />
        <span className="text-sm font-medium text-slate-700">{STAGES[stageIndex]}</span>
      </div>

      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-xs text-slate-400 mt-2">This usually takes under a minute depending on recording length.</p>
    </div>
  );
}
