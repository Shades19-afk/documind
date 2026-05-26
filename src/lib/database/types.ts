export type DocumentStatus = "uploading" | "processing" | "completed" | "failed";
export type GenerationStatus =
  | "idle"
  | "generating"
  | "completed"
  | "quota_exceeded"
  | "retry_pending"
  | "generation_failed";

export interface DatabaseUser {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseDocument {
  id: string;
  user_id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  status: DocumentStatus;
  page_count: number;
  extracted_text: string | null;
  error_message: string | null;
  generation_status: GenerationStatus | null;
  generation_error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSummary {
  id: string;
  document_id: string;
  summary: string;
  detailed_summary: string;
  overview: string;
  key_points: string[];
  key_takeaways: string[];
  section_summaries: Array<{ heading: string; summary: string }>;
  important_concepts: string[];
  important_topics: string[];
  generated_at: string;
  metadata: {
    source: "gemini" | "fallback";
    errorMessage?: string;
    failureState?: GenerationStatus;
  } | null;
}

export interface DatabaseStudyNote {
  id: string;
  document_id: string;
  title: string;
  body: string;
  order_index: number;
  created_at: string;
}

export interface DatabaseFlashcard {
  id: string;
  document_id: string;
  front: string;
  back: string;
  order_index: number;
  created_at: string;
}

export interface DatabaseProcessingState {
  id: string;
  document_id: string;
  status: DocumentStatus;
  message: string | null;
  attempts: number;
  updated_at: string;
}
