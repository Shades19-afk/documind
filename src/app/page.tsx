"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function DocuMindLanding() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [statsProgress, setStatsProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const statsBand = document.getElementById("stats");
    if (!statsBand) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(statsBand);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) {
      return;
    }

    const startTime = performance.now();
    let animationFrame = 0;
    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / 800, 1);
      setStatsProgress(progress);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [statsVisible]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={`sticky top-0 z-50 border-b-2 bg-background transition-colors ${
          hasScrolled ? "border-border" : "border-border/80"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <a href="#product" className="font-serif text-lg font-semibold text-foreground">
            DocuMind
          </a>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            <a className="text-sm font-medium text-foreground transition hover:text-accent" href="#product">
              Product
            </a>
            <a className="text-sm font-medium text-foreground transition hover:text-accent" href="/how-it-works">
              How it works
            </a>
            <a className="text-sm font-medium text-foreground transition hover:text-accent" href="/pricing">
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
        <section id="product" className="grid w-full grid-cols-1 bg-card md:grid-cols-2">
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
              <h1 className="font-serif text-3xl font-semibold leading-tight text-foreground">
                DocuMind is for anyone drowning in contracts, research papers, or reports.
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                When every answer is buried in another long document, DocuMind turns the pile into a clear, searchable reference so you can spend less time hunting and more time deciding.
              </p>
              <p className="border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">
                “5–10 min saved on a typical 20-page first pass.”
              </p>
            </div>
          </div>
        </section>

        <section id="stats" className="w-full bg-secondary">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-6 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex flex-col items-center justify-center px-6 py-5 text-center sm:py-2">
              <p className="font-serif tabular-nums text-4xl font-semibold text-foreground">
                under {Math.round(statsProgress * 30)}s
              </p>
              <p className="mt-2 text-sm text-muted-foreground">from upload to a first summary</p>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-5 text-center sm:py-2">
              <p className="font-serif tabular-nums text-4xl font-semibold text-foreground">
                {Math.round(statsProgress * 5)}–10 min
              </p>
              <p className="mt-2 text-sm text-muted-foreground">saved on a typical 20-page first pass</p>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-5 text-center sm:py-2">
              <p className="font-serif tabular-nums text-4xl font-semibold text-foreground">
                {Math.round(statsProgress * 3)} outputs
              </p>
              <p className="mt-2 text-sm text-muted-foreground">summary, notes, and flashcards per document</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr,1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-medium text-accent">Built for useful output</p>
              <h2 className="font-serif mt-3 text-3xl font-semibold leading-tight text-foreground">
                Everything you need to turn documents into working knowledge.
              </h2>
            </div>
            <div className="border-t border-border">
              <div className="grid gap-2 border-b border-l-2 border-transparent py-8 transition-colors hover:border-l-destructive sm:grid-cols-[2rem,minmax(10rem,0.4fr),1fr] sm:gap-4">
                <p className="font-mono text-xs text-destructive">01</p>
                <p className="text-base font-medium text-foreground">PDF summarization</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Get a concise, readable overview of long PDFs without losing the document’s central argument.
                </p>
              </div>
              <div className="grid gap-2 border-b border-l-2 border-transparent py-8 transition-colors hover:border-l-destructive sm:grid-cols-[2rem,minmax(10rem,0.4fr),1fr] sm:gap-4">
                <p className="font-mono text-xs text-destructive">02</p>
                <p className="text-base font-medium text-foreground">Key point extraction</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Pull out decisions, evidence, action items, and passages worth revisiting.
                </p>
              </div>
              <div className="grid gap-2 border-b border-l-2 border-transparent py-8 transition-colors hover:border-l-destructive sm:grid-cols-[2rem,minmax(10rem,0.4fr),1fr] sm:gap-4">
                <p className="font-mono text-xs text-destructive">03</p>
                <p className="text-base font-medium text-foreground">Flashcard generation</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Turn the important ideas in a document into focused prompts for review and recall.
                </p>
              </div>
              <div className="grid gap-2 border-b border-l-2 border-transparent py-8 transition-colors hover:border-l-destructive sm:grid-cols-[2rem,minmax(10rem,0.4fr),1fr] sm:gap-4">
                <p className="font-mono text-xs text-destructive">04</p>
                <p className="text-base font-medium text-foreground">Export formats</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Take your summaries, notes, and flashcards with you in clean formats suited to your workflow.
                </p>
              </div>
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
            <div className="border-t border-border">
              <div className="grid gap-2 border-b border-l-2 border-transparent py-8 transition-colors hover:border-l-destructive sm:grid-cols-[2rem,minmax(10rem,0.4fr),1fr] sm:gap-4">
                <p className="font-mono text-xs text-destructive">01</p>
                <p className="text-base font-medium text-foreground">Ingest</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Extract text, tables, and structure from PDFs and scanned documents.
                </p>
              </div>
              <div className="grid gap-2 border-b border-l-2 border-transparent py-8 transition-colors hover:border-l-destructive sm:grid-cols-[2rem,minmax(10rem,0.4fr),1fr] sm:gap-4">
                <p className="font-mono text-xs text-destructive">02</p>
                <p className="text-base font-medium text-foreground">Process</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Generate a polished summary bundle and index every sentence.
                </p>
              </div>
              <div className="grid gap-2 border-b border-l-2 border-transparent py-8 transition-colors hover:border-l-destructive sm:grid-cols-[2rem,minmax(10rem,0.4fr),1fr] sm:gap-4">
                <p className="font-mono text-xs text-destructive">03</p>
                <p className="text-base font-medium text-foreground">Query</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Search the document instantly and find exact answers without copy-paste.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr,1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-medium text-accent">Trust</p>
              <h2 className="font-serif mt-3 text-2xl font-semibold text-foreground">Secure document handling, no fluff.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                Access controls, encrypted storage, and a product design that treats documents as working assets.
              </p>
            </div>
            <div className="border-t border-border">
              <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[minmax(10rem,0.4fr),1fr] sm:gap-8">
                <p className="text-sm font-semibold text-foreground">01. Encrypted storage</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Documents are stored encrypted at rest and in transit.
                </p>
              </div>
              <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[minmax(10rem,0.4fr),1fr] sm:gap-8">
                <p className="text-sm font-semibold text-foreground">02. Access controls</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Workspace access is scoped and audited for every upload.
                </p>
              </div>
              <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[minmax(10rem,0.4fr),1fr] sm:gap-8">
                <p className="text-sm font-semibold text-foreground">03. Document-first UX</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Designed to keep the document, not the marketing, at the center.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-[1.3fr,2fr]">
          <div>
            <a href="#product" className="font-serif text-lg font-semibold text-foreground">
              DocuMind
            </a>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Turn long documents into clear, searchable working knowledge.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Product</p>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <a className="block hover:text-foreground" href="/how-it-works">How it works</a>
                <a className="block hover:text-foreground" href="/pricing">Pricing</a>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Company</p>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <a className="block hover:text-foreground" href="/about">About</a>
                <a className="block hover:text-foreground" href="/contact">Contact</a>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Legal</p>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <a className="block hover:text-foreground" href="/privacy">Privacy</a>
                <a className="block hover:text-foreground" href="/terms">Terms</a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-5 text-sm text-muted-foreground">
            © 2026 DocuMind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
