import os from "os";
import chalk from "chalk";


const ALLOWED_TYPES = [
  "feat", "fix", "refactor", "chore", "docs",
  "test", "style", "perf", "build", "ci", "hotfix"
];

function wordWrap(text = "", width = 72) {
  // simple word wrap
  const words = text.trim().split(/\s+/);
  let line = "";
  const out = [];
  for (const w of words) {
    if ((line + " " + w).trim().length <= width) {
      line = (line + " " + w).trim();
    } else {
      out.push(line);
      line = w;
    }
  }
  if (line) out.push(line);
  return out.join(os.EOL);
}

function sanitizeScope(scope = "") {
  const s = (scope || "").trim();
  if (!s) return "";
  const clean = s.replace(/[^a-zA-Z0-9\-_.\/]/g, "");
  return clean;
}

function normalizeSummary(summary = "") {
  const s = (summary || "").trim();
  const noDot = s.replace(/\.$/, "");
  return noDot;
}

export function validateAndFormatCommit({
  type,
  scope,
  summary,
  body,
  ticket, 
  footerAction = "Refs"
}) {
  if (!type || !summary) {
    throw new Error("Missing required fields: type and summary are required.");
  }

  const t = String(type).trim().toLowerCase();
  if (!ALLOWED_TYPES.includes(t)) {
    throw new Error(`Invalid type '${type}'. Allowed types: ${ALLOWED_TYPES.join(", ")}`);
  }

  const cleanScope = sanitizeScope(scope);
  let cleanSummary = normalizeSummary(summary);

  const MAX_SUMMARY = 72;
  if (cleanSummary.length > MAX_SUMMARY) {
    console.warn(chalk.yellow(`⚠️  Summary longer than ${MAX_SUMMARY} chars — truncating.`));
    cleanSummary = cleanSummary.slice(0, MAX_SUMMARY - 1).trim() + "…";
  }

  const header = cleanScope ? `${t}(${cleanScope}): ${cleanSummary}` : `${t}: ${cleanSummary}`;

  let finalBody = "";
  if (body && String(body).trim().length > 0) {
    finalBody = wordWrap(body, 72);
  }

  let footer = "";
  if (ticket && String(ticket).trim().length > 0) {
    footer = `${footerAction}: ${String(ticket).trim()}`;
  }

  const parts = [header];
  if (finalBody) parts.push("", finalBody);
  if (footer) parts.push("", footer);

  return parts.join(os.EOL);
}

export const validatorMeta = {
  allowedTypes: ALLOWED_TYPES,
  maxSummaryLength: 72
};
