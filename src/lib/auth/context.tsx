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
        // Log client state for debugging
        // eslint-disable-next-line no-console
        console.log('[auth-context] signIn called. Client exists:', !!client);
        
        if (!client) {
          // Debug log: client missing at runtime
          try {
            // eslint-disable-next-line no-console
            console.error(
              '[auth] signIn called but Supabase client is null. NEXT_PUBLIC_SUPABASE_URL present:',
              !!process.env.NEXT_PUBLIC_SUPABASE_URL,
              'anon present:',
              !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              'publishable present:',
              !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            );
          } catch (e) {}
          throw new Error(
            `[auth] Supabase client missing at runtime. NEXT_PUBLIC_SUPABASE_URL=${!!process.env.NEXT_PUBLIC_SUPABASE_URL}, NEXT_PUBLIC_SUPABASE_ANON_KEY=${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${!!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
          );
        }

        const response = await client.auth.signInWithPassword({ email, password });
        
        // eslint-disable-next-line no-console
        console.log('[auth-context] signIn response:', { error: response.error?.message, user: response.data?.user?.id });

        if (response.error) {
          throw response.error;
        }
      },
      signUp: async (email, password, displayName) => {
        // Log client state for debugging
        // eslint-disable-next-line no-console
        console.log('[auth-context] signUp called. Client exists:', !!client);
        
        if (!client) {
          // Debug log: client missing at runtime
          try {
            // eslint-disable-next-line no-console
            console.error(
              '[auth] signUp called but Supabase client is null. NEXT_PUBLIC_SUPABASE_URL present:',
              !!process.env.NEXT_PUBLIC_SUPABASE_URL,
              'anon present:',
              !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              'publishable present:',
              !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            );
          } catch (e) {}
          throw new Error(
            `[auth] Supabase client missing at runtime. NEXT_PUBLIC_SUPABASE_URL=${!!process.env.NEXT_PUBLIC_SUPABASE_URL}, NEXT_PUBLIC_SUPABASE_ANON_KEY=${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${!!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
          );
        }

        const response = await client.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName ?? null,
            },
          },
        });

        // eslint-disable-next-line no-console
        console.log('[auth-context] signUp response:', { error: response.error?.message, user: response.data?.user?.id });
        
        if (response.error) {
          throw response.error;
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
