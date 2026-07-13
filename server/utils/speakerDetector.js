// Whisper gives us plain text, no diarization. If the recording itself had
// people announce themselves ("Speaker 1:", "Rahul:", etc.) those labels
// usually survive in the transcript as "Name: text". We detect that pattern
// instead of asking the LLM to guess speakers, since guessing would just be
// making names up.

const SPEAKER_LINE_REGEX = /^([A-Z][a-zA-Z0-9 ]{1,20}):\s+(.*)$/;

function detectSpeakerTurns(transcript) {
  const lines = transcript.split(/\n+/).map((l) => l.trim()).filter(Boolean);

  const turns = [];
  const speakersFound = new Set();

  for (const line of lines) {
    const match = line.match(SPEAKER_LINE_REGEX);
    if (match) {
      const [, speaker, text] = match;
      turns.push({ speaker, text });
      speakersFound.add(speaker);
    } else if (turns.length > 0) {
      // continuation of the previous speaker's line
      turns[turns.length - 1].text += " " + line;
    } else {
      turns.push({ speaker: null, text: line });
    }
  }

  // Require at least 2 distinct speakers across multiple turns before we
  // trust this as real diarization, otherwise a single "Agenda:" style
  // line could get misread as a speaker.
  const isReliable = speakersFound.size >= 2 && turns.filter((t) => t.speaker).length >= 3;

  if (!isReliable) {
    return { speakerCount: null, turns: splitIntoParagraphs(transcript) };
  }

  return { speakerCount: speakersFound.size, turns };
}

function splitIntoParagraphs(transcript) {
  const sentences = transcript.match(/[^.!?]+[.!?]+/g) || [transcript];
  const paragraphs = [];
  let current = "";

  sentences.forEach((sentence, idx) => {
    current += sentence.trim() + " ";
    if ((idx + 1) % 4 === 0) {
      paragraphs.push({ speaker: null, text: current.trim() });
      current = "";
    }
  });

  if (current.trim()) {
    paragraphs.push({ speaker: null, text: current.trim() });
  }

  return paragraphs;
}

module.exports = { detectSpeakerTurns };
