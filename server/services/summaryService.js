const groq = require("../config/groq");

const SYSTEM_PROMPT = `You are an assistant that turns raw meeting transcripts into a structured meeting report.

Ground rules:
- Only use information that is actually present in the transcript. Never invent names, dates, deadlines or decisions.
- If a task has a name attached to it in the transcript, set that as the owner. Otherwise set owner to "Unassigned".
- If a deadline is mentioned, include it exactly as stated. Otherwise set deadline to null, do not guess one.
- priority should be "High", "Medium" or "Low" based on urgency language used in the transcript (e.g. "urgent", "ASAP" -> High). Default to "Medium" if there's no clear signal.
- status should be "Completed" only if the transcript says the task is already done, otherwise "Pending".
- sentiment should reflect the overall tone of the conversation, not any single speaker.
- keywords should be 5-8 short topic words or phrases actually discussed, not generic filler.
- Keep summary text factual and concise, written for someone who missed the meeting.

Respond with ONLY valid JSON, no extra text, no markdown fences, in this exact shape:
{
  "title": "short suggested meeting title",
  "category": "e.g. Standup, Client Call, Planning, Support, Retrospective",
  "sentiment": { "label": "Positive | Neutral | Negative", "confidence": 0.0 },
  "summary": {
    "executiveSummary": "2-3 sentence overview",
    "discussionHighlights": ["point 1", "point 2"],
    "keyDecisions": ["decision 1"],
    "meetingOutcome": "one sentence on how the meeting concluded",
    "importantNotes": ["anything worth flagging separately"],
    "nextSteps": ["what happens after this meeting"]
  },
  "actionItems": [
    { "task": "description", "owner": "name or Unassigned", "priority": "High|Medium|Low", "deadline": "date string or null", "status": "Pending|Completed" }
  ],
  "keywords": ["keyword1", "keyword2"]
}`;

async function generateSummary(transcript) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.3,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Meeting transcript:\n\n${transcript}` },
    ],
  });

  const raw = completion.choices[0].message.content.trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    // the model occasionally wraps json in ```json fences despite instructions,
    // this strips that before giving up
    const cleaned = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  }

  return normalizeSummaryOutput(parsed);
}

// fills in safe defaults so a slightly malformed LLM response never crashes
// the response instead of just missing a field
function normalizeSummaryOutput(parsed) {
  const summary = parsed.summary || {};

  return {
    title: parsed.title || "Untitled Meeting",
    category: parsed.category || "General",
    sentiment: {
      label: parsed.sentiment?.label || "Neutral",
      confidence: typeof parsed.sentiment?.confidence === "number" ? parsed.sentiment.confidence : 0.5,
    },
    summary: {
      executiveSummary: summary.executiveSummary || "",
      discussionHighlights: summary.discussionHighlights || [],
      keyDecisions: summary.keyDecisions || [],
      meetingOutcome: summary.meetingOutcome || "",
      importantNotes: summary.importantNotes || [],
      nextSteps: summary.nextSteps || [],
    },
    actionItems: (parsed.actionItems || []).map((item) => ({
      task: item.task || "",
      owner: item.owner || "Unassigned",
      priority: item.priority || "Medium",
      deadline: item.deadline || null,
      status: item.status || "Pending",
    })),
    keywords: parsed.keywords || [],
  };
}

module.exports = { generateSummary };
