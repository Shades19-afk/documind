"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Sparkles, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentCard } from "@/components/processing/document-card";
import { UserMenu } from "@/components/auth/user-menu";
import { useToast } from "@/components/ui/toast";
import {
  exportStudyPackage,
  getDocumentDetails,
  getDocumentStatus,
  getUserDocuments,
  ProcessedDocument,
  retryProcessing,
} from "@/lib/processing-client";

function LibrarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="h-48 animate-pulse rounded-2xl border border-white/5 bg-white/5"
        />
      ))}
    </div>
  );
}

export default function DocumentsPage() {
  const { pushToast } = useToast();
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

  const refreshDocuments = useCallback(async () => {
    setIsLoading(true);

    try {
      const serverDocuments = await getUserDocuments();

      const refreshedDocuments = await Promise.all(
        serverDocuments.map(async (document) => {
          try {
            const status = await getDocumentStatus(document.id);

            if (status.status === "completed") {
              return await getDocumentDetails(document.id);
            }

            return {
              ...document,
              status: status.status,
              errorMessage: status.errorMessage,
              updatedAt: status.updatedAt,
            };
          } catch {
            return document;
          }
        })
      );

      setDocuments(refreshedDocuments);
      setErrorMessage(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to refresh the document library.";
      setErrorMessage(message);
      pushToast({
        title: "Library refresh failed",
        description: message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    void refreshDocuments();
  }, [refreshDocuments]);

  const handleRetry = async (documentId: string) => {
    try {
      await retryProcessing(documentId);

      pushToast({
        title: "Retry started",
        description: "The document is being reprocessed in the background.",
        variant: "info",
      });

      window.setTimeout(() => {
        void refreshDocuments();
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Retry could not start.";
      pushToast({
        title: "Retry failed",
        description: message,
        variant: "error",
      });
    }
  };

  const handleGenerateStudy = async (documentId: string) => {
    const currentDocument = documents.find((document) => document.id === documentId);

    if (!currentDocument) {
      return;
    }

    setIsGenerating((current) => ({ ...current, [documentId]: true }));

    try {
      await retryProcessing(documentId);
      pushToast({
        title: "Study tools updated",
        description: `${currentDocument.filename} is being re-generated and saved to your library.`,
        variant: "success",
      });
      window.setTimeout(() => {
        void refreshDocuments();
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Generation failed, please retry";
      pushToast({
        title: "Study tools unavailable",
        description: message,
        variant: "error",
      });
    } finally {
      setIsGenerating((current) => ({ ...current, [documentId]: false }));
    }
  };

  const filteredDocuments = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return documents;
    }

    return documents.filter((document) =>
      [document.filename, document.summary, document.mimeType, document.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [documents, search]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),transparent_32%),linear-gradient(180deg,#09090b_0%,#111827_100%)] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-5 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-200/80">Document library</p>
              <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Browse your uploaded PDFs and study tools</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-200">
                Search your documents, review AI summaries, and export study notes and flashcards when you are ready.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
              <Button asChild className="bg-indigo-500 hover:bg-indigo-400">
                <Link href="/dashboard">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload new PDF
                </Link>
              </Button>
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[1.2fr,1fr]">
          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-200">Search your library</p>
                  <p className="mt-1 text-lg font-semibold text-white">Find the right document in seconds</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-gray-200">
                  <Search className="h-4 w-4 text-indigo-200" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by status, filename, or summary"
                    className="w-full bg-transparent outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-200">Quick insight</p>
                  <p className="mt-1 text-lg font-semibold text-white">Study-ready library</p>
                </div>
                <Sparkles className="h-5 w-5 text-indigo-200" />
              </div>
              <p className="mt-3 text-sm text-gray-200">
                AI summaries, key points, study notes, and flashcards are surfaced directly in the document cards so you can export the materials you need.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-indigo-100">
                <Sparkles className="h-4 w-4" />
                {documents.length} documents available
              </div>
            </CardContent>
          </Card>
        </div>

        {errorMessage ? (
          <Card className="border-rose-300/30 bg-rose-500/10">
            <CardContent className="px-6 py-4 text-sm text-rose-50">
              {errorMessage}
            </CardContent>
          </Card>
        ) : null}

        {isLoading ? (
          <LibrarySkeleton />
        ) : filteredDocuments.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-white/5">
            <CardContent className="px-6 py-12 text-center">
              <UploadCloud className="mx-auto h-10 w-10 text-indigo-200" />
              <h2 className="mt-4 text-xl font-semibold">No documents match your search</h2>
              <p className="mt-2 text-sm text-gray-200">
                Upload a PDF from the dashboard or try a broader keyword to find the right file.
              </p>
              <div className="mt-5 flex justify-center">
                <Button asChild className="bg-indigo-500 hover:bg-indigo-400">
                  <Link href="/dashboard">Return to dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onRetry={document.status === "failed" ? () => void handleRetry(document.id) : undefined}
                onGenerateStudy={() => void handleGenerateStudy(document.id)}
                isGenerating={Boolean(isGenerating[document.id])}
                onExport={exportStudyPackage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
