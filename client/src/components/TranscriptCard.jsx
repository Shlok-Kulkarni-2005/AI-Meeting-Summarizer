import { useMemo, useState } from "react";
import { FileText, Search, Users } from "lucide-react";
import CardShell from "./CardShell";
import { downloadAsTxt } from "../utils/download";

function highlightMatches(text, query) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, idx) =>
    part.toLowerCase() === query.toLowerCase() ? <mark key={idx}>{part}</mark> : part
  );
}

export default function TranscriptCard({ transcript, transcriptTurns, speakerCount, onCopied }) {
  const [query, setQuery] = useState("");

  const matchCount = useMemo(() => {
    if (!query.trim()) return 0;
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    return (transcript.match(regex) || []).length;
  }, [query, transcript]);

  function handleCopy() {
    navigator.clipboard.writeText(transcript);
    onCopied?.();
  }

  function handleDownload() {
    downloadAsTxt("transcript.txt", transcript);
  }

  return (
    <CardShell
      icon={FileText}
      title="Transcript"
      subtitle={speakerCount ? `${speakerCount} speakers detected` : null}
      onCopy={handleCopy}
      onDownload={handleDownload}
    >
      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transcript..."
          aria-label="Search transcript"
          className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {query && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {matchCount} match{matchCount !== 1 ? "es" : ""}
          </span>
        )}
      </div>

      <div className="text-sm text-slate-600 max-h-72 overflow-y-auto space-y-3 pr-1">
        {transcriptTurns.map((turn, idx) => (
          <p key={idx}>
            {turn.speaker && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 mr-1.5">
                <Users size={11} />
                {turn.speaker}:
              </span>
            )}
            {highlightMatches(turn.text, query)}
          </p>
        ))}
      </div>
    </CardShell>
  );
}
