import { Tags } from "lucide-react";
import CardShell from "./CardShell";

const BADGE_COLORS = [
  "bg-blue-50 text-blue-600",
  "bg-purple-50 text-purple-600",
  "bg-emerald-50 text-emerald-600",
  "bg-amber-50 text-amber-600",
  "bg-pink-50 text-pink-600",
  "bg-cyan-50 text-cyan-600",
];

export default function KeywordsCard({ keywords }) {
  if (!keywords?.length) return null;

  return (
    <CardShell icon={Tags} title="Keywords">
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, idx) => (
          <span
            key={idx}
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${BADGE_COLORS[idx % BADGE_COLORS.length]}`}
          >
            {keyword}
          </span>
        ))}
      </div>
    </CardShell>
  );
}
