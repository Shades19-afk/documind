"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Check,
  Shield,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { motion } from "framer-motion";

const featureCards = [
  {
    icon: UploadCloud,
    title: "Upload and organize",
    description:
      "Bring PDFs and documents into one secure workspace with fast, intuitive uploads.",
  },
  {
    icon: Sparkles,
    title: "Summarize instantly",
    description:
      "Extract key points, create concise summaries, and uncover insights in seconds.",
  },
  {
    icon: BarChart3,
    title: "Track every workflow",
    description:
      "See upload status, review progress, and document activity from one command center.",
  },
];

const workflowSteps = [
  "Upload a PDF or document into your AI workspace",
  "Let DocuMind extract and organize the content",
  "Search, summarize, and collaborate with confidence",
];

export default function DocuMindLanding() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),transparent_30%),linear-gradient(180deg,#09090b_0%,#111827_100%)] text-gray-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-indigo-500/20 p-2 text-indigo-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-indigo-100">DOCUMIND</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
            <a className="transition hover:text-white" href="#features">
              Features
            </a>
            <a className="transition hover:text-white" href="#workflow">
              Workflow
            </a>
            <a className="transition hover:text-white" href="#security">
              Security
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-slate-100 hover:text-white">
              <a href="/dashboard">Sign in</a>
            </Button>
            <Button asChild className="bg-indigo-500 hover:bg-indigo-400">
              <a href="/dashboard">Start for free</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center lg:pb-20 lg:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-100">
                <Sparkles className="h-4 w-4" />
                AI document intelligence for modern teams
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Turn scattered documents into clear answers.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                DocuMind brings uploads, summaries, search, and secure review into one elegant workspace so your team can move faster and stay aligned.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-indigo-500 hover:bg-indigo-400">
                  <a href="/dashboard">
                    Open dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  <a href="/documents">Browse library</a>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-200">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" />
                  Secure document handling
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" />
                  Built for fast decision-making
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <div className="rounded-[22px] border border-indigo-300/20 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Live workspace</p>
                    <p className="mt-2 text-2xl font-semibold">14 documents ready</p>
                  </div>
                  <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-200">
                    AI-ready
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    { label: "Summaries generated", value: "32" },
                    { label: "Uploads processed", value: "8" },
                    { label: "Questions answered", value: "76" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
                    >
                      <span className="text-sm text-slate-200">{item.label}</span>
                      <span className="font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-6 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-200/85">Why teams choose DocuMind</p>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">A cleaner, faster way to work with documents.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              Replace scattered tools and repetitive review cycles with one modern workspace built for clarity, security, and speed.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-100">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <div className="grid gap-6 lg:grid-cols-[0.85fr,1.15fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-200/85">How it works</p>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">From upload to insight in three simple steps.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                DocuMind is designed to keep your document flow effortless, from first upload to final decision-ready insight.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-5"
                >
                  <p className="text-sm text-indigo-200">0{index + 1}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-100">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="mx-auto max-w-6xl px-6 pb-20 pt-4">
          <div className="grid gap-6 rounded-[28px] border border-white/10 bg-white/5 p-8 md:grid-cols-[1fr,0.9fr] md:p-10">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-200/85">Trust and control</p>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Built for secure document workflows.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Keep your documents protected with privacy-first design, strong access boundaries, and a workspace that is purpose-built for enterprise-ready operations.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-100">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-300" />
                  Role-aware access controls
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-300" />
                  Secure handling for every upload
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-300" />
                  Privacy-first AI workflows
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-indigo-200" />
                <p className="text-sm font-semibold text-white">Secure by design</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                DocuMind keeps document review structured, compliant, and easy to trust — whether your team is moving fast or operating under strict oversight.
              </p>
            </div>
          </div>
        </section>

        <section id="cta" className="mx-auto max-w-5xl px-6 pb-20">
          <div className="rounded-[28px] border border-indigo-300/30 bg-indigo-500/10 px-6 py-10 text-center sm:px-10">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Ready to launch</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Make your document operations feel effortless.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-200">
              Start with DocuMind today and turn documents into clear workflows, faster answers, and better decisions.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" className="bg-indigo-500 hover:bg-indigo-400">
                <a href="/dashboard">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} DocuMind. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a className="transition hover:text-white" href="#">
              Privacy
            </a>
            <a className="transition hover:text-white" href="#">
              Terms
            </a>
            <a className="transition hover:text-white" href="#">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
