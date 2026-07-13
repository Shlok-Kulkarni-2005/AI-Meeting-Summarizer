import { BarChart3 } from "lucide-react";
import CardShell from "./CardShell";

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2.5">
      <p className="text-base font-semibold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

export default function InsightsCard({ insights, audioLengthSeconds }) {
  const durationLabel = audioLengthSeconds
    ? `${Math.floor(audioLengthSeconds / 60)}m ${Math.round(audioLengthSeconds % 60)}s`
    : "N/A";

  return (
    <CardShell icon={BarChart3} title="Meeting Insights">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Stat label="Duration" value={durationLabel} />
        <Stat label="Word Count" value={insights.wordCount.toLocaleString()} />
        <Stat label="Reading Time" value={`${insights.readingTimeMinutes} min`} />
        <Stat label="Language" value={insights.language ? insights.language.toUpperCase() : "N/A"} />
        <Stat label="Decisions" value={insights.decisionsCount} />
        <Stat label="Action Items" value={insights.actionItemsCount} />
        <Stat label="Speakers" value={insights.speakerCount || "Not detected"} />
      </div>
    </CardShell>
  );
}
