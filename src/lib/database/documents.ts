import fs from "fs";
import path from "path";
import { generateStudyPackageWithMetadata } from "@/lib/ai";
import type { StudyPackage } from "@/lib/ai/types";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { DatabaseDocument, DatabaseFlashcard, DatabaseStudyNote, DatabaseSummary } from "./types";
import type { GenerationStatus } from "./types";

export type DocumentStatus = DatabaseDocument["status"];

interface FallbackDocumentRecord {
  id: string;
  userId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: DocumentStatus;
  pageCount: number;
  extractedText: string | null;
  errorMessage: string | null;
  generationStatus: GenerationStatus;
  generationErrorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  attempts: number;
  studyPackage: StudyPackage | null;
}

const fallbackDocuments = new Map<string, FallbackDocumentRecord>();
const fallbackDocumentIdsByUser = new Map<string, Set<string>>();
const fallbackStorePath = path.join(process.cwd(), ".documind-fallback-documents.json");

function nowIso() {
  return new Date().toISOString();
}

function loadFallbackStore() {
  try {
    if (!fs.existsSync(fallbackStorePath)) {
      fallbackDocuments.clear();
      fallbackDocumentIdsByUser.clear();
      return;
    }

    const raw = fs.readFileSync(fallbackStorePath, "utf-8");
    const parsed = JSON.parse(raw) as {
      documents?: Record<string, FallbackDocumentRecord>;
      userIds?: Record<string, string[]>;
    };

    fallbackDocuments.clear();
    fallbackDocumentIdsByUser.clear();

    Object.entries(parsed.documents ?? {}).forEach(([id, document]) => {
      fallbackDocuments.set(id, document);
    });

    Object.entries(parsed.userIds ?? {}).forEach(([userId, ids]) => {
      fallbackDocumentIdsByUser.set(userId, new Set(ids));
    });
  } catch {
    fallbackDocuments.clear();
    fallbackDocumentIdsByUser.clear();
  }
}

function persistFallbackStore() {
  try {
    fs.mkdirSync(path.dirname(fallbackStorePath), { recursive: true });
    fs.writeFileSync(
      fallbackStorePath,
      JSON.stringify(
        {
          documents: Object.fromEntries(fallbackDocuments.entries()),
          userIds: Object.fromEntries(
            Array.from(fallbackDocumentIdsByUser.entries()).map(([userId, ids]) => [userId, Array.from(ids)])
          ),
        },
        null,
        2
      )
    );
  } catch {
    // Ignore persistence failures so upload processing can continue.
  }
}

function ensureText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function isMissingDocumentTableError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { code?: unknown; message?: unknown };
  const message = typeof maybeError.message === "string" ? maybeError.message : "";

  return (
    maybeError.code === "PGRST205" ||
    message.includes("Could not find the table 'public.documents'") ||
    message.includes("Could not find the table")
  );
}

function normalizeDocumentSummary(summary: DatabaseSummary | null): StudyPackage | null {
  if (!summary) {
    return null;
  }

  const metadata = summary.metadata
    ? {
        ...summary.metadata,
        failureState:
          summary.metadata.failureState === "completed" ||
          summary.metadata.failureState === "idle" ||
          summary.metadata.failureState === "generating"
            ? undefined
            : summary.metadata.failureState,
      }
    : undefined;

  return {
    summary: summary.summary,
    detailedSummary: summary.detailed_summary,
    overview: summary.overview,
    keyPoints: summary.key_points ?? [],
    keyTakeaways: summary.key_takeaways ?? [],
    sectionSummaries: summary.section_summaries ?? [],
    importantConcepts: summary.important_concepts ?? [],
    studyNotes: [],
    flashcards: [],
    importantTopics: summary.important_topics ?? [],
    generatedAt: summary.generated_at,
    metadata,
  };
}

function mapStudyPackage(studyPackage: StudyPackage, notes: DatabaseStudyNote[], cards: DatabaseFlashcard[]) {
  return {
    ...studyPackage,
    studyNotes: notes.map((note) => note.body),
    flashcards: cards.map((card) => ({ front: card.front, back: card.back })),
  } satisfies StudyPackage;
}

