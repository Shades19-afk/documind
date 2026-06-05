"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createBrowserSupabaseClient() {
  if (browserClient) {
    return browserClient;
  }

  const { url, anonKey } = getSupabasePublicConfig();

  // Temporary debug logs to trace runtime env and client creation during development
  try {
    // Log presence of env vars (do not log full keys)
    // These will be visible in the browser console when running locally
    // eslint-disable-next-line no-console
    console.log('[supabase-client] NEXT_PUBLIC_SUPABASE_URL present:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    // eslint-disable-next-line no-console
    console.log('[supabase-client] NEXT_PUBLIC_SUPABASE_ANON_KEY present:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    // eslint-disable-next-line no-console
    console.log('[supabase-client] resolved url:', url ? url : null);
    // eslint-disable-next-line no-console
    console.log('[supabase-client] anonKey present (masked):', anonKey ? '***' : null);
  } catch (e) {
    // ignore logging errors
  }

  if (!url || !anonKey) {
    // eslint-disable-next-line no-console
    console.warn('[supabase-client] createBrowserSupabaseClient returning null because url or anonKey is missing');
    return null;
  }

  browserClient = createBrowserClient(url, anonKey);
  // eslint-disable-next-line no-console
  console.log('[supabase-client] created browser supabase client');
  return browserClient;
}

export function getBrowserSupabaseClient() {
  return createBrowserSupabaseClient();
}
