import { useRef, useState } from "react";
import { UploadCloud, X, RefreshCw, FileAudio } from "lucide-react";

const ALLOWED_TYPES = [".mp3", ".wav", ".m4a"];
const MAX_SIZE_MB = 25;

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds) {
  if (!seconds || Number.isNaN(seconds)) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function UploadBox({ onSubmit, isProcessing }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const inputRef = useRef(null);
  const audioRef = useRef(null);

  function validateAndSet(file) {
    if (!file) return;
    const ext = "." + file.name.split(".").pop().toLowerCase();

    if (!ALLOWED_TYPES.includes(ext)) {
      setErrorMsg("Please choose an mp3, wav or m4a file.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setErrorMsg("");
    setSelectedFile(file);
    setDuration(null);
    setPlaybackRate(1);
    setAudioUrl(URL.createObjectURL(file));
  }

  function clearSelection() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setSelectedFile(null);
    setAudioUrl(null);
    setDuration(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;
    validateAndSet(e.dataTransfer.files[0]);
  }

  function handleSpeedChange(rate) {
    setPlaybackRate(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!isProcessing) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            isDragging ? "border-brand-500 bg-brand-50" : "border-slate-300"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud size={22} />
          </div>

          <p className="text-slate-600 mb-1">Drag and drop your meeting recording here</p>
          <p className="text-slate-400 text-xs mb-4">Supports MP3, WAV, M4A &middot; Up to {MAX_SIZE_MB}MB</p>

          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.wav,.m4a"
            onChange={(e) => validateAndSet(e.target.files[0])}
            className="hidden"
          />
          <button
            onClick={() => inputRef.current.click()}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 disabled:opacity-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            Choose File
          </button>

          {errorMsg && <p className="mt-3 text-sm text-red-500">{errorMsg}</p>}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <FileAudio size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">
                  {formatFileSize(selectedFile.size)}
                  {duration && ` \u00b7 ${formatDuration(duration)}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => inputRef.current.click()}
                disabled={isProcessing}
                title="Change file"
                aria-label="Change file"
                className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 disabled:opacity-40 transition-colors"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={clearSelection}
                disabled={isProcessing}
                title="Remove file"
                aria-label="Remove file"
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.wav,.m4a"
            onChange={(e) => validateAndSet(e.target.files[0])}
            className="hidden"
          />

          <audio
            ref={audioRef}
            controls
            src={audioUrl}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            className="w-full"
          />

          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-slate-400">Playback speed</span>
            {[0.75, 1, 1.5, 2].map((rate) => (
              <button
                key={rate}
                onClick={() => handleSpeedChange(rate)}
                className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
                  playbackRate === rate
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {errorMsg && <p className="mt-3 text-sm text-red-500">{errorMsg}</p>}
        </div>
      )}

      <button
        onClick={() => onSubmit(selectedFile)}
        disabled={!selectedFile || isProcessing}
        className="mt-5 w-full py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        {isProcessing ? "Processing..." : "Upload & Summarize"}
      </button>
    </div>
  );
}
