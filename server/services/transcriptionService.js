const fs = require("fs");
const groq = require("../config/groq");

async function transcribeAudio(filePath) {
  const audioStream = fs.createReadStream(filePath);

  const response = await groq.audio.transcriptions.create({
    file: audioStream,
    model: "whisper-large-v3-turbo",
    response_format: "verbose_json",
  });

  const transcript = response.text ? response.text.trim() : "";

  if (!transcript) {
    throw new Error("EMPTY_TRANSCRIPT");
  }

  return {
    transcript,
    // these come straight from Whisper, not guessed later on
    durationSeconds: response.duration || null,
    language: response.language || null,
  };
}

module.exports = { transcribeAudio };
