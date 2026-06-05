"use client";

import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function DocuMindLanding() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-100">DocuMind</div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-slate-100 hover:text-white">
              <a href="/dashboard">Open workspace</a>
            </Button>
            <Button asChild className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200">
              <a href="/dashboard">Sign in</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Document workflow</p>
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-slate-100">
                Upload a PDF, get a summary bundle, then search every document instantly.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                DocuMind turns a document into a working reference: extract text, build searchable content, and produce clean output for review.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200">
                  <a href="/dashboard">Open workspace</a>
                </Button>
                <a className="text-sm font-medium text-slate-300 hover:text-white" href="#workflow">
                  See workflow
                </a>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-400">Working document output</p>
              <div className="mt-6 space-y-5">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm font-semibold text-slate-100">Summary</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    A concise overview of the document’s core points and decisions.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm font-semibold text-slate-100">Highlights</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
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
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">What happens after upload</p>
              <h2 className="text-3xl font-semibold leading-tight text-slate-100">
                One file, structured output, and instant access to facts.
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-300">
                After upload, DocuMind extracts text, builds a searchable index, and produces a summary bundle your team can use immediately.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm font-semibold text-slate-100">1. Ingest</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Extract text, tables, and structure from PDFs and scanned documents.
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm font-semibold text-slate-100">2. Process</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Generate a polished summary bundle and index every sentence.
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm font-semibold text-slate-100">3. Query</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Search the document instantly and find exact answers without copy-paste.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-slate-800 p-2 text-slate-100">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Trust</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-100">Secure document handling, no fluff.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                  Access controls, encrypted storage, and a product design that treats documents as working assets.
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="rounded-[24px] border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-slate-100">Encrypted storage</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Documents are stored encrypted at rest and in transit.
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-slate-100">Access controls</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Workspace access is scoped and audited for every upload.
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm font-semibold text-slate-100">Document-first UX</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Designed to keep the document, not the marketing, at the center.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
          © {new Date().getFullYear()} DocuMind.
        </div>
      </footer>
    </div>
  );
}
