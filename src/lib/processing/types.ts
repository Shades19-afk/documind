export type ProcessingState = "uploading" | "processing" | "completed" | "failed";
export type GenerationState = "idle" | "generating" | "completed" | "quota_exceeded" | "retry_pending" | "generation_failed";

export interface ChunkMetadata {
  chunkIndex: number;
  tokenCount: number;
  startPage: number;
  endPage: number;
  summary: string;
}

export interface ExtractedChunk {
  id: string;
  documentId: string;
  content: string;
  metadata: ChunkMetadata;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StudySectionSummary {
  heading: string;
  summary: string;
}

export interface StudyPackageData {
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
  };
}

export interface DocumentRecord {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: ProcessingState;
  uploadedAt: string;
  updatedAt: string;
  attempts: number;
  errorMessage?: string;
  pageCount: number;
  extractedText?: string;
  chunks: ExtractedChunk[];
  fileBuffer?: Buffer;
  studyPackage?: StudyPackageData;
  generationStatus: GenerationState;
  generationErrorMessage?: string;
}

export interface UploadResponse {
  document: DocumentRecord;
  message: string;
}

export interface ProcessResponse {
  documentId: string;
  status: ProcessingState;
  attempts: number;
  message: string;
  errorMessage?: string;
}
