import { NextRequest, NextResponse } from "next/server";
import { generateDocumentSummary } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.documentText !== "string" || body.documentText.trim().length === 0) {
      return NextResponse.json({ error: "documentText is required." }, { status: 400 });
    }

    const summary = await generateDocumentSummary(body.documentText);

    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Summary generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
