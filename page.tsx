"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Search, Zap } from "lucide-react";

export default function DocuMindLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            {/* Wordmark — no icon needed, letterform is enough */}
            <span className="font-serif text-xl tracking-tight">DocuMind</span>
            <span className="hidden rounded-sm bg-[var(--accent-rust)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-white sm:block">
              BETA
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <a href="#how-it-works" className="hover:text-foreground">How it works</a>
            <a href="#features" className="hover:text-foreground">Features</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign in
            </a>
            <a
              href="/auth/signup"
              className="rounded-sm bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6">
            {/* Two-column editorial layout — headline left, detail right */}
            <div className="grid min-h-[72vh] grid-cols-1 gap-0 lg:grid-cols-[1fr_400px]">

              {/* Left: headline */}
              <div className="flex flex-col justify-center border-b border-border py-16 lg:border-b-0 lg:border-r lg:pr-12">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-fade-up">
                  Document intelligence
                </p>
                <h1 className="mt-5 text-5xl text-foreground animate-fade-up-delay-1 sm:text-6xl lg:text-7xl">
                  Turn PDFs into<br />
                  <em className="text-[var(--accent-rust)] not-italic">working knowledge.</em>
                </h1>
                <p className="mt-6 max-w-md text-base text-muted-foreground animate-fade-up-delay-2">
                  Upload a document, get summaries, key points, study notes,
                  and flashcards — ready to export. No subscriptions,
                  no bloat.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-up-delay-3">
                  <a
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 rounded-sm bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
                  >
                    Upload your first PDF
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    See how it works
                  </a>
                </div>
              </div>

              {/* Right: sample output card — shows the actual product */}
              <div className="flex items-center py-12 lg:pl-12">
                <div className="w-full">
                  <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          Sample output
                        </p>
                        <p className="mt-1 text-sm font-medium">Q3 Product Strategy.pdf</p>
                      </div>
                      <span className="rounded-sm bg-green-100 px-2 py-0.5 font-mono text-[10px] text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Ready
                      </span>
                    </div>

                    <div className="rule mt-4 pt-4">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Summary</p>
                      <p className="mt-1.5 text-sm text-foreground leading-relaxed">
                        The Q3 strategy document prioritises three growth vectors:
                        enterprise onboarding, API expansion, and reducing
                        time-to-value for self-serve users.
                      </p>
                    </div>

                    <div className="rule mt-4 pt-4">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Key points</p>
                      <ul className="mt-2 space-y-1">
                        {["Enterprise deals targeted at $50k+ ACV", "API v2 ships mid-August", "Onboarding funnel redesign underway"].map(p => (
                          <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-rust)]" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rule mt-4 pt-4 flex gap-2">
                      {["Flashcards", "Study notes", "Export"].map(tag => (
                        <span key={tag} className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stat row */}
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    {[
                      { n: "18", label: "pages" },
                      { n: "6", label: "key points" },
                      { n: "12", label: "flashcards" },
                    ].map(({ n, label }) => (
                      <div key={label} className="rounded-sm border border-border bg-card py-3">
                        <p className="font-serif text-2xl text-foreground">{n}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section id="how-it-works" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_1fr]">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Process</p>
                <h2 className="mt-3 text-3xl text-foreground">Three steps.</h2>
              </div>
              <div className="grid gap-0 sm:grid-cols-3">
                {[
                  {
                    n: "01",
                    icon: <FileText className="h-5 w-5" />,
                    title: "Upload",
                    body: "Drop any PDF — research papers, legal contracts, lecture notes. Up to 25 MB.",
                  },
                  {
                    n: "02",
                    icon: <Zap className="h-5 w-5" />,
                    title: "Process",
                    body: "Text is extracted, chunked, and sent to Gemini. A study package is generated in seconds.",
                  },
                  {
                    n: "03",
                    icon: <Search className="h-5 w-5" />,
                    title: "Use",
                    body: "Read the summary, review flashcards, export notes as Markdown, JSON, or plain text.",
                  },
                ].map(({ n, icon, title, body }, i) => (
                  <div
                    key={n}
                    className={`px-8 py-8 ${i < 2 ? "border-b border-border sm:border-b-0 sm:border-r" : ""}`}
                  >
                    <p className="font-mono text-xs text-muted-foreground">{n}</p>
                    <div className="mt-4 text-[var(--accent-rust)]">{icon}</div>
                    <p className="mt-3 font-medium text-foreground">{title}</p>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Features grid ────────────────────────────────────── */}
        <section id="features" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_1fr]">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Features</p>
                <h2 className="mt-3 text-3xl text-foreground">What you get.</h2>
              </div>
              <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
                {[
                  {
                    title: "AI summaries",
                    body: "3–5 sentence overview plus a detailed two-paragraph summary. Dense documents, clear output.",
                  },
                  {
                    title: "Flashcard generation",
                    body: "Up to 8 question/answer pairs extracted from key concepts. Export-ready for Anki or manual study.",
                  },
                  {
                    title: "Section breakdowns",
                    body: "Per-section summaries with headings, so you can navigate long documents without reading cover-to-cover.",
                  },
                  {
                    title: "Export formats",
                    body: "Markdown, plain text, or JSON. Pipe to your notes app, LLM pipeline, or build tool.",
                  },
                  {
                    title: "Retry resilience",
                    body: "If AI generation hits a quota limit, your extracted text is preserved and retry is one click away.",
                  },
                  {
                    title: "Secure by default",
                    body: "Documents are user-scoped with Supabase RLS. Nobody sees your files but you.",
                  },
                ].map(({ title, body }) => (
                  <div key={title} className="bg-background p-8">
                    <p className="font-medium text-foreground">{title}</p>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section>
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-4xl text-foreground sm:text-5xl">
                  Ready to stop<br />skimming PDFs?
                </h2>
                <p className="mt-4 text-base text-muted-foreground">
                  Free to try. No credit card.
                </p>
              </div>
              <a
                href="/auth/signup"
                className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-foreground px-8 py-4 text-sm font-medium text-background hover:opacity-90"
              >
                Upload a document now
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
          <span className="font-serif">DocuMind</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
