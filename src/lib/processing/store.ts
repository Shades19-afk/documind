import { DocumentRecord, ExtractedChunk, ProcessingState } from "./types";

const documentStore = new Map<string, DocumentRecord>();

function nowIso(): string {
  return new Date().toISOString();
}

export function createDocumentRecord(input: Omit<DocumentRecord, "status" | "uploadedAt" | "updatedAt" | "attempts" | "chunks" | "pageCount" | "generationStatus"> & { fileBuffer?: Buffer; pageCount?: number; status?: ProcessingState }): DocumentRecord {
  const record: DocumentRecord = {
    id: input.id,
    filename: input.filename,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    status: input.status ?? "uploading",
    uploadedAt: nowIso(),
    updatedAt: nowIso(),
    attempts: 0,
    pageCount: input.pageCount ?? 0,
    chunks: [],
    fileBuffer: input.fileBuffer,
    generationStatus: "idle",
  };

  documentStore.set(record.id, record);
  return record;
}

export function getDocumentRecord(id: string): DocumentRecord | undefined {
  return documentStore.get(id);
}

export function updateDocumentRecord(id: string, updates: Partial<DocumentRecord>): DocumentRecord | undefined {
  const current = documentStore.get(id);

  if (!current) {
    return undefined;
  }

  const next = {
    ...current,
    ...updates,
    fileBuffer: updates.fileBuffer ?? current.fileBuffer,
    updatedAt: nowIso(),
  };

  documentStore.set(id, next);
  return next;
}

export function setChunks(documentId: string, chunks: ExtractedChunk[]): DocumentRecord | undefined {
  const current = documentStore.get(documentId);

  if (!current) {
    return undefined;
  }

  const next = {
    ...current,
    chunks,
    updatedAt: nowIso(),
  };

  documentStore.set(documentId, next);
  return next;
}

export function incrementAttempts(id: string): DocumentRecord | undefined {
  const current = documentStore.get(id);

  if (!current) {
    return undefined;
  }

  const next = {
    ...current,
    attempts: current.attempts + 1,
    updatedAt: nowIso(),
  };

  documentStore.set(id, next);
  return next;
}

export function markDocumentFailed(id: string, errorMessage: string): DocumentRecord | undefined {
  return updateDocumentRecord(id, {
    status: "failed",
    errorMessage,
  });
}

export function getAllDocumentRecords(): DocumentRecord[] {
  return Array.from(documentStore.values());
}
