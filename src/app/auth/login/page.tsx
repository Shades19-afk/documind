"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/lib/auth/context";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),transparent_28%),linear-gradient(180deg,#09090b_0%,#111827_100%)] text-white">
        <p className="text-sm text-slate-200">Loading your account…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),transparent_28%),linear-gradient(180deg,#09090b_0%,#111827_100%)] px-4 py-10 text-white">
      <div className="w-full max-w-md">
        <AuthForm
          mode="login"
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          onSubmit={async (email, password) => {
            setIsSubmitting(true);
            setErrorMessage(null);

            try {
              await signIn(email, password);
              router.replace("/dashboard");
            } catch (error) {
              const message = error instanceof Error ? error.message : "Unable to sign in.";
              setErrorMessage(message);
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
      </div>
    </div>
  );
}
