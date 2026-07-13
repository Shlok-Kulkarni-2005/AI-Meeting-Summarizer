import { Mic } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
          <Mic size={16} />
        </div>
        <span className="text-lg font-semibold text-slate-800 tracking-tight">Meeting Summarizer</span>
      </div>
    </header>
  );
}
