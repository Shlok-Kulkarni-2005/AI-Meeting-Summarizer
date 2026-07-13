import { useState } from "react";
import { ChevronDown, Copy, Download } from "lucide-react";

export default function CardShell({
  icon: Icon,
  title,
  subtitle,
  onCopy,
  onDownload,
  defaultOpen = true,
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center gap-2.5 text-left flex-1 min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 rounded"
          aria-expanded={isOpen}
        >
          {Icon && (
            <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Icon size={16} />
            </span>
          )}
          <span className="min-w-0">
            <span className="block font-semibold text-slate-800 text-sm">{title}</span>
            {subtitle && <span className="block text-xs text-slate-400 truncate">{subtitle}</span>}
          </span>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          {onCopy && (
            <button
              onClick={onCopy}
              title="Copy"
              aria-label={`Copy ${title}`}
              className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              <Copy size={15} />
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              title="Download"
              aria-label={`Download ${title}`}
              className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              <Download size={15} />
            </button>
          )}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
            className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            <ChevronDown size={15} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {isOpen && <div className="px-5 pb-5 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}
