"use client";

import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function DocuMindLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="font-serif text-lg font-semibold text-foreground">DocuMind</div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-foreground hover:bg-accent hover:text-accent-foreground">
              <a href="/auth/login">Open workspace</a>
            </Button>
            <Button asChild className="bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
              <a href="/auth/login">Sign in</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-sm font-medium text-accent">Document workflow</p>
              <h1 className="font-serif max-w-2xl text-4xl font-semibold leading-tight text-foreground">
                Upload a PDF, get a summary bundle, then search every document instantly.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                DocuMind turns a document into a working reference: extract text, build searchable content, and produce clean output for review.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                  <a href="/auth/login">Open workspace</a>
                </Button>
                <a className="text-sm font-medium text-muted-foreground hover:text-foreground" href="#workflow">
                  See workflow
                </a>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm font-semibold text-muted-foreground">Working document output</p>
              <div className="mt-6 space-y-5">
                <div className="rounded-lg border border-border bg-background p-5">
                  <p className="text-sm font-semibold text-foreground">Summary</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    A concise overview of the document’s core points and decisions.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-5">
                  <p className="text-sm font-semibold text-foreground">Highlights</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Key passages and action items extracted from the file.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-10 lg:grid-cols-[0.55fr,0.45fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-sm font-medium text-accent">What happens after upload</p>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-foreground">
                One file, structured output, and instant access to facts.
              </h2>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                After upload, DocuMind extracts text, builds a searchable index, and produces a summary bundle your team can use immediately.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm font-semibold text-foreground">1. Ingest</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Extract text, tables, and structure from PDFs and scanned documents.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm font-semibold text-foreground">2. Process</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Generate a polished summary bundle and index every sentence.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm font-semibold text-foreground">3. Query</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Search the document instantly and find exact answers without copy-paste.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-accent p-2 text-accent-foreground">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent">Trust</p>
                <h2 className="font-serif mt-3 text-2xl font-semibold text-foreground">Secure document handling, no fluff.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Access controls, encrypted storage, and a product design that treats documents as working assets.
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-background p-5">
                <p className="text-sm font-semibold text-foreground">Encrypted storage</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Documents are stored encrypted at rest and in transit.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-5">
                <p className="text-sm font-semibold text-foreground">Access controls</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Workspace access is scoped and audited for every upload.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-5">
                <p className="text-sm font-semibold text-foreground">Document-first UX</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Designed to keep the document, not the marketing, at the center.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} DocuMind.
        </div>
      </footer>
    </div>
  );
}
