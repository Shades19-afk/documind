import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { assertSupabaseServerEnv } from "./env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { publicConfig } = assertSupabaseServerEnv();

  return createServerClient(publicConfig.url, publicConfig.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The cookie store can be read-only during server rendering.
        }
      },
    },
  });
}

export function createSupabaseServiceRoleClient() {
  const { serviceConfig } = assertSupabaseServerEnv();

  return createClient(serviceConfig.url, serviceConfig.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
