import { getFriendlyGenerationMessage } from "./ai/errors";

export type ProcessingStatus = "uploading" | "processing" | "completed" | "failed";
export type GenerationStatus = "idle" | "generating" | "completed" | "quota_exceeded" | "retry_pending" | "generation_failed";

export interface ExtractedChunk {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StudySectionSummary {
  heading: string;
  summary: string;
}

export interface StudyPackage {
  summary: string;
  detailedSummary: string;
  overview: string;
  keyPoints: string[];
  keyTakeaways: string[];
  sectionSummaries: StudySectionSummary[];
  importantConcepts: string[];
  studyNotes: string[];
  flashcards: Flashcard[];
  importantTopics: string[];
  generatedAt: string;
  metadata?: {
    source: "gemini" | "fallback";
    errorMessage?: string;
    failureState?: GenerationStatus;
  };
}

export interface ProcessedDocument {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: ProcessingStatus;
  pageCount: number;
  extractedText?: string;
  chunks: ExtractedChunk[];
  errorMessage?: string;
  uploadedAt: string;
  updatedAt: string;
  summary: string;
  overview?: string;
  keyPoints?: string[];
  studyPackage?: StudyPackage;
  generationStatus?: GenerationStatus;
  generationErrorMessage?: string;
}

export interface SummaryPayload {
  summary: string;
  detailedSummary: string;
  overview: string;
  keyPoints: string[];
  keyTakeaways: string[];
  importantConcepts: string[];
}

export interface UploadResponse {
  message: string;
  document: Pick<
    ProcessedDocument,
    "id" | "filename" | "mimeType" | "sizeBytes" | "status" | "pageCount" | "uploadedAt" | "updatedAt"
  >;
}

export interface StatusResponse {
  documentId: string;
  status: ProcessingStatus;
  attempts: number;
  errorMessage?: string;
  pageCount: number;
  chunkCount: number;
  updatedAt: string;
}

export interface UserDocumentsResponse {
  documents: ProcessedDocument[];
}

function buildSummary(text?: string) {
  if (!text) {
    return "Your document is being prepared for AI summaries, study notes, and flashcards.";
  }

  const cleanText = text.replace(/\s+/g, " ").trim();

  if (cleanText.length <= 180) {
    return cleanText;
  }

  return `${cleanText.slice(0, 177).trim()}...`;
}

function getFallbackStudyPackage(document: ProcessedDocument): StudyPackage {
  const summary = document.summary || buildSummary(document.extractedText);
  const overview = document.overview || summary;

  return {
    summary,
    detailedSummary: summary,
    overview,
    keyPoints: document.keyPoints ?? [],
    keyTakeaways: document.keyPoints ?? [],
    sectionSummaries: [],
    importantConcepts: document.keyPoints ?? [],
    studyNotes: [],
    flashcards: [],
    importantTopics: document.keyPoints ?? [],
    generatedAt: new Date().toISOString(),
    metadata: {
      source: "fallback",
      failureState: document.generationStatus === "quota_exceeded" ? "quota_exceeded" : document.generationStatus === "retry_pending" ? "retry_pending" : "generation_failed",
      errorMessage: document.generationErrorMessage ? getFriendlyGenerationMessage(document.generationErrorMessage) : undefined,
    },
  };
}

function normalizeApiError(response: Response, message?: string) {
  const normalized = getFriendlyGenerationMessage(message);

  if (response.status === 429) {
    return "Quota exhausted, retry later";
  }

  if (response.status === 503) {
    return "AI generation temporarily unavailable";
  }

  if (response.status >= 500) {
    return "Generation failed, please retry";
  }

  return normalized || "Generation failed, please retry";
}

async function parseError(response: Response) {
  const body = await response.json().catch(() => null);
  const message = body?.error || body?.message;
  throw new Error(normalizeApiError(response, message));
}

export async function uploadPdf(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    await parseError(response);
  }

  const data = (await response.json()) as UploadResponse;
  return data.document;
}

export async function getDocumentStatus(documentId: string) {
  const response = await fetch(`/api/documents/${documentId}/status`);

  if (!response.ok) {
    await parseError(response);
  }

  return (await response.json()) as StatusResponse;
}

export async function getUserDocuments() {
  const response = await fetch("/api/documents");

  if (!response.ok) {
    await parseError(response);
  }

  const data = (await response.json()) as UserDocumentsResponse;
  return data.documents;
}

