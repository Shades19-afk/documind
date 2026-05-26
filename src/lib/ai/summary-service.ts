import { generateText, clampText } from "./gemini";
import { classifyAiError, getFriendlyGenerationMessage, type GenerationFailureStatus } from "./errors";
import { Flashcard, StudyPackage, StudySectionSummary, SummaryPayload } from "./types";

const MAX_LENGTH = 14000;

function normalizeText(text: string) {
  return text.replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
}

function normalizeStringArray(values: unknown): string[] {
  return Array.isArray(values)
    ? values.filter((value): value is string => typeof value === "string" && value.trim().length > 0).map((value) => value.trim())
    : [];
}

function normalizeSectionSummaries(values: unknown): StudySectionSummary[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .filter((value): value is { heading: string; summary: string } => {
      return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as { heading?: unknown }).heading === "string" &&
        typeof (value as { summary?: unknown }).summary === "string"
      );
    })
    .map((value) => ({
      heading: value.heading.trim(),
      summary: value.summary.trim(),
    }))
    .slice(0, 5);
}

function buildFallbackStudyPackage(
  text: string,
  options?: {
    failureState?: GenerationFailureStatus;
    userMessage?: string;
  }
): StudyPackage {
  const normalized = normalizeText(text);
  const firstSentences = normalized
    .split(/\.|\?|!/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
  const overview = normalized.slice(0, 280) || "Document overview is being prepared.";
  const summary = normalized.slice(0, 500) || "Document summary is unavailable right now.";
  const keyTakeaways = firstSentences.length > 0 ? firstSentences : ["Key insights are being generated."];
  const failureState = options?.failureState ?? "generation_failed";
  const errorMessage = getFriendlyGenerationMessage(options?.userMessage);

  return {
    summary,
    detailedSummary: normalized.length > 0 ? `${summary} ${normalized.slice(500, 1200)}`.trim() : "Detailed summary is being prepared.",
    overview,
    keyPoints: firstSentences.length > 0 ? firstSentences : ["Key insights are being generated."],
    keyTakeaways,
    sectionSummaries: [
      {
        heading: "Overview",
        summary: overview,
      },
      {
        heading: "Core ideas",
        summary: keyTakeaways[0] || "Core ideas are being prepared.",
      },
    ],
    importantConcepts: keyTakeaways,
    studyNotes: [
      "Start with the concise summary to capture the main idea.",
      "Use the key points to reinforce the most important takeaways.",
      "Review the flashcards and important concepts before the next study session.",
    ],
    flashcards: [
      {
        front: "What is the main purpose of this document?",
        back: overview,
      },
    ],
    importantTopics: firstSentences.length > 0 ? firstSentences : ["General topic review"],
    generatedAt: new Date().toISOString(),
    metadata: {
      source: "fallback",
      failureState,
      errorMessage,
    },
  };
}

function parseStructuredResponse(text: string): StudyPackage | null {
  const cleaned = text.trim();

  try {
    const parsed = JSON.parse(cleaned);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const flashcards = Array.isArray(parsed.flashcards)
      ? parsed.flashcards
          .filter((item: unknown): item is Flashcard => {
            return (
              typeof item === "object" &&
              item !== null &&
              typeof (item as Flashcard).front === "string" &&
              typeof (item as Flashcard).back === "string"
            );
          })
          .slice(0, 8)
      : [];

    const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : "";
    const detailedSummary = typeof parsed.detailedSummary === "string" ? parsed.detailedSummary.trim() : summary;
    const overview = typeof parsed.overview === "string" ? parsed.overview.trim() : summary;

    if (!summary || !overview) {
      return null;
    }

    return {
      summary,
      detailedSummary,
      overview,
      keyPoints: normalizeStringArray(parsed.keyPoints).slice(0, 6),
      keyTakeaways: normalizeStringArray(parsed.keyTakeaways).slice(0, 6),
      sectionSummaries: normalizeSectionSummaries(parsed.sectionSummaries),
      importantConcepts: normalizeStringArray(parsed.importantConcepts).slice(0, 6),
      studyNotes: normalizeStringArray(parsed.studyNotes).slice(0, 6),
      flashcards,
      importantTopics: normalizeStringArray(parsed.importantTopics).slice(0, 6),
      generatedAt: typeof parsed.generatedAt === "string" ? parsed.generatedAt : new Date().toISOString(),
      metadata: {
        source: "gemini",
      },
    };
  } catch {
    return null;
  }
}

export async function generateStudyPackageWithMetadata(
  text: string
): Promise<{
  studyPackage: StudyPackage;
  source: "gemini" | "fallback";
  errorMessage?: string;
  failureState?: GenerationFailureStatus;
}> {
  const safeText = clampText(normalizeText(text), MAX_LENGTH);

  if (!safeText) {
    return {
      studyPackage: buildFallbackStudyPackage("Document summary is unavailable right now."),
      source: "fallback",
      failureState: "generation_failed",
    };
  }

  const prompt = `You are DocuMind's study assistant. Return JSON only. Create a production-ready study package using these exact fields: summary, detailedSummary, overview, keyPoints, keyTakeaways, sectionSummaries, importantConcepts, studyNotes, flashcards, importantTopics, generatedAt.

Rules:
- summary: 3 to 5 sentences, concise and clear.
- detailedSummary: 2 short paragraphs or 6 to 8 sentences.
- overview: one short paragraph, max 90 words.
- keyPoints: 4 to 6 short strings.
- keyTakeaways: 4 to 6 short strings.
- sectionSummaries: 3 to 5 objects with heading and summary.
- importantConcepts: 4 to 6 short strings.
- studyNotes: 4 to 6 concise note bullets.
- flashcards: 4 to 6 objects with front and back fields.
- importantTopics: 4 to 6 short topic labels.
- generatedAt: ISO timestamp.
- Do not include markdown fences, commentary, or extra text.

Document:
${safeText}`;

  try {
    const response = await generateText(prompt);
    const parsed = parseStructuredResponse(response);

    if (parsed) {
      return {
        studyPackage: parsed,
        source: "gemini",
      };
    }

    const failure = classifyAiError("Gemini returned an invalid payload.");

    return {
      studyPackage: buildFallbackStudyPackage(safeText, {
        failureState: failure.status,
        userMessage: failure.userMessage,
      }),
      source: "fallback",
      errorMessage: failure.userMessage,
      failureState: failure.status,
    };
  } catch (error) {
    const failure = classifyAiError(error);

    return {
      studyPackage: buildFallbackStudyPackage(safeText, {
        failureState: failure.status,
        userMessage: failure.userMessage,
      }),
      source: "fallback",
      errorMessage: failure.userMessage,
      failureState: failure.status,
    };
  }
}

export async function generateStudyPackage(text: string): Promise<StudyPackage> {
  const { studyPackage } = await generateStudyPackageWithMetadata(text);
  return studyPackage;
}

export async function generateDocumentSummary(text: string): Promise<SummaryPayload> {
  const studyPackage = await generateStudyPackage(text);

  return {
    summary: studyPackage.summary,
    detailedSummary: studyPackage.detailedSummary,
    overview: studyPackage.overview,
    keyPoints: studyPackage.keyPoints,
    keyTakeaways: studyPackage.keyTakeaways,
    importantConcepts: studyPackage.importantConcepts,
  };
}
