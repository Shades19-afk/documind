import { NextRequest, NextResponse } from "next/server";
import { getDocumentForUser } from "@/lib/database/documents";
import { getAuthenticatedUser, unauthorizedJsonResponse } from "@/lib/auth/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await getAuthenticatedUser();

  if (!authenticated) {
    return unauthorizedJsonResponse();
  }

  const { id } = await params;
  const document = await getDocumentForUser(authenticated.user.id, id);

  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  return NextResponse.json({ document });
}
