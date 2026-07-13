import { Smile, Meh, Frown } from "lucide-react";

const SENTIMENT_ICON = {
  Positive: Smile,
  Neutral: Meh,
  Negative: Frown,
};

const SENTIMENT_STYLE = {
  Positive: "text-emerald-600 bg-emerald-50",
  Neutral: "text-slate-500 bg-slate-100",
  Negative: "text-red-600 bg-red-50",
};

export default function MeetingHeaderBanner({ title, category, sentiment }) {
  const SentimentIcon = SENTIMENT_ICON[sentiment.label] || Meh;
  const sentimentStyle = SENTIMENT_STYLE[sentiment.label] || SENTIMENT_STYLE.Neutral;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl shadow-sm border border-slate-200 px-5 py-4 animate-fade-in">
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-slate-800 truncate">{title}</h2>
        <span className="text-xs text-slate-400">{category}</span>
      </div>

      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${sentimentStyle}`}>
        <SentimentIcon size={13} />
        {sentiment.label} &middot; {Math.round(sentiment.confidence * 100)}%
      </span>
    </div>
  );
}
