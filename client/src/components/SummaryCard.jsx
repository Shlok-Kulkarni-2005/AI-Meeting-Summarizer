import { ClipboardList } from "lucide-react";
import CardShell from "./CardShell";
import { downloadAsMarkdown, buildReportMarkdown } from "../utils/download";

function Section({ title, children }) {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">{title}</h4>
      {children}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, idx) => (
        <li key={idx} className="text-sm text-slate-600">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function SummaryCard({ summary, result, onCopied }) {
  function handleCopy() {
    const text = [
      summary.executiveSummary,
      "",
      "Discussion Highlights:",
      ...summary.discussionHighlights.map((p) => `- ${p}`),
      "",
      "Key Decisions:",
      ...summary.keyDecisions.map((p) => `- ${p}`),
      "",
      "Meeting Outcome:",
      summary.meetingOutcome,
      "",
      "Next Steps:",
      ...summary.nextSteps.map((p) => `- ${p}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    onCopied?.();
  }

  function handleDownload() {
    downloadAsMarkdown("meeting-summary.md", buildReportMarkdown(result));
  }

  return (
    <CardShell icon={ClipboardList} title="Summary" onCopy={handleCopy} onDownload={handleDownload}>
      <Section title="Executive Summary">
        <p className="text-sm text-slate-600">{summary.executiveSummary}</p>
      </Section>

      {summary.discussionHighlights?.length > 0 && (
        <Section title="Discussion Highlights">
          <BulletList items={summary.discussionHighlights} />
        </Section>
      )}

      {summary.keyDecisions?.length > 0 && (
        <Section title="Key Decisions">
          <BulletList items={summary.keyDecisions} />
        </Section>
      )}

      {summary.meetingOutcome && (
        <Section title="Meeting Outcome">
          <p className="text-sm text-slate-600">{summary.meetingOutcome}</p>
        </Section>
      )}

      {summary.importantNotes?.length > 0 && (
        <Section title="Important Notes">
          <BulletList items={summary.importantNotes} />
        </Section>
      )}

      {summary.nextSteps?.length > 0 && (
        <Section title="Next Steps">
          <BulletList items={summary.nextSteps} />
        </Section>
      )}
    </CardShell>
  );
}
