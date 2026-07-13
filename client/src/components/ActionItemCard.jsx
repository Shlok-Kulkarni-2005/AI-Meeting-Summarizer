import { useState } from "react";
import { ListChecks, User, Calendar } from "lucide-react";
import CardShell from "./CardShell";
import { downloadAsTxt } from "../utils/download";

const PRIORITY_STYLES = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-slate-100 text-slate-500",
};

const STATUS_STYLES = {
  Pending: "bg-blue-50 text-blue-600",
  Completed: "bg-emerald-50 text-emerald-600",
};

export default function ActionItemCard({ actionItems, onCopied }) {
  const [checkedItems, setCheckedItems] = useState({});

  function toggleItem(idx) {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function handleCopy() {
    const text = actionItems
      .map((item) => `- ${item.task} (Owner: ${item.owner}, Priority: ${item.priority}${item.deadline ? `, Deadline: ${item.deadline}` : ""})`)
      .join("\n");
    navigator.clipboard.writeText(text);
    onCopied?.();
  }

  function handleDownload() {
    const text = actionItems
      .map((item) => `[ ] ${item.task} - Owner: ${item.owner}, Priority: ${item.priority}${item.deadline ? `, Deadline: ${item.deadline}` : ""}`)
      .join("\n");
    downloadAsTxt("action-items.txt", text);
  }

  return (
    <CardShell
      icon={ListChecks}
      title="Action Items"
      subtitle={`${actionItems.length} item${actionItems.length !== 1 ? "s" : ""}`}
      onCopy={actionItems.length ? handleCopy : null}
      onDownload={actionItems.length ? handleDownload : null}
    >
      {actionItems.length === 0 ? (
        <p className="text-sm text-slate-400">No action items were found in this meeting.</p>
      ) : (
        <ul className="space-y-2">
          {actionItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 hover:border-slate-200 transition-colors"
            >
              <input
                type="checkbox"
                checked={!!checkedItems[idx]}
                onChange={() => toggleItem(idx)}
                aria-label={`Mark "${item.task}" as done`}
                className="mt-1 accent-brand-600"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm mb-1.5 ${
                    checkedItems[idx] ? "line-through text-slate-400" : "text-slate-700"
                  }`}
                >
                  {item.task}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                    <User size={11} />
                    {item.owner}
                  </span>
                  {item.deadline && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                      <Calendar size={11} />
                      {item.deadline}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.Medium}`}>
                    {item.priority}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[item.status] || STATUS_STYLES.Pending}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}
