"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LogOut, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const displayName = useMemo(() => {
    return user?.user_metadata?.display_name || user?.email || "DocuMind user";
  }, [user]);

  const email = user?.email ?? "";

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={() => setOpen((current) => !current)}
      >
        <UserCircle2 className="mr-2 h-4 w-4" />
        {displayName}
      </Button>

      {open ? (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl border border-border bg-card p-3">
          <p className="text-sm font-semibold text-foreground">{displayName}</p>
          <p className="mt-1 text-sm text-muted-foreground">{email}</p>
          <div className="mt-4 space-y-2">
            <Link
              href="/documents"
              className="block rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-accent hover:text-accent-foreground"
              onClick={() => setOpen(false)}
            >
              View documents
            </Link>
            <Link
              href="/dashboard"
              className="block rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-accent hover:text-accent-foreground"
              onClick={() => setOpen(false)}
            >
              Open dashboard
            </Link>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
