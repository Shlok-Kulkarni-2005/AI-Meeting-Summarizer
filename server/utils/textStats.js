function getWordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getReadingTimeMinutes(wordCount) {
  // average adult reading speed, rounded up so "1 min" doesn't show for 3 words
  const minutes = wordCount / 200;
  return Math.max(1, Math.ceil(minutes));
}

module.exports = { getWordCount, getReadingTimeMinutes };
