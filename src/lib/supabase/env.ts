export function getSupabasePublicConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

export function getSupabaseServiceConfig() {
  return {
    url: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function hasSupabasePublicConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  );
}

export function hasSupabaseServiceConfig() {
  const serviceUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

  return Boolean(serviceUrl && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasSupabaseServerConfig() {
  return hasSupabasePublicConfig() && hasSupabaseServiceConfig();
}

function requireSupabaseEnv(value: string | undefined, message: string): string {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

export function assertSupabaseServerEnv() {
  const publicConfig = {
    url: requireSupabaseEnv(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      "Missing Supabase public environment variables.",
    ),
    anonKey: requireSupabaseEnv(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      "Missing Supabase public environment variables.",
    ),
  };

  const serviceConfig = {
    url: requireSupabaseEnv(
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
      "Missing Supabase service role environment variables.",
    ),
    serviceRoleKey: requireSupabaseEnv(
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      "Missing Supabase service role environment variables.",
    ),
  };

  return {
    publicConfig,
    serviceConfig,
  };
}
