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
    failureState?: "quota_exceeded" | "retry_pending" | "generation_failed";
  };
}

export interface SummaryPayload {
  summary: string;
  detailedSummary: string;
  overview: string;
  keyPoints: string[];
  keyTakeaways: string[];
  importantConcepts: string[];
}

export interface StudyPackageRequestBody {
  documentText: string;
}
