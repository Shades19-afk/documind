import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFriendlyGenerationMessage } from "@/lib/ai/errors";
import { CachedDocument } from "@/lib/processing-cache";
import { exportStudyPackage, formatBytes, formatDate, ProcessedDocument } from "@/lib/processing-client";
import { BookOpen, Download, FileText, Loader2, RefreshCcw, Sparkles } from "lucide-react";

function statusClasses(status: CachedDocument["status"]) {
  switch (status) {
    case "completed":
      return "bg-emerald-500/15 text-emerald-50 border-emerald-300/30";
    case "failed":
      return "bg-rose-500/15 text-rose-50 border-rose-300/30";
    case "processing":
      return "bg-sky-500/15 text-sky-50 border-sky-300/30";
    default:
      return "bg-amber-500/15 text-amber-50 border-amber-300/30";
  }
}

function generationClasses(status: NonNullable<ProcessedDocument["generationStatus"]>) {
  switch (status) {
    case "completed":
      return "bg-emerald-500/15 text-emerald-50 border-emerald-300/30";
    case "quota_exceeded":
      return "bg-amber-500/15 text-amber-50 border-amber-300/30";
    case "retry_pending":
      return "bg-sky-500/15 text-sky-50 border-sky-300/30";
    case "generation_failed":
      return "bg-rose-500/15 text-rose-50 border-rose-300/30";
    case "generating":
      return "bg-sky-500/15 text-sky-50 border-sky-300/30";
    default:
      return "bg-slate-500/15 text-slate-100 border-slate-300/30";
  }
}

function statusLabel(status: CachedDocument["status"]) {
  return status === "uploading" ? "Uploading" : status === "processing" ? "Processing" : status === "completed" ? "Ready" : "Needs retry";
}

function generationLabel(status: NonNullable<ProcessedDocument["generationStatus"]>) {
  switch (status) {
    case "completed":
      return "Study package ready";
    case "generating":
      return "Generating study material";
    case "quota_exceeded":
      return "Quota exhausted";
    case "retry_pending":
      return "Retry pending";
    case "generation_failed":
      return "Generation needs attention";
    default:
      return "Awaiting study generation";
  }
}

interface DocumentCardProps {
  document: CachedDocument;
  onRetry?: () => void;
  onGenerateStudy?: () => void;
  isGenerating?: boolean;
  onExport?: (document: ProcessedDocument, format?: "markdown" | "text" | "json" | "pdf") => void;
  compact?: boolean;
}

export function DocumentCard({
  document,
  onRetry,
  onGenerateStudy,
  isGenerating = false,
  onExport = exportStudyPackage,
  compact = false,
}: DocumentCardProps) {
  const studyPackage = document.studyPackage;
  const generationStatus = document.generationStatus ?? (studyPackage ? "completed" : "idle");
  const isGeneratingStudy = isGenerating || generationStatus === "generating";

  const keyPoints = studyPackage?.keyPoints ?? document.keyPoints ?? [];
  const summary = studyPackage?.summary || document.summary || "Your document is being prepared for AI summaries, study notes, and flashcards.";
  const overview = studyPackage?.overview || document.overview || summary;
  const safeGenerationMessage = document.generationErrorMessage
    ? getFriendlyGenerationMessage(document.generationErrorMessage)
    : undefined;

  return (
    <Card className="border-white/10 bg-white/5 transition hover:border-indigo-300/50 hover:bg-white/[0.06]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-semibold text-white">{document.filename}</p>
            <p className="mt-2 text-sm text-gray-200">{summary}</p>
          </div>
          <FileText className="mt-1 h-5 w-5 shrink-0 text-indigo-200" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-slate-100">{document.mimeType}</span>
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-slate-100">{formatBytes(document.sizeBytes)}</span>
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-slate-100">{document.pageCount} pages</span>
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-slate-100">{formatDate(document.updatedAt)}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-xs ${statusClasses(document.status)}`}>{statusLabel(document.status)}</span>
            <span className={`rounded-full border px-2.5 py-1 text-xs ${generationClasses(generationStatus)}`}>{generationLabel(generationStatus)}</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-gray-200">
              {document.chunks.length} chunks
            </span>
            {document.errorMessage ? (
              <span className="rounded-full border border-rose-300/25 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-50">
                {document.errorMessage}
              </span>
            ) : null}
          </div>

          {!compact && onRetry && document.status === "failed" ? (
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={onRetry}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry processing
            </Button>
          ) : null}
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/35 p-3">
          <div className="flex items-center gap-2 text-sm text-indigo-100">
            <BookOpen className="h-4 w-4" />
            {isGeneratingStudy
              ? "Generating study tools…"
              : studyPackage
                ? "Study toolkit ready"
                : "Generate study tools to unlock notes and flashcards"}
          </div>
          <p className="mt-3 text-sm text-gray-200">
            {isGeneratingStudy
              ? "DocuMind is preparing a fresh study package. You can keep using the document while this finishes."
              : overview}
          </p>

          {keyPoints.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {keyPoints.slice(0, 4).map((point) => (
                <span key={point} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-100">
                  {point}
                </span>
              ))}
            </div>
          ) : null}

          {studyPackage ? (
            <div className="mt-4 space-y-2 text-sm text-gray-200">
              <p className="font-medium text-white">Detailed overview</p>
              <p>{studyPackage.detailedSummary}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-100">Key takeaways</p>
                  <ul className="mt-2 space-y-1">
                    {studyPackage.keyTakeaways.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-100">Important concepts</p>
                  <ul className="mt-2 space-y-1">
                    {studyPackage.importantConcepts.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}

          {safeGenerationMessage ? (
            <p className="mt-3 rounded-xl border border-rose-300/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-50">
              {safeGenerationMessage}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            onClick={onGenerateStudy}
            disabled={isGeneratingStudy}
          >
            {isGeneratingStudy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isGeneratingStudy
              ? "Generating..."
              : generationStatus === "quota_exceeded" || generationStatus === "retry_pending" || generationStatus === "generation_failed"
                ? "Retry generation"
                : "Regenerate study tools"}
          </Button>
          {studyPackage ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                onClick={() => onExport(document, "markdown")}
                disabled={isGeneratingStudy}
              >
                <Download className="mr-2 h-4 w-4" />
                Export notes
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                onClick={() => onExport(document, "text")}
                disabled={isGeneratingStudy}
              >
                <Download className="mr-2 h-4 w-4" />
                Export text
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                onClick={() => onExport(document, "json")}
                disabled={isGeneratingStudy}
              >
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
            </>
          ) : null}
        </div>

        {!compact ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-indigo-100">
            <Sparkles className="h-4 w-4" />
            {document.status === "completed"
              ? "Ready for review, note taking, and export."
              : "Processing pipeline is running. Refresh the page later for updated results."}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
