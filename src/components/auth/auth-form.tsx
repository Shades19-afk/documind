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
    <Card className="border-border bg-card">
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-accent">DocuMind</p>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            {mode === "login" ? "Welcome back" : "Create your DocuMind workspace"}
          </h1>
          <p className="text-sm text-muted-foreground">{helperText}</p>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit(email, password, displayName || undefined);
          }}
        >
          {mode === "signup" ? (
            <label className="block text-sm text-foreground">
              <span className="mb-2 block">Display name</span>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Jordan Lee"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 outline-none placeholder:text-muted-foreground"
              />
            </label>
          ) : null}

          <label className="block text-sm text-foreground">
            <span className="mb-2 block">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@company.com"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 outline-none placeholder:text-muted-foreground"
            />
          </label>

          <label className="block text-sm text-foreground">
            <span className="mb-2 block">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 outline-none placeholder:text-muted-foreground"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-foreground">
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            {mode === "login" ? "Need an account?" : "Already have an account?"}
          </span>
          <Link
            href={mode === "login" ? "/auth/signup" : "/auth/login"}
            className="text-accent transition hover:text-accent/80"
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
