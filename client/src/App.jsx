import { useState } from "react";
import axios from "axios";
import { FileText, FileDown, FileCode } from "lucide-react";
import Header from "./components/Header";
import UploadBox from "./components/UploadBox";
import ProcessingStages from "./components/ProcessingStages";
import EmptyState from "./components/EmptyState";
import MeetingHeaderBanner from "./components/MeetingHeaderBanner";
import TranscriptCard from "./components/TranscriptCard";
import SummaryCard from "./components/SummaryCard";
import ActionItemCard from "./components/ActionItemCard";
import InsightsCard from "./components/InsightsCard";
import KeywordsCard from "./components/KeywordsCard";
import MetadataCard from "./components/MetadataCard";
import Toast from "./components/Toast";
import { downloadAsTxt, downloadAsMarkdown, buildReportMarkdown, downloadReportPdf } from "./utils/download";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  function showToast(message) {
    setToastMessage(message);
  }

  async function handleUploadAndSummarize(file) {
    if (!file) return;

    setError("");
    setResult(null);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const uploadRes = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const summarizeRes = await axios.post(`${API_BASE_URL}/summarize`, {
        fileName: uploadRes.data.fileName,
        originalName: uploadRes.data.originalName,
        fileSizeKB: uploadRes.data.fileSizeKB,
      });

      setResult(summarizeRes.data);
    } catch (err) {
      const message = err.response?.data?.error || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  }

  function handleExport(format) {
    if (!result) return;
    if (format === "pdf") downloadReportPdf(result);
    if (format === "txt") downloadAsTxt("meeting-report.txt", buildReportMarkdown(result));
    if (format === "md") downloadAsMarkdown("meeting-report.md", buildReportMarkdown(result));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl w-full mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">
            Turn your meeting recordings into clear summaries
          </h1>
          <p className="text-slate-500 text-sm">
            Upload an audio recording and get a transcript, summary and action items in seconds.
          </p>
        </div>

        <UploadBox onSubmit={handleUploadAndSummarize} isProcessing={isProcessing} />

        {isProcessing && <ProcessingStages />}

        {error && (
          <div
            role="alert"
            className="mt-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4"
          >
            {error}
          </div>
        )}

        {!result && !isProcessing && !error && <EmptyState />}

        {result && !isProcessing && (
          <div className="mt-8 space-y-5">
            <MeetingHeaderBanner title={result.title} category={result.category} sentiment={result.sentiment} />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleExport("pdf")}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <FileDown size={13} /> PDF
              </button>
              <button
                onClick={() => handleExport("md")}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <FileCode size={13} /> Markdown
              </button>
              <button
                onClick={() => handleExport("txt")}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <FileText size={13} /> TXT
              </button>
            </div>

            <TranscriptCard
              transcript={result.transcript}
              transcriptTurns={result.transcriptTurns}
              speakerCount={result.insights.speakerCount}
              onCopied={() => showToast("Transcript copied")}
            />
            <SummaryCard summary={result.summary} result={result} onCopied={() => showToast("Summary copied")} />
            <ActionItemCard actionItems={result.actionItems} onCopied={() => showToast("Action items copied")} />
            <InsightsCard insights={result.insights} audioLengthSeconds={result.meta.audioLengthSeconds} />
            <KeywordsCard keywords={result.keywords} />
            <MetadataCard meta={result.meta} />
          </div>
        )}
      </main>

      {toastMessage && <Toast message={toastMessage} onDone={() => setToastMessage("")} />}
    </div>
  );
}