function createFallbackDocumentRecord(input: {
  userId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}): FallbackDocumentRecord {
  const now = nowIso();

  return {
    id: `fallback-${now}-${Math.random().toString(36).slice(2, 10)}`,
    userId: input.userId,
    filename: input.filename,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    status: "processing",
    pageCount: 0,
    extractedText: null,
    errorMessage: null,
    generationStatus: "idle",
    generationErrorMessage: null,
    createdAt: now,
    updatedAt: now,
    attempts: 0,
    studyPackage: null,
  };
}

function upsertFallbackDocument(record: FallbackDocumentRecord) {
  loadFallbackStore();
  fallbackDocuments.set(record.id, record);

  const currentIds = fallbackDocumentIdsByUser.get(record.userId) ?? new Set<string>();
  currentIds.add(record.id);
  fallbackDocumentIdsByUser.set(record.userId, currentIds);
  persistFallbackStore();
}

function getFallbackDocumentsForUser(userId: string) {
  loadFallbackStore();
  const ids = fallbackDocumentIdsByUser.get(userId) ?? new Set<string>();

  return [...ids]
    .map((id) => fallbackDocuments.get(id))
    .filter((document): document is FallbackDocumentRecord => Boolean(document))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

function getFallbackDocument(documentId: string) {
  loadFallbackStore();
  return fallbackDocuments.get(documentId) ?? null;
}

function buildProcessedDocument(document: FallbackDocumentRecord) {
  const summary = document.studyPackage?.summary ?? "Your document is being prepared for AI summaries, study notes, and flashcards.";
  const overview = document.studyPackage?.overview;
  const keyPoints = document.studyPackage?.keyPoints;

  return {
    id: document.id,
    filename: document.filename,
    mimeType: document.mimeType,
    sizeBytes: document.sizeBytes,
    status: document.status,
    pageCount: document.pageCount,
    extractedText: ensureText(document.extractedText) ?? undefined,
    chunks: [],
    errorMessage: document.errorMessage ?? undefined,
    uploadedAt: document.createdAt,
    updatedAt: document.updatedAt,
    summary,
    overview,
    keyPoints,
    studyPackage: document.studyPackage ?? undefined,
    generationStatus: document.generationStatus,
    generationErrorMessage: document.generationErrorMessage ?? undefined,
  };
}

async function getDocumentRelations(documentIds: string[]) {
  const supabase = createSupabaseServiceRoleClient();

  try {
    const [summaryResponse, noteResponse, flashcardResponse] = await Promise.all([
      supabase.from("summaries").select("*").in("document_id", documentIds),
      supabase.from("study_notes").select("*").in("document_id", documentIds).order("order_index", { ascending: true }),
      supabase.from("flashcards").select("*").in("document_id", documentIds).order("order_index", { ascending: true }),
    ]);

    if (summaryResponse.error) {
      throw summaryResponse.error;
    }

    if (noteResponse.error) {
      throw noteResponse.error;
    }

    if (flashcardResponse.error) {
      throw flashcardResponse.error;
    }

    return {
      summaries: summaryResponse.data as DatabaseSummary[],
      notes: noteResponse.data as DatabaseStudyNote[],
      flashcards: flashcardResponse.data as DatabaseFlashcard[],
    };
  } catch (error) {
    if (!isMissingDocumentTableError(error)) {
      throw error;
    }

    return {
      summaries: [],
      notes: [],
      flashcards: [],
    };
  }
}

export async function createPersistedDocument(input: {
  userId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}) {
  const supabase = createSupabaseServiceRoleClient();

  try {
    const response = await supabase
      .from("documents")
      .insert({
        user_id: input.userId,
        filename: input.filename,
        mime_type: input.mimeType,
        size_bytes: input.sizeBytes,
        status: "processing",
        page_count: 0,
        extracted_text: null,
        error_message: null,
        generation_status: "idle",
        generation_error_message: null,
      })
      .select()
      .single();

    if (response.error || !response.data) {
      throw response.error ?? new Error("Failed to create document record.");
    }

    await supabase.from("processing_states").insert({
      document_id: response.data.id,
      status: "processing",
      message: "Upload accepted.",
      attempts: 0,
      updated_at: nowIso(),
    });

    return response.data as DatabaseDocument;
  } catch (error) {
    if (!isMissingDocumentTableError(error)) {
      throw error;
    }

    const record = createFallbackDocumentRecord(input);
    upsertFallbackDocument(record);
    return {
      id: record.id,
      user_id: record.userId,
      filename: record.filename,
      mime_type: record.mimeType,
      size_bytes: record.sizeBytes,
      status: record.status,
      page_count: record.pageCount,
      extracted_text: record.extractedText,
      error_message: record.errorMessage,
      generation_status: record.generationStatus,
      generation_error_message: record.generationErrorMessage,
      created_at: record.createdAt,
      updated_at: record.updatedAt,
    } satisfies DatabaseDocument;
  }
}

export async function updateDocumentState(documentId: string, status: DocumentStatus, message: string | null, attempts: number) {
  const supabase = createSupabaseServiceRoleClient();

  try {
    const documentResponse = await supabase
      .from("documents")
      .update({
        status,
        error_message: message,
        updated_at: nowIso(),
      })
      .eq("id", documentId);

    if (documentResponse.error) {
      throw documentResponse.error;
    }

    const processingResponse = await supabase.from("processing_states").insert({
      document_id: documentId,
      status,
      message,
      attempts,
      updated_at: nowIso(),
    });

    if (processingResponse.error) {
      throw processingResponse.error;
    }

    return;
  } catch (error) {
    if (!isMissingDocumentTableError(error)) {
      throw error;
    }

    const record = getFallbackDocument(documentId);

    if (!record) {
      throw new Error("Document not found.");
    }

    record.status = status;
    record.errorMessage = message;
    record.attempts = attempts;
    record.updatedAt = nowIso();
    upsertFallbackDocument(record);
  }
}

export async function persistStudyPackage(documentId: string, studyPackage: StudyPackage) {
  const supabase = createSupabaseServiceRoleClient();

  try {
    const summaryResponse = await supabase.from("summaries").upsert(
      {
        document_id: documentId,
        summary: studyPackage.summary,
        detailed_summary: studyPackage.detailedSummary,
        overview: studyPackage.overview,
        key_points: studyPackage.keyPoints,
        key_takeaways: studyPackage.keyTakeaways,
        section_summaries: studyPackage.sectionSummaries,
        important_concepts: studyPackage.importantConcepts,
        important_topics: studyPackage.importantTopics,
        generated_at: studyPackage.generatedAt,
        metadata: studyPackage.metadata,
      },
      { onConflict: "document_id" }
    );

    if (summaryResponse.error) {
      throw summaryResponse.error;
    }

    const noteDeleteResponse = await supabase.from("study_notes").delete().eq("document_id", documentId);

    if (noteDeleteResponse.error) {
      throw noteDeleteResponse.error;
    }

    if (studyPackage.studyNotes.length > 0) {
      const noteInsertResponse = await supabase.from("study_notes").insert(
        studyPackage.studyNotes.map((note, index) => ({
          document_id: documentId,
          title: `Note ${index + 1}`,
          body: note,
          order_index: index,
        }))
      );

      if (noteInsertResponse.error) {
        throw noteInsertResponse.error;
      }
    }

    const flashcardDeleteResponse = await supabase.from("flashcards").delete().eq("document_id", documentId);

    if (flashcardDeleteResponse.error) {
      throw flashcardDeleteResponse.error;
    }

    if (studyPackage.flashcards.length > 0) {
      const flashcardInsertResponse = await supabase.from("flashcards").insert(
        studyPackage.flashcards.map((card, index) => ({
          document_id: documentId,
          front: card.front,
          back: card.back,
          order_index: index,
        }))
      );

      if (flashcardInsertResponse.error) {
        throw flashcardInsertResponse.error;
      }
    }

    return;
  } catch (error) {
    if (!isMissingDocumentTableError(error)) {
      throw error;
    }

    const record = getFallbackDocument(documentId);

    if (!record) {
      throw new Error("Document not found.");
    }

    record.studyPackage = studyPackage;
    record.updatedAt = nowIso();
    upsertFallbackDocument(record);
  }
}

export async function processDocumentText(documentId: string, extractedText: string, pageCount: number) {
  const supabase = createSupabaseServiceRoleClient();
  const generationStartedAt = nowIso();

  console.log("[DocuMind generation] started", {
    documentId,
    pageCount,
    textLength: extractedText.length,
    startedAt: generationStartedAt,
  });

  try {
    const documentResponse = await supabase
      .from("documents")
      .update({
        extracted_text: extractedText,
        page_count: pageCount,
        status: "processing",
        generation_status: "generating",
        generation_error_message: null,
        updated_at: generationStartedAt,
      })
      .eq("id", documentId);

    if (documentResponse.error) {
      throw documentResponse.error;
    }

    console.log("[DocuMind generation] extraction completed", {
      documentId,
      pageCount,
      textLength: extractedText.length,
    });

    const { studyPackage, errorMessage, failureState, source } = await generateStudyPackageWithMetadata(extractedText);

    console.log("[DocuMind generation] generation completed", {
      documentId,
      source,
      failureState,
    });

    await persistStudyPackage(documentId, studyPackage);

    const isTerminalFailure = Boolean(failureState);
    const finalStatus: DocumentStatus = isTerminalFailure ? "failed" : "completed";
    const finalGenerationStatus: GenerationStatus = failureState ?? "completed";
    const finalMessage = isTerminalFailure ? errorMessage ?? "Generation failed, please retry." : "Study package ready.";

    const completedResponse = await supabase
      .from("documents")
      .update({
        status: finalStatus,
        error_message: isTerminalFailure ? finalMessage : null,
        generation_status: finalGenerationStatus,
        generation_error_message: isTerminalFailure ? errorMessage ?? null : null,
        updated_at: nowIso(),
      })
      .eq("id", documentId);

    if (completedResponse.error) {
      throw completedResponse.error;
    }

    const processingStateResponse = await supabase.from("processing_states").insert({
      document_id: documentId,
      status: finalStatus,
      message: finalMessage,
      attempts: 1,
      updated_at: nowIso(),
    });

    if (processingStateResponse.error) {
      throw processingStateResponse.error;
    }

    if (isTerminalFailure) {
      console.error("[DocuMind generation] failed", {
        documentId,
        source,
        failureState: finalGenerationStatus,
        errorMessage,
      });
    }

    console.log("[DocuMind document] finalized", {
      documentId,
      status: finalStatus,
      generationStatus: finalGenerationStatus,
      source,
      finalizedAt: nowIso(),
    });

    return {
      studyPackage,
      errorMessage,
      failureState,
    };
  } catch (error) {
    if (!isMissingDocumentTableError(error)) {
      const message = error instanceof Error ? error.message : "Processing failed.";

      console.error("[DocuMind generation] error in database flow", {
        documentId,
        message,
      });

      // Attempt to update to failed state
      try {
        const failedDocumentResponse = await supabase
          .from("documents")
          .update({
            status: "failed",
            error_message: message,
            generation_status: "generation_failed",
            generation_error_message: message,
            updated_at: nowIso(),
          })
          .eq("id", documentId);

        if (!failedDocumentResponse.error) {
          await supabase.from("processing_states").insert({
            document_id: documentId,
            status: "failed",
            message,
            attempts: 1,
            updated_at: nowIso(),
          });

          console.log("[DocuMind document] finalized via error handler", {
            documentId,
            status: "failed",
            generationStatus: "generation_failed",
            finalizedAt: nowIso(),
          });
        }
      } catch {
        // Ignore secondary errors
      }

      throw error;
    }

    const record = getFallbackDocument(documentId);

    if (!record) {
      throw new Error("Document not found.");
    }

    record.extractedText = extractedText;
    record.pageCount = pageCount;
    record.status = "processing";
    record.errorMessage = null;
    record.generationStatus = "generating";
    record.generationErrorMessage = null;
    record.updatedAt = generationStartedAt;
    upsertFallbackDocument(record);

    console.log("[DocuMind generation] extraction completed (fallback)", {
      documentId,
      pageCount,
      textLength: extractedText.length,
    });

    const { studyPackage, errorMessage, failureState, source } = await generateStudyPackageWithMetadata(extractedText);

    console.log("[DocuMind generation] generation completed (fallback)", {
      documentId,
      source,
      failureState,
    });

    const isTerminalFailure = Boolean(failureState);
    const finalStatus: DocumentStatus = isTerminalFailure ? "failed" : "completed";
    const finalGenerationStatus: GenerationStatus = failureState ?? "completed";
    const finalMessage = isTerminalFailure ? errorMessage ?? "Generation failed, please retry." : "Study package ready.";

    record.studyPackage = studyPackage;
    record.extractedText = extractedText;
    record.pageCount = pageCount;
    record.status = finalStatus;
    record.generationStatus = finalGenerationStatus;
    record.generationErrorMessage = isTerminalFailure ? errorMessage ?? null : null;
    record.errorMessage = isTerminalFailure ? finalMessage : null;
    record.updatedAt = nowIso();
    record.attempts += 1;
    upsertFallbackDocument(record);

    if (isTerminalFailure) {
      console.error("[DocuMind generation] failed", {
        documentId,
        source,
        failureState: finalGenerationStatus,
        errorMessage,
      });
    }

    console.log("[DocuMind document] finalized (fallback)", {
      documentId,
      status: finalStatus,
      generationStatus: finalGenerationStatus,
      source,
      finalizedAt: nowIso(),
    });

    return {
      studyPackage,
      errorMessage,
      failureState,
    };
  }
}

export async function getDocumentsForUser(userId: string) {
  const supabase = createSupabaseServiceRoleClient();

  try {
    const documentsResponse = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (documentsResponse.error) {
      throw documentsResponse.error;
    }

    const documents = (documentsResponse.data as DatabaseDocument[] | null) ?? [];
    const fallbackDocuments = getFallbackDocumentsForUser(userId);
    const mergedFallbackDocuments = fallbackDocuments.filter((document) => !documents.some((item) => item.id === document.id));

    if (documents.length === 0) {
      return mergedFallbackDocuments.map(buildProcessedDocument);
    }

    const { summaries, notes, flashcards } = await getDocumentRelations(documents.map((document) => document.id));

    const databaseDocuments = documents.map((document) => {
      const summary = summaries.find((item) => item.document_id === document.id) ?? null;
      const studyPackage = normalizeDocumentSummary(summary);
      const documentNotes = notes.filter((item) => item.document_id === document.id);
      const documentCards = flashcards.filter((item) => item.document_id === document.id);

      return {
        id: document.id,
        filename: document.filename,
        mimeType: document.mime_type,
        sizeBytes: document.size_bytes,
        status: document.status,
        pageCount: document.page_count,
        extractedText: ensureText(document.extracted_text) ?? undefined,
        chunks: [],
        errorMessage: document.error_message ?? undefined,
        uploadedAt: document.created_at,
        updatedAt: document.updated_at,
        summary: studyPackage?.summary ?? "Your document is being prepared for AI summaries, study notes, and flashcards.",
        overview: studyPackage?.overview,
        keyPoints: studyPackage?.keyPoints,
        studyPackage: studyPackage ? mapStudyPackage(studyPackage, documentNotes, documentCards) : undefined,
        generationStatus: document.generation_status ?? (studyPackage ? "completed" : "idle"),
        generationErrorMessage: document.generation_error_message ?? undefined,
      };
    });

    const combinedDocuments = [...databaseDocuments, ...mergedFallbackDocuments.map(buildProcessedDocument)];

    return combinedDocuments.sort((left, right) => right.uploadedAt.localeCompare(left.uploadedAt));
  } catch (error) {
    if (!isMissingDocumentTableError(error)) {
      throw error;
    }

    return getFallbackDocumentsForUser(userId).map(buildProcessedDocument);
  }
}

export async function getDocumentForUser(userId: string, documentId: string) {
  const documents = await getDocumentsForUser(userId);
  return documents.find((document) => document.id === documentId) ?? null;
}

export async function getDocumentStatusForUser(userId: string, documentId: string) {
  const supabase = createSupabaseServiceRoleClient();

  try {
    const documentResponse = await supabase
      .from("documents")
      .select("id, status, error_message, page_count, updated_at")
      .eq("user_id", userId)
      .eq("id", documentId)
      .single();

    if (documentResponse.error) {
      throw documentResponse.error;
    }

    if (!documentResponse.data) {
      return null;
    }

    const attemptsResponse = await supabase
      .from("processing_states")
      .select("attempts")
      .eq("document_id", documentId)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (attemptsResponse.error) {
      throw attemptsResponse.error;
    }

    return {
      documentId: documentResponse.data.id,
      status: documentResponse.data.status,
      attempts: attemptsResponse.data?.[0]?.attempts ?? 0,
      errorMessage: documentResponse.data.error_message ?? undefined,
      pageCount: documentResponse.data.page_count,
      chunkCount: 0,
      updatedAt: documentResponse.data.updated_at,
    };
  } catch (error) {
    if (!isMissingDocumentTableError(error)) {
      throw error;
    }

    const record = getFallbackDocument(documentId);

    if (!record || record.userId !== userId) {
      return null;
    }

    return {
      documentId: record.id,
      status: record.status,
      attempts: record.attempts,
      errorMessage: record.errorMessage ?? undefined,
      pageCount: record.pageCount,
      chunkCount: 0,
      updatedAt: record.updatedAt,
    };
  }
}

export async function retryDocumentForUser(userId: string, documentId: string) {
  const supabase = createSupabaseServiceRoleClient();

  console.log("[DocuMind retry] starting retry for document", {
    documentId,
    userId,
  });

  try {
    const documentResponse = await supabase
      .from("documents")
      .select("extracted_text, page_count, status, generation_status")
      .eq("user_id", userId)
      .eq("id", documentId)
      .single();

    if (documentResponse.error || !documentResponse.data) {
      throw documentResponse.error ?? new Error("Document not found.");
    }

    if (!documentResponse.data.extracted_text) {
      throw new Error("Document is not available for retry - extracted text not found.");
    }

    console.log("[DocuMind retry] document found, resetting status", {
      documentId,
      currentStatus: documentResponse.data.status,
      currentGenerationStatus: documentResponse.data.generation_status,
    });

    await updateDocumentState(documentId, "processing", null, 1);
    
    console.log("[DocuMind retry] restarting generation process", {
      documentId,
      pageCount: documentResponse.data.page_count,
      textLength: documentResponse.data.extracted_text.length,
    });

    await processDocumentText(documentId, documentResponse.data.extracted_text, documentResponse.data.page_count ?? 0);

    const status = await getDocumentStatusForUser(userId, documentId);
    
    console.log("[DocuMind retry] retry completed", {
      documentId,
      finalStatus: status.status,
      finalGenerationStatus: status.errorMessage,
    });

    return status;
  } catch (error) {
    if (!isMissingDocumentTableError(error)) {
      const message = error instanceof Error ? error.message : "Retry failed";
      console.error("[DocuMind retry] retry failed (database error)", {
        documentId,
        message,
      });
      throw error;
    }

    const record = getFallbackDocument(documentId);

    if (!record || record.userId !== userId) {
      throw new Error("Document not found.");
    }

    if (!record.extractedText) {
      throw new Error("Document is not available for retry - extracted text not found.");
    }

    console.log("[DocuMind retry] using fallback store for retry", {
      documentId,
      currentStatus: record.status,
      currentGenerationStatus: record.generationStatus,
    });

    record.status = "processing";
    record.errorMessage = null;
    record.generationStatus = "generating";
    record.generationErrorMessage = null;
    record.updatedAt = nowIso();
    record.attempts += 1;
    upsertFallbackDocument(record);

    console.log("[DocuMind retry] restarting generation process (fallback)", {
      documentId,
      pageCount: record.pageCount,
      textLength: record.extractedText.length,
      attempts: record.attempts,
    });

    await processDocumentText(documentId, record.extractedText, record.pageCount);

    const status = await getDocumentStatusForUser(userId, documentId);
    
    console.log("[DocuMind retry] retry completed (fallback)", {
      documentId,
      finalStatus: status.status,
    });

    return status;
  }
}
