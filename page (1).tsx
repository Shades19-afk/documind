"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FolderOpen,
  Loader2,
  Plus,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { UserMenu } from "@/components/auth/user-menu";
import { getFriendlyGenerationMessage } from "@/lib/ai/errors";
import {
  getDocumentDetails,
  getDocumentStatus,
  getUserDocuments,
  ProcessedDocument,
  uploadPdf,
} from "@/lib/processing-client";

interface UploadItem {
  id: string;
  fileName: string;
  progress: number;
  status: "uploading" | "processing" | "completed" | "failed";
  errorMessage?: string;
}

export default function DashboardPage() {
  const { pushToast } = useToast();
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [uploadMessage, setUploadMessage] = useState(
    "Drop a PDF or click to browse"
  );
  const [isDragging, setIsDragging] = useState(false);
  const [activeUploads, setActiveUploads] = useState<UploadItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stats = useMemo(
    () => ({
      total: documents.length,
      ready: documents.filter((d) => d.status === "completed").length,
      processing: documents.filter(
        (d) => d.status === "uploading" || d.status === "processing"
      ).length,
      needsReview: documents.filter((d) => d.status === "failed").length,
    }),
    [documents]
  );

  const recentDocuments = documents.slice(0, 5);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const docs = await getUserDocuments();
        if (mounted) setDocuments(docs);
      } catch (error) {
        if (mounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load documents."
          );
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  const pollDocumentStatus = async (documentId: string, uploadId: string) => {
    try {
      const status = await getDocumentStatus(documentId);
      if (status.status === "uploading" || status.status === "processing") {
        setActiveUploads((cur) =>
          cur.map((item) =>
            item.id === uploadId
              ? { ...item, status: status.status, progress: Math.min(90, 35 + status.attempts * 8) }
              : item
          )
        );
        window.setTimeout(() => void pollDocumentStatus(documentId, uploadId), 1500);
        return;
      }
      if (status.status === "completed") {
        const details = await getDocumentDetails(documentId);
        setDocuments((cur) => [details, ...cur.filter((d) => d.id !== details.id)]);
        setActiveUploads((cur) =>
          cur.map((item) => (item.id === uploadId ? { ...item, status: "completed", progress: 100 } : item))
        );
        if (details.generationErrorMessage) {
          pushToast({ title: "Generation note", description: getFriendlyGenerationMessage(details.generationErrorMessage), variant: "info" });
        } else {
          pushToast({ title: "Document ready", description: `${details.filename} processed successfully.`, variant: "success" });
        }
        return;
      }
      const msg = status.errorMessage || "Processing failed.";
      setActiveUploads((cur) =>
        cur.map((item) => (item.id === uploadId ? { ...item, status: "failed", progress: 100, errorMessage: msg } : item))
      );
      pushToast({ title: "Processing failed", description: msg, variant: "error" });
    } catch {
      setActiveUploads((cur) =>
        cur.map((item) => (item.id === uploadId ? { ...item, status: "failed", progress: 100 } : item))
      );
    }
  };

  const processFiles = async (files: FileList | File[]) => {
    const pdfs = Array.from(files).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (pdfs.length === 0) {
      setErrorMessage("Only PDF files are accepted.");
      return;
    }
    setErrorMessage(null);

    for (const file of pdfs) {
      const uploadId = `${file.name}-${Math.random().toString(36).slice(2, 8)}`;
      setActiveUploads((cur) => [{ id: uploadId, fileName: file.name, progress: 8, status: "uploading" }, ...cur]);
      try {
        const res = await uploadPdf(file);
        const draft: ProcessedDocument = {
          id: res.id, filename: res.filename, mimeType: res.mimeType,
          sizeBytes: res.sizeBytes, status: "processing", pageCount: res.pageCount,
          chunks: [], summary: "Processing…", uploadedAt: res.uploadedAt || new Date().toISOString(),
          updatedAt: res.updatedAt || new Date().toISOString(), generationStatus: "idle",
        };
        setDocuments((cur) => [draft, ...cur.filter((d) => d.id !== draft.id)]);
        setActiveUploads((cur) =>
          cur.map((item) => (item.id === uploadId ? { ...item, status: "processing", progress: 32 } : item))
        );
        void pollDocumentStatus(draft.id, uploadId);
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Upload failed.";
        setErrorMessage(msg);
        setActiveUploads((cur) =>
          cur.map((item) => (item.id === uploadId ? { ...item, status: "failed", progress: 100, errorMessage: msg } : item))
        );
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    await processFiles(e.dataTransfer.files);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-serif text-lg">DocuMind</Link>
            <nav className="hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
              <Link href="/dashboard" className="text-foreground font-medium">Dashboard</Link>
              <Link href="/documents" className="hover:text-foreground">Library</Link>
            </nav>
          </div>
          <UserMenu />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* ── Page title + stats ───────────────────────────── */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl text-foreground">Workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload, process, and export document intelligence.
          </p>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
          {[
            { label: "Total", value: stats.total },
            { label: "Ready", value: stats.ready },
            { label: "Processing", value: stats.processing },
            { label: "Needs attention", value: stats.needsReview },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              className={`py-5 ${i < 3 ? "border-r border-border" : ""} ${i % 2 === 0 ? "pr-6" : "px-6"}`}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
              <p className="mt-1 font-serif text-4xl text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Two-col layout ───────────────────────────────── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Left: upload + active uploads */}
          <div className="space-y-6">

            {/* Upload zone */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Upload
              </p>
              <div
                id="upload-center"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`mt-3 cursor-pointer rounded-sm border-2 border-dashed p-10 text-center transition-colors ${
                  isDragging
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-muted-foreground"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">{uploadMessage}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">PDF · max 25 MB</p>
                {errorMessage && (
                  <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => { if (e.target.files) void processFiles(e.target.files); e.target.value = ""; }}
                  className="hidden"
                />
              </div>

              <div className="mt-3 flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Choose files
                </Button>
                <Button variant="ghost" size="sm" className="rounded-sm" asChild>
                  <Link href="/documents">Browse library</Link>
                </Button>
              </div>
            </div>

            {/* Active uploads */}
            {activeUploads.length > 0 && (
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  In progress
                </p>
                <div className="mt-3 divide-y divide-border rounded-sm border border-border">
                  {activeUploads.map((upload) => (
                    <div key={upload.id} className="px-4 py-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{upload.fileName}</p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {upload.status === "uploading" ? "Uploading…"
                              : upload.status === "processing" ? "Extracting text…"
                              : upload.status === "completed" ? "Done"
                              : upload.errorMessage || "Failed"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {upload.status === "completed"
                            ? <CheckCircle2 className="h-4 w-4 text-green-600" />
                            : <Loader2 className="h-4 w-4 animate-spin" />
                          }
                          {upload.progress}%
                        </div>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-foreground transition-all duration-500"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent documents table */}
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Recent
                </p>
                <Link href="/documents" className="font-mono text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
                  View all
                </Link>
              </div>

              {recentDocuments.length === 0 ? (
                <div className="mt-3 rounded-sm border border-dashed border-border py-10 text-center">
                  <FolderOpen className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No documents yet.</p>
                </div>
              ) : (
                <div className="mt-3 divide-y divide-border rounded-sm border border-border">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between gap-4 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{doc.filename}</p>
                        <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{doc.summary?.slice(0, 80)}{doc.summary && doc.summary.length > 80 ? "…" : ""}</p>
                      </div>
                      <span className={`shrink-0 rounded-sm px-2 py-0.5 font-mono text-[10px] ${
                        doc.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : doc.status === "failed"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {doc.status === "completed" ? "Ready"
                          : doc.status === "failed" ? "Failed"
                          : "Processing"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: workspace info */}
          <div className="space-y-6">

            {/* Quick actions */}
            <div className="rounded-sm border border-border p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Quick actions</p>
              <div className="mt-4 space-y-2">
                <Link
                  href="/documents"
                  className="flex items-center justify-between rounded-sm bg-muted px-4 py-3 text-sm font-medium text-foreground hover:bg-border"
                >
                  Browse document library
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-between rounded-sm border border-border px-4 py-3 text-sm text-foreground hover:bg-muted"
                >
                  Upload new PDF
                  <UploadCloud className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Workspace health */}
            <div className="rounded-sm border border-border p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Status</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "AI generation", value: "Online", ok: true },
                  { label: "Storage", value: "Active", ok: true },
                  { label: "Documents indexed", value: `${stats.ready} / ${stats.total}`, ok: stats.total === 0 || stats.needsReview === 0 },
                ].map(({ label, value, ok }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={`font-mono text-xs ${ok ? "text-green-600 dark:text-green-400" : "text-[var(--accent-rust)]"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-sm border border-border bg-muted p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--accent-rust)]" />
                <p className="text-sm font-medium text-foreground">After upload</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Open a document and click <strong className="text-foreground">Regenerate study tools</strong> any
                time to refresh the summary, flashcards, and notes.
              </p>
              <Link
                href="/documents"
                className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-foreground underline underline-offset-4 hover:no-underline"
              >
                Go to library <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
