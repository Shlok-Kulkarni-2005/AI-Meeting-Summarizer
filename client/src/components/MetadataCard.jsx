import { Info } from "lucide-react";
import CardShell from "./CardShell";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-medium text-slate-600 text-right">{value}</span>
    </div>
  );
}

export default function MetadataCard({ meta }) {
  return (
    <CardShell icon={Info} title="Meeting Metadata" defaultOpen={false}>
      <Row label="File Name" value={meta.fileName} />
      <Row label="File Size" value={meta.fileSizeKB ? `${meta.fileSizeKB} KB` : "N/A"} />
      <Row
        label="Audio Length"
        value={
          meta.audioLengthSeconds
            ? `${Math.floor(meta.audioLengthSeconds / 60)}m ${Math.round(meta.audioLengthSeconds % 60)}s`
            : "N/A"
        }
      />
      <Row label="Processing Time" value={`${(meta.processingTimeMs / 1000).toFixed(1)}s`} />
      <Row label="Speech Model" value={meta.speechModel} />
      <Row label="LLM Used" value={meta.llmModel} />
      <Row label="Processed At" value={new Date(meta.uploadedAt).toLocaleString()} />
    </CardShell>
  );
}