export async function getDocumentDetails(documentId: string): Promise<ProcessedDocument> {
  const response = await fetch(`/api/documents/${documentId}`);

  if (!response.ok) {
    await parseError(response);
  }

  const data = (await response.json()) as {
    document: ProcessedDocument;
  };

  const document = data.document;

  if (!document.summary && document.extractedText) {
    document.summary = buildSummary(document.extractedText);
  }

  if (!document.summary) {
    document.summary = "Your document is being prepared for AI summaries, study notes, and flashcards.";
  }

  if (document.studyPackage) {
    document.summary = document.studyPackage.summary || document.summary;
    document.overview = document.studyPackage.overview || document.overview;
    document.keyPoints = document.studyPackage.keyPoints.length > 0 ? document.studyPackage.keyPoints : document.keyPoints;
  } else {
    document.studyPackage = getFallbackStudyPackage(document);
  }

  const failureState = document.studyPackage.metadata?.failureState;
  document.generationStatus = document.generationStatus ?? (failureState ?? (document.studyPackage ? "completed" : "idle"));

  if (!document.generationErrorMessage && document.studyPackage.metadata?.errorMessage) {
    document.generationErrorMessage = getFriendlyGenerationMessage(document.studyPackage.metadata.errorMessage);
  }

  return document;
}

export async function retryProcessing(documentId: string) {
  const response = await fetch("/api/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentId }),
  });

  if (!response.ok) {
    await parseError(response);
  }

  return (await response.json()) as StatusResponse;
}

export async function generateDocumentSummary(documentText: string): Promise<SummaryPayload> {
  const response = await fetch("/api/ai/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentText }),
  });

  if (!response.ok) {
    await parseError(response);
  }

  return (await response.json()) as SummaryPayload;
}

export async function generateStudyPackage(documentText: string): Promise<StudyPackage> {
  const response = await fetch("/api/ai/study", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentText }),
  });

  if (!response.ok) {
    await parseError(response);
  }

  return (await response.json()) as StudyPackage;
}

export function buildStudyPackageText(document: ProcessedDocument) {
  const studyPackage = document.studyPackage ?? getFallbackStudyPackage(document);

  return [
    `# ${document.filename}`,
    "",
    "## Overview",
    studyPackage.overview,
    "",
    "## Summary",
    studyPackage.summary,
    "",
    "## Detailed summary",
    studyPackage.detailedSummary,
    "",
    "## Key takeaways",
    ...studyPackage.keyTakeaways.map((item) => `- ${item}`),
    "",
    "## Important concepts",
    ...studyPackage.importantConcepts.map((item) => `- ${item}`),
    "",
    "## Key points",
    ...studyPackage.keyPoints.map((item) => `- ${item}`),
    "",
    "## Study notes",
    ...studyPackage.studyNotes.map((note) => `- ${note}`),
    "",
    "## Important topics",
    ...studyPackage.importantTopics.map((topic) => `- ${topic}`),
    "",
    "## Flashcards",
    ...studyPackage.flashcards.map((card, index) => [`${index + 1}. ${card.front}`, `   ${card.back}`]).flat(),
  ].join("\n");
}

export function buildPdfReadyContent(document: ProcessedDocument) {
  return buildStudyPackageText(document);
}

export function buildStudyPackageMarkdown(document: ProcessedDocument) {
  const studyPackage = document.studyPackage ?? getFallbackStudyPackage(document);

  const sectionSummaries = studyPackage.sectionSummaries.length > 0
    ? studyPackage.sectionSummaries
        .map((section) => `### ${section.heading}\n${section.summary}`)
        .join("\n\n")
    : "No section summaries were generated for this document.";

  const flashcards = studyPackage.flashcards.length > 0
    ? studyPackage.flashcards
        .map((card, index) => `### Flashcard ${index + 1}\n- **Front:** ${card.front}\n- **Back:** ${card.back}`)
        .join("\n\n")
    : "No flashcards were generated for this document.";

  return `# ${document.filename}\n\n## Overview\n${studyPackage.overview}\n\n## Summary\n${studyPackage.summary}\n\n## Detailed summary\n${studyPackage.detailedSummary}\n\n## Key takeaways\n${studyPackage.keyTakeaways.map((item) => `- ${item}`).join("\n")}\n\n## Important concepts\n${studyPackage.importantConcepts.map((item) => `- ${item}`).join("\n")}\n\n## Key points\n${studyPackage.keyPoints.map((point) => `- ${point}`).join("\n")}\n\n## Study notes\n${studyPackage.studyNotes.map((note) => `- ${note}`).join("\n")}\n\n## Important topics\n${studyPackage.importantTopics.map((topic) => `- ${topic}`).join("\n")}\n\n## Section summaries\n${sectionSummaries}\n\n## Flashcards\n${flashcards}`;
}

export function exportStudyPackage(document: ProcessedDocument, format: "markdown" | "text" | "json" | "pdf" = "markdown") {
  const content = format === "json"
    ? JSON.stringify(document.studyPackage ?? getFallbackStudyPackage(document), null, 2)
    : format === "text"
      ? buildStudyPackageText(document)
      : buildStudyPackageMarkdown(document);

  const extension = format === "json" ? "json" : format === "text" ? "txt" : "md";
  const mimeType = format === "json" ? "application/json" : "text/plain";

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = globalThis.document.createElement("a");
  anchor.href = url;
  anchor.download = `${document.filename.replace(/\.[^.]+$/, "")}-${format === "json" ? "study-package" : "study-notes"}.${extension}`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function buildSummaryFromText(text?: string) {
  return buildSummary(text);
}
