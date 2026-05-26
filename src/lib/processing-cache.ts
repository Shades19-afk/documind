import { ProcessingStatus, ProcessedDocument } from "@/lib/processing-client";

const CACHE_KEY = "documind-processed-documents";

export type CachedDocument = ProcessedDocument;

function getStoredDocuments(): CachedDocument[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CachedDocument[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readCachedDocuments() {
  return getStoredDocuments();
}

export function upsertCachedDocument(document: CachedDocument) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getStoredDocuments();
  const next = [document, ...current.filter((item) => item.id !== document.id)];
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(next));
}

export function deleteCachedDocument(id: string) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getStoredDocuments();
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(current.filter((item) => item.id !== id)));
}

export function syncCachedStatus(id: string, status: ProcessingStatus, errorMessage?: string) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getStoredDocuments();
  const currentDocument = current.find((item) => item.id === id);

  if (!currentDocument) {
    return;
  }

  currentDocument.status = status;
  currentDocument.errorMessage = errorMessage;
  currentDocument.updatedAt = new Date().toISOString();
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(current));
}

export function readCachedDocumentsByStatus(status: ProcessingStatus) {
  return getStoredDocuments().filter((document) => document.status === status);
}
