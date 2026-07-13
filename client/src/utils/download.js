import { jsPDF } from "jspdf";

function triggerDownload(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadAsTxt(filename, content) {
  triggerDownload(filename, content, "text/plain");
}

export function downloadAsMarkdown(filename, content) {
  triggerDownload(filename, content, "text/markdown");
}

export function buildReportMarkdown(result) {
  const { summary, actionItems, keywords, title } = result;
  const lines = [`# ${title || "Meeting Summary"}`, ""];

  lines.push("## Executive Summary", summary.executiveSummary, "");

  if (summary.discussionHighlights?.length) {
    lines.push("## Discussion Highlights");
    summary.discussionHighlights.forEach((point) => lines.push(`- ${point}`));
    lines.push("");
  }

  if (summary.keyDecisions?.length) {
    lines.push("## Key Decisions");
    summary.keyDecisions.forEach((point) => lines.push(`- ${point}`));
    lines.push("");
  }

  if (summary.meetingOutcome) {
    lines.push("## Meeting Outcome", summary.meetingOutcome, "");
  }

  if (summary.nextSteps?.length) {
    lines.push("## Next Steps");
    summary.nextSteps.forEach((point) => lines.push(`- ${point}`));
    lines.push("");
  }

  if (actionItems?.length) {
    lines.push("## Action Items");
    actionItems.forEach((item) => {
      const deadline = item.deadline ? `, Deadline: ${item.deadline}` : "";
      lines.push(`- [ ] ${item.task} (Owner: ${item.owner}, Priority: ${item.priority}${deadline})`);
    });
    lines.push("");
  }

  if (keywords?.length) {
    lines.push("## Keywords", keywords.join(", "));
  }

  return lines.join("\n");
}

export function downloadReportPdf(result) {
  const doc = new jsPDF();
  const marginLeft = 15;
  const pageHeight = doc.internal.pageSize.height;
  let cursorY = 20;

  function ensureSpace(lineCount = 1) {
    if (cursorY + lineCount * 6 > pageHeight - 15) {
      doc.addPage();
      cursorY = 20;
    }
  }

  function addHeading(text) {
    ensureSpace(2);
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text(text, marginLeft, cursorY);
    cursorY += 8;
    doc.setFont(undefined, "normal");
  }

  function addParagraph(text) {
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(text, 180);
    ensureSpace(lines.length);
    doc.text(lines, marginLeft, cursorY);
    cursorY += lines.length * 6 + 4;
  }

  function addList(items) {
    doc.setFontSize(11);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(`- ${item}`, 178);
      ensureSpace(lines.length);
      doc.text(lines, marginLeft, cursorY);
      cursorY += lines.length * 6;
    });
    cursorY += 4;
  }

  doc.setFontSize(17);
  doc.setFont(undefined, "bold");
  doc.text(result.title || "Meeting Summary", marginLeft, cursorY);
  doc.setFont(undefined, "normal");
  cursorY += 12;

  addHeading("Executive Summary");
  addParagraph(result.summary.executiveSummary);

  if (result.summary.discussionHighlights?.length) {
    addHeading("Discussion Highlights");
    addList(result.summary.discussionHighlights);
  }

  if (result.summary.keyDecisions?.length) {
    addHeading("Key Decisions");
    addList(result.summary.keyDecisions);
  }

  if (result.summary.meetingOutcome) {
    addHeading("Meeting Outcome");
    addParagraph(result.summary.meetingOutcome);
  }

  if (result.summary.nextSteps?.length) {
    addHeading("Next Steps");
    addList(result.summary.nextSteps);
  }

  if (result.actionItems?.length) {
    addHeading("Action Items");
    addList(
      result.actionItems.map((item) => {
        const deadline = item.deadline ? `, Deadline: ${item.deadline}` : "";
        return `${item.task} (Owner: ${item.owner}, Priority: ${item.priority}${deadline})`;
      })
    );
  }

  if (result.keywords?.length) {
    addHeading("Keywords");
    addParagraph(result.keywords.join(", "));
  }

  doc.save("meeting-summary.pdf");
}
