"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createBrowserSupabaseClient() {
  if (browserClient) {
    return browserClient;
  }

  const { url, anonKey } = getSupabasePublicConfig();

  if (!url || !anonKey) {
    return null;
  }

  browserClient = createBrowserClient(url, anonKey);
  return browserClient;
}

export function getBrowserSupabaseClient() {
  return createBrowserSupabaseClient();
}
