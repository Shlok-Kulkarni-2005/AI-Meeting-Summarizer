const multer = require("multer");

// keeps error responses consistent across the app instead of
// letting express send its default html error page
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File is too large. Max size is 25MB." });
    }
    return res.status(400).json({ error: "File upload failed." });
  }

  if (err.message === "INVALID_FORMAT") {
    return res.status(400).json({ error: "Unsupported file format. Use mp3, wav or m4a." });
  }

  if (err.message === "NO_FILE") {
    return res.status(400).json({ error: "No audio file was uploaded." });
  }

  if (err.message === "EMPTY_TRANSCRIPT") {
    return res.status(422).json({ error: "Could not detect any speech in this recording." });
  }

  if (err instanceof SyntaxError) {
    return res.status(502).json({ error: "The AI returned an unexpected response while summarizing. Please try again." });
  }

  if (err.status === 401 || err.code === "invalid_api_key") {
    return res.status(500).json({ error: "Groq API key is missing or invalid." });
  }

  if (err.status >= 500) {
    return res.status(502).json({ error: "The AI service is temporarily unavailable. Please try again in a moment." });
  }

  if (err.code === "ECONNRESET" || err.code === "ENOTFOUND" || err.code === "ETIMEDOUT") {
    return res.status(503).json({ error: "Network error while contacting Groq. Please try again." });
  }

  return res.status(500).json({ error: "Something went wrong while processing the meeting." });
}

module.exports = errorHandler;
