import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export default function Toast({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
      <div className="flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg">
        <CheckCircle2 size={16} className="text-emerald-400" />
        {message}
      </div>
    </div>
  );
}
