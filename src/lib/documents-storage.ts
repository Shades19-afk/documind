export type DocumentStatus = "Ready" | "Processing" | "Needs Review";

export interface AppDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  owner: string;
  status: DocumentStatus;
  summary: string;
  pages: number;
  tags: string[];
}

const STORAGE_KEY = "documind-documents-v1";

const seedDocuments: AppDocument[] = [
  {
    id: "doc-1",
    name: "Quarterly Product Strategy.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "2026-05-22T09:30:00.000Z",
    owner: "Alex Morgan",
    status: "Ready",
    summary: "Executive summary and launch priorities for Q3 planning.",
    pages: 18,
    tags: ["Strategy", "Q3", "Leadership"],
  },
  {
    id: "doc-2",
    name: "Customer Feedback Report.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadedAt: "2026-05-20T14:05:00.000Z",
    owner: "Priya Shah",
    status: "Ready",
    summary: "Insights from the latest customer interviews and retention risks.",
    pages: 12,
    tags: ["Customer", "Insights", "Retention"],
  },
  {
    id: "doc-3",
    name: "Legal Review Draft.pdf",
    type: "PDF",
    size: "3.1 MB",
    uploadedAt: "2026-05-18T11:15:00.000Z",
    owner: "Jordan Lee",
    status: "Needs Review",
    summary: "Brand and compliance notes that need approval before publishing.",
    pages: 21,
    tags: ["Legal", "Compliance", "Review"],
  },
];

function safeReadStorage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function safeWriteStorage(value: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Ignore storage failures in restricted environments.
  }
}

export function getStoredDocuments(): AppDocument[] {
  const stored = safeReadStorage();

  if (!stored) {
    return seedDocuments;
  }

  try {
    const parsed = JSON.parse(stored) as AppDocument[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedDocuments;
  } catch {
    return seedDocuments;
  }
}

export function saveStoredDocuments(documents: AppDocument[]): void {
  safeWriteStorage(JSON.stringify(documents));
}

export function addStoredDocument(document: AppDocument): AppDocument[] {
  const nextDocuments = [document, ...getStoredDocuments()];
  saveStoredDocuments(nextDocuments);
  return nextDocuments;
}

export function getDocumentSummaryStats(documents: AppDocument[]) {
  const ready = documents.filter((document) => document.status === "Ready").length;
  const processing = documents.filter((document) => document.status === "Processing").length;
  const needsReview = documents.filter((document) => document.status === "Needs Review").length;

  return {
    total: documents.length,
    ready,
    processing,
    needsReview,
  };
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
