"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FolderOpen,
  Globe,
  Loader2,
  Plus,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { UserMenu } from "@/components/auth/user-menu";
import { getFriendlyGenerationMessage } from "@/lib/ai/errors";
import { getDocumentDetails, getDocumentStatus, getUserDocuments, ProcessedDocument, uploadPdf } from "@/lib/processing-client";

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
    "Drop a PDF here or browse to add new documents to your workspace."
  );
  const [isDragging, setIsDragging] = useState(false);
  const [activeUploads, setActiveUploads] = useState<UploadItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stats = useMemo(
    () => ({
      total: documents.length,
      ready: documents.filter((document) => document.status === "completed").length,
      processing: documents.filter(
        (document) => document.status === "uploading" || document.status === "processing"
      ).length,
      needsReview: documents.filter((document) => document.status === "failed").length,
    }),
    [documents]
  );

  const recentDocuments = documents.slice(0, 3);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const nextDocuments = await getUserDocuments();
        if (!mounted) {
          return;
        }

        setDocuments(nextDocuments);
        setErrorMessage(null);
      } catch (error) {
        if (!mounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Unable to load your documents.";
        setErrorMessage(message);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const pollDocumentStatus = async (documentId: string, uploadId: string) => {
    try {
      const status = await getDocumentStatus(documentId);

      if (status.status === "uploading" || status.status === "processing") {
        setActiveUploads((current) =>
          current.map((item) =>
            item.id === uploadId
              ? {
                  ...item,
                  status: status.status,
                  progress: Math.max(item.progress, Math.min(90, 35 + status.attempts * 8)),
                }
              : item
          )
        );

        window.setTimeout(() => {
          void pollDocumentStatus(documentId, uploadId);
        }, 1500);
        return;
      }

      if (status.status === "completed") {
        const details = await getDocumentDetails(documentId);

        setDocuments((current) => [details, ...current.filter((item) => item.id !== details.id)]);
        setActiveUploads((current) =>
          current.map((item) =>
            item.id === uploadId
              ? {
                  ...item,
                  status: "completed",
                  progress: 100,
                }
              : item
          )
        );

        if (details.generationErrorMessage) {
          pushToast({
            title: "Study generation needs attention",
            description: getFriendlyGenerationMessage(details.generationErrorMessage),
            variant: details.generationStatus === "quota_exceeded" || details.generationStatus === "retry_pending" ? "info" : "error",
          });
        } else {
          pushToast({
            title: "Document ready",
            description: `${details.filename} has been processed and is ready for review.`,
            variant: "success",
          });
        }
        return;
      }

      const failureMessage = status.errorMessage || "Processing failed. Please retry from the library.";
      setDocuments((current) =>
        current.map((item) =>
          item.id === documentId
            ? {
                ...item,
                status: "failed",
                errorMessage: failureMessage,
                updatedAt: status.updatedAt,
              }
            : item
        )
      );
      setActiveUploads((current) =>
        current.map((item) =>
          item.id === uploadId
            ? {
                ...item,
                status: "failed",
                progress: 100,
                errorMessage: failureMessage,
              }
            : item
        )
      );
      pushToast({
        title: "Processing failed",
        description: failureMessage,
        variant: "error",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to refresh processing status.";
      setActiveUploads((current) =>
        current.map((item) =>
          item.id === uploadId
            ? {
                ...item,
                status: "failed",
                progress: 100,
                errorMessage: message,
              }
            : item
        )
      );
      pushToast({
        title: "Status check failed",
        description: message,
        variant: "error",
      });
    }
  };

  const processFiles = async (files: FileList | File[]) => {
    const pdfFiles = Array.from(files).filter(
      (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    );

    if (pdfFiles.length === 0) {
      setErrorMessage("Please upload PDF files to continue.");
      setUploadMessage("Please upload PDF files to continue.");
      return;
    }

    setErrorMessage(null);
    setUploadMessage(`Uploading ${pdfFiles.length} document${pdfFiles.length > 1 ? "s" : ""}...`);

    for (const file of pdfFiles) {
      const uploadId = `${file.name}-${Math.random().toString(36).slice(2, 8)}`;

      setActiveUploads((current) => [
        {
          id: uploadId,
          fileName: file.name,
          progress: 8,
          status: "uploading",
        },
        ...current,
      ]);

      try {
        const uploadResponse = await uploadPdf(file);
        const draftDocument: ProcessedDocument = {
          id: uploadResponse.id,
          filename: uploadResponse.filename,
          mimeType: uploadResponse.mimeType,
          sizeBytes: uploadResponse.sizeBytes,
          status: "processing",
          pageCount: uploadResponse.pageCount,
          chunks: [],
          summary:
            "Your PDF is processing. DocuMind will generate the summary, study notes, and flashcards once extraction completes.",
          uploadedAt: uploadResponse.uploadedAt || new Date().toISOString(),
          updatedAt: uploadResponse.updatedAt || new Date().toISOString(),
          generationStatus: "idle",
        };

        setDocuments((current) => [draftDocument, ...current.filter((item) => item.id !== draftDocument.id)]);
        setActiveUploads((current) =>
          current.map((item) =>
            item.id === uploadId
              ? {
                  ...item,
                  status: "processing",
                  progress: 32,
                }
              : item
          )
        );

        pushToast({
          title: "Upload accepted",
          description: `${file.name} is now processing in the background.`,
          variant: "info",
        });

        void pollDocumentStatus(draftDocument.id, uploadId);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Upload failed.";
        setErrorMessage(message);
        setActiveUploads((current) =>
          current.map((item) =>
            item.id === uploadId
              ? {
                  ...item,
                  status: "failed",
                  progress: 100,
                  errorMessage: message,
                }
              : item
          )
        );
        pushToast({
          title: "Upload failed",
          description: message,
          variant: "error",
        });
      }
    }

    setUploadMessage(`All ${pdfFiles.length} document${pdfFiles.length > 1 ? "s" : ""} are now in flight.`);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    await processFiles(event.dataTransfer.files);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    await processFiles(event.target.files);
    event.target.value = "";
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),transparent_28%),linear-gradient(180deg,#09090b_0%,#111827_100%)] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <header className="relative z-20 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-200/80">DocuMind</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">AI PDF summarizer for faster study and review</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Upload PDFs, generate concise summaries, extract key points, build study notes, and export your learning toolkit in one polished workspace.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link href="/documents">Open library</Link>
              </Button>
              <Button asChild className="bg-indigo-500 hover:bg-indigo-400">
                <Link href="#upload-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start summarizing
                </Link>
              </Button>
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="relative z-10 grid gap-4 xl:grid-cols-[1.7fr,1fr]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="border-white/10 bg-white/5">
                <CardContent className="p-5">
                  <p className="text-sm text-gray-200">Documents</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stats.total}</p>
                  <p className="mt-1 text-xs text-emerald-200">Live in your workspace</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardContent className="p-5">
                  <p className="text-sm text-gray-200">Ready</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stats.ready}</p>
                  <p className="mt-1 text-xs text-gray-400">AI summaries available</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardContent className="p-5">
                  <p className="text-sm text-gray-200">Processing</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stats.processing}</p>
                  <p className="mt-1 text-xs text-gray-400">Queued for indexing</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardContent className="p-5">
                  <p className="text-sm text-gray-200">Needs review</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stats.needsReview}</p>
                  <p className="mt-1 text-xs text-gray-400">Requires attention</p>
                </CardContent>
              </Card>
            </div>

            <Card id="upload-center" className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Upload center</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`rounded-2xl border border-dashed p-6 transition ${
                    isDragging
                      ? "border-indigo-300 bg-indigo-500/10"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
                    <div className="rounded-2xl bg-indigo-500/20 p-3 text-indigo-100">
                      <UploadCloud className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">Drag and drop your PDFs here</p>
                      <p className="text-sm text-gray-200">{uploadMessage}</p>
                      {errorMessage ? <p className="text-sm text-rose-200">{errorMessage}</p> : null}
                      <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                        <input
                          ref={fileInputRef}
                          id="pdf-upload"
                          type="file"
                          accept="application/pdf"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Choose files
                        </Button>
                        <Button asChild variant="ghost" className="text-slate-200 hover:text-white">
                          <Link href="/documents">Browse library</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {activeUploads.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-gray-200">
                      No uploads in progress. Your files will appear here once processing starts.
                    </div>
                  ) : (
                    activeUploads.map((upload) => (
                      <div
                        key={upload.id}
                        className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-medium">{upload.fileName}</p>
                            <p className="text-xs text-gray-400">
                              {upload.status === "uploading"
                                ? "Preparing upload"
                                : upload.status === "processing"
                                  ? "Extracting and chunking"
                                  : upload.status === "completed"
                                    ? "Processing complete"
                                    : upload.errorMessage || "Retry needed"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {upload.status === "completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                            ) : (
                              <Loader2 className="h-4 w-4 animate-spin text-indigo-200" />
                            )}
                            <span>{upload.progress}%</span>
                          </div>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300"
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-lg text-white">Recent documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentDocuments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-gray-200">
                    Upload your first PDF to start seeing it here.
                  </div>
                ) : (
                  recentDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{document.filename}</p>
                          <p className="mt-1 text-sm text-gray-200">{document.summary}</p>
                        </div>
                        <CheckCircle2 className="mt-1 h-4 w-4 text-indigo-200" />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                        <span className="rounded-full bg-white/5 px-2 py-1">{document.mimeType}</span>
                        <span className="rounded-full bg-white/5 px-2 py-1">{document.pageCount} pages</span>
                        <span className="rounded-full bg-white/5 px-2 py-1">{document.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Workspace health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-200">
                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-indigo-200" />
                    Secure syncing
                  </span>
                  <span className="text-emerald-200">Enabled</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
                  <span className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-indigo-200" />
                    Active library
                  </span>
                  <span>{stats.total} docs</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
                  <span className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-indigo-200" />
                    Next action
                  </span>
                  <span>Review uploads</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
