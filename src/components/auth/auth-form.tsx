"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (email: string, password: string, displayName?: string) => Promise<void>;
  errorMessage?: string | null;
  isSubmitting?: boolean;
}

export function AuthForm({
  mode,
  onSubmit,
  errorMessage,
  isSubmitting = false,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const submitLabel = mode === "login" ? "Sign in" : "Create account";
  const helperText =
    mode === "login"
      ? "Use your email and password to continue to your workspace."
      : "Create your account to save documents and keep your study history across sessions.";

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-200/80">DocuMind</p>
          <h1 className="text-2xl font-semibold text-white">
            {mode === "login" ? "Welcome back" : "Create your DocuMind workspace"}
          </h1>
          <p className="text-sm text-slate-300">{helperText}</p>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit(email, password, displayName || undefined);
          }}
        >
          {mode === "signup" ? (
            <label className="block text-sm text-slate-200">
              <span className="mb-2 block">Display name</span>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Jordan Lee"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 outline-none placeholder:text-slate-500"
              />
            </label>
          ) : null}

          <label className="block text-sm text-slate-200">
            <span className="mb-2 block">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@company.com"
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 outline-none placeholder:text-slate-500"
            />
          </label>

          <label className="block text-sm text-slate-200">
            <span className="mb-2 block">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 outline-none placeholder:text-slate-500"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-xl border border-rose-300/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-300">
          <span>
            {mode === "login" ? "Need an account?" : "Already have an account?"}
          </span>
          <Link
            href={mode === "login" ? "/auth/signup" : "/auth/login"}
            className="text-indigo-100 transition hover:text-white"
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
