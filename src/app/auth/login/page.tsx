"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
            } catch (error: any) {
              try {
                // preserve raw error for debugging
                // eslint-disable-next-line no-console
                console.error('[auth-login] REAL AUTH ERROR OBJECT:', error);
                // eslint-disable-next-line no-console
                console.error('[auth-login] error type:', error?.constructor?.name);
                // eslint-disable-next-line no-console
                console.error('[auth-login] error message:', error instanceof Error ? error.message : String(error));
              } catch (e) {}

              const code = error?.code ?? error?.error?.code ?? null;
              const status = error?.status ?? error?.statusCode ?? null;

              if (code === 'over_email_send_rate_limit' || status === 429 || /rate limit/i.test(String(error?.message ?? '')) ) {
                setErrorMessage('Too many signup attempts. Please wait a few minutes before trying again.');
              } else {
                const message = error instanceof Error ? error.message : 'Unable to sign in.';
                setErrorMessage(message);
              }
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
        <div className="mt-4 text-center text-sm text-slate-300">
          <Link href="/" className="text-indigo-100 transition hover:text-white">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
