"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function DocuMindLanding() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={`sticky top-0 z-50 border-b bg-background/95 transition-colors ${
          hasScrolled ? "border-border" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#product" className="font-serif text-lg font-semibold text-foreground">
            DocuMind
          </a>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            <a className="text-sm text-muted-foreground transition hover:text-foreground" href="#product">
              Product
            </a>
            <a className="text-sm text-muted-foreground transition hover:text-foreground" href="#how-it-works">
              How it works
            </a>
            <a className="text-sm text-muted-foreground transition hover:text-foreground" href="#pricing">
              Pricing
            </a>
          </nav>
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
        <section id="product" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
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
                <a className="text-sm font-medium text-muted-foreground hover:text-foreground" href="#how-it-works">
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

        <section className="w-full bg-secondary">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-6 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex flex-col items-center justify-center px-6 py-5 text-center sm:py-2">
              <p className="font-serif tabular-nums text-4xl font-semibold text-foreground">under 30s</p>
              <p className="mt-2 text-sm text-muted-foreground">from upload to a first summary</p>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-5 text-center sm:py-2">
              <p className="font-serif tabular-nums text-4xl font-semibold text-foreground">5–10 min</p>
              <p className="mt-2 text-sm text-muted-foreground">saved on a typical 20-page first pass</p>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-5 text-center sm:py-2">
              <p className="font-serif tabular-nums text-4xl font-semibold text-foreground">3 outputs</p>
              <p className="mt-2 text-sm text-muted-foreground">summary, notes, and flashcards per document</p>
            </div>
          </div>
        </section>

        <section className="grid w-full grid-cols-1 bg-card md:grid-cols-2">
          <div className="relative min-h-[360px] md:min-h-[480px]">
            <Image
              src="/images/annotated-document.jpg"
              alt="An annotated document ready for review"
              width={112}
              height={160}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center px-6 py-16 sm:px-12 lg:px-20">
            <div className="max-w-xl space-y-6">
              <p className="text-sm font-medium text-accent">For the document-heavy days</p>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-foreground">
                DocuMind is for anyone drowning in contracts, research papers, or reports.
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                When every answer is buried in another long document, DocuMind turns the pile into a clear, searchable reference so you can spend less time hunting and more time deciding.
              </p>
              <p className="border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">
                “5–10 min saved on a typical 20-page first pass.”
              </p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16">
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

        <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
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
