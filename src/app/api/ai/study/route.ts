import { NextRequest, NextResponse } from "next/server";
import { generateStudyPackage } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.documentText !== "string" || body.documentText.trim().length === 0) {
      return NextResponse.json({ error: "documentText is required." }, { status: 400 });
    }

    const studyPackage = await generateStudyPackage(body.documentText);

    return NextResponse.json(studyPackage);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Study package generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
