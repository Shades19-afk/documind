import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasSupabaseServerConfig } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!hasSupabaseServerConfig()) {
    return response;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname === "/dashboard" || pathname === "/documents";
  const isAuthRoute = pathname === "/auth/login" || pathname === "/auth/signup";

  if (isProtectedRoute && !data.user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthRoute && data.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard", "/documents", "/auth/login", "/auth/signup"],
};
