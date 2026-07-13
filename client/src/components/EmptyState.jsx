import { FileAudio } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="text-center py-10 px-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
        <FileAudio size={28} />
      </div>
      <h3 className="text-slate-700 font-medium mb-1">No meeting processed yet</h3>
      <p className="text-sm text-slate-400 max-w-sm mx-auto">
        Upload a recording above and your transcript, summary and action items will show up here.
      </p>
    </div>
  );
}
