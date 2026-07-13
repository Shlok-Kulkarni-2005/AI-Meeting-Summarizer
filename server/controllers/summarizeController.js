const fs = require("fs");
const path = require("path");
const { transcribeAudio } = require("../services/transcriptionService");
const { generateSummary } = require("../services/summaryService");
const { detectSpeakerTurns } = require("../utils/speakerDetector");
const { getWordCount, getReadingTimeMinutes } = require("../utils/textStats");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

async function summarizeMeeting(req, res, next) {
  const { fileName, originalName, fileSizeKB } = req.body;
  let filePath;
  const startedAt = Date.now();

  try {
    if (!fileName) {
      throw new Error("NO_FILE");
    }

    filePath = path.join(UPLOADS_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "Uploaded file not found. Please upload again." });
    }

    const { transcript, durationSeconds, language } = await transcribeAudio(filePath);
    const report = await generateSummary(transcript);
    const { speakerCount, turns } = detectSpeakerTurns(transcript);

    const wordCount = getWordCount(transcript);

    res.json({
      transcript,
      transcriptTurns: turns,
      title: report.title,
      category: report.category,
      sentiment: report.sentiment,
      summary: report.summary,
      actionItems: report.actionItems,
      keywords: report.keywords,
      insights: {
        wordCount,
        readingTimeMinutes: getReadingTimeMinutes(wordCount),
        decisionsCount: report.summary.keyDecisions.length,
        actionItemsCount: report.actionItems.length,
        speakerCount,
        language,
      },
      meta: {
        fileName: originalName || fileName,
        fileSizeKB: fileSizeKB || null,
        audioLengthSeconds: durationSeconds,
        processingTimeMs: Date.now() - startedAt,
        speechModel: "whisper-large-v3-turbo",
        llmModel: "openai/gpt-oss-120b",
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  } finally {
    // clean up the uploaded audio regardless of success or failure
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error("Failed to delete temp file:", unlinkErr);
      });
    }
  }
}

module.exports = { summarizeMeeting };
