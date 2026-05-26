import { NextResponse } from "next/server";
import { getDocumentsForUser } from "@/lib/database/documents";
import { getAuthenticatedUser, unauthorizedJsonResponse } from "@/lib/auth/server";

export async function GET() {
  const authenticated = await getAuthenticatedUser();

  if (!authenticated) {
    return unauthorizedJsonResponse();
  }

  const documents = await getDocumentsForUser(authenticated.user.id);

  return NextResponse.json({ documents });
}
