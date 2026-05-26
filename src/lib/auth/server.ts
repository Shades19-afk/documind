import { NextResponse } from "next/server";
import { hasSupabaseServerConfig } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export function isMissingSupabaseConfigurationError(error: unknown) {
  return error instanceof Error && error.message.includes("Missing Supabase");
}

export async function getAuthenticatedUser() {
  if (!hasSupabaseServerConfig()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return {
      user: data.user,
      supabase,
    };
  } catch (error) {
    if (isMissingSupabaseConfigurationError(error)) {
      return null;
    }

    throw error;
  }
}

export function unauthorizedJsonResponse() {
  return NextResponse.json(
    { error: "Authentication required." },
    { status: 401 }
  );
}
