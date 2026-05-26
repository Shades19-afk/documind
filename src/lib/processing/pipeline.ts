import { generateStudyPackageWithMetadata } from "@/lib/ai";
import { getFriendlyGenerationMessage } from "@/lib/ai/errors";
import { ProcessingError } from "./errors";
import { createChunksForDocument } from "./chunking";
import { extractTextFromPdf } from "./pdf";
import {
  getDocumentRecord,
  incrementAttempts,
  markDocumentFailed,
  setChunks,
  updateDocumentRecord,
} from "./store";

const MAX_ATTEMPTS = 3;

function sanitizeProcessingError(message: string) {
  const friendly = getFriendlyGenerationMessage(message);
  return friendly === message ? "Processing failed, please retry" : friendly;
}

export async function processDocument(documentId: string): Promise<void> {
  const current = getDocumentRecord(documentId);

  if (!current) {
    throw new ProcessingError(`Document ${documentId} was not found.`, "DOCUMENT_NOT_FOUND");
  }

  if (!current.fileBuffer) {
    throw new ProcessingError(`Document ${documentId} does not contain a readable file buffer.`, "MISSING_BUFFER");
  }

  if (current.attempts >= MAX_ATTEMPTS) {
    markDocumentFailed(documentId, "Maximum retry attempts reached.");
    return;
  }

  incrementAttempts(documentId);
  updateDocumentRecord(documentId, {
    status: "processing",
    errorMessage: undefined,
    generationStatus: "idle",
    generationErrorMessage: undefined,
  });

  let extractedText = "";
  let pageCount = 0;

  try {
    const extraction = await extractTextFromPdf(current.fileBuffer);
    extractedText = extraction.text;
    pageCount = extraction.pageCount;
    const chunks = await createChunksForDocument(documentId, extractedText, pageCount);

    setChunks(documentId, chunks);

    updateDocumentRecord(documentId, {
      status: "completed",
      extractedText,
      pageCount,
      errorMessage: undefined,
      generationStatus: "generating",
      generationErrorMessage: undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown processing error";
    const sanitizedMessage = sanitizeProcessingError(message);

    if (current.attempts + 1 >= MAX_ATTEMPTS) {
      markDocumentFailed(documentId, sanitizedMessage);
      return;
    }

    updateDocumentRecord(documentId, {
      status: "failed",
      errorMessage: sanitizedMessage,
    });

    return;
  }

  try {
    const result = await generateStudyPackageWithMetadata(extractedText);

    updateDocumentRecord(documentId, {
      studyPackage: result.studyPackage,
      generationStatus: result.failureState ?? "completed",
      generationErrorMessage: result.errorMessage
        ? getFriendlyGenerationMessage(result.errorMessage)
        : undefined,
    });
  } catch {
    updateDocumentRecord(documentId, {
      generationStatus: "generation_failed",
      generationErrorMessage: "Generation failed, please retry",
    });
  }
}

export function shouldRetry(documentId: string): boolean {
  const current = getDocumentRecord(documentId);
  return Boolean(current && current.attempts < MAX_ATTEMPTS && current.status === "failed");
}

export async function retryDocument(documentId: string): Promise<void> {
  const current = getDocumentRecord(documentId);

  if (!current) {
    throw new ProcessingError(`Document ${documentId} was not found.`, "DOCUMENT_NOT_FOUND");
  }

  if (!shouldRetry(documentId)) {
    throw new ProcessingError("This document cannot be retried right now.", "RETRY_NOT_ALLOWED");
  }

  updateDocumentRecord(documentId, {
    status: "uploading",
    errorMessage: undefined,
    generationStatus: "idle",
    generationErrorMessage: undefined,
    studyPackage: undefined,
  });

  await processDocument(documentId);
}
