"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const client = createBrowserSupabaseClient();
  const [loading, setLoading] = useState(() => Boolean(client));

  useEffect(() => {
    if (!client) {
      return;
    }

    let mounted = true;

    void (async () => {
      const response = await client.auth.getSession();

      if (!mounted) {
        return;
      }

      setUser(response.data.session?.user ?? null);
      setLoading(false);
    })();

    const { data: subscription } = client.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (!mounted) {
        return;
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [client]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        if (!client) {
          throw new Error("Supabase is not configured.");
        }

        const { error } = await client.auth.signInWithPassword({ email, password });

        if (error) {
          throw error;
        }
      },
      signUp: async (email, password, displayName) => {
        if (!client) {
          throw new Error("Supabase is not configured.");
        }

        const { error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName ?? null,
            },
          },
        });

        if (error) {
          throw error;
        }
      },
      signOut: async () => {
        if (!client) {
          return;
        }

        await client.auth.signOut();
      },
    }),
    [client, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
