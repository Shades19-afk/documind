import { NextRequest, NextResponse } from "next/server";
import { retryDocumentForUser } from "@/lib/database/documents";
import { getAuthenticatedUser, unauthorizedJsonResponse } from "@/lib/auth/server";

export async function POST(request: NextRequest) {
  try {
    const authenticated = await getAuthenticatedUser();

    if (!authenticated) {
      return unauthorizedJsonResponse();
    }

    const body = await request.json().catch(() => ({}));
    const documentId = typeof body?.documentId === "string" ? body.documentId : undefined;

    if (!documentId) {
      return NextResponse.json({ error: "documentId is required." }, { status: 400 });
    }

    const status = await retryDocumentForUser(authenticated.user.id, documentId);

    return NextResponse.json({
      ...status,
      message: "Document retry has been started.",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unexpected processing error." }, { status: 500 });
  }
}
