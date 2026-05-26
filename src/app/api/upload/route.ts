import { NextRequest, NextResponse } from "next/server";
import { createPersistedDocument, processDocumentText, updateDocumentState } from "@/lib/database/documents";
import { getAuthenticatedUser, unauthorizedJsonResponse } from "@/lib/auth/server";
import { extractTextFromPdf } from "@/lib/processing/pdf";
import { validatePdfUpload } from "@/lib/processing/validators";

export async function POST(request: NextRequest) {
  try {
    const authenticated = await getAuthenticatedUser();

    if (!authenticated) {
      return unauthorizedJsonResponse();
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A PDF file is required." }, { status: 400 });
    }

    validatePdfUpload(file);

    const document = await createPersistedDocument({
      userId: authenticated.user.id,
      filename: file.name,
      mimeType: file.type || "application/pdf",
      sizeBytes: file.size,
    });

    console.log("[DocuMind upload] persisted document record", {
      documentId: document.id,
      filename: document.filename,
      status: document.status,
      pageCount: document.page_count,
    });

    const buffer = Buffer.from(await file.arrayBuffer());

    await updateDocumentState(document.id, "processing", "Extracting and chunking", 1);

    try {
      const extraction = await extractTextFromPdf(buffer);

      console.log("[DocuMind upload] extraction succeeded", {
        documentId: document.id,
        pageCount: extraction.pageCount,
        textLength: extraction.text.length,
      });

      void processDocumentText(document.id, extraction.text, extraction.pageCount)
        .then(() => {
          console.log("[DocuMind upload] background generation completed successfully", {
            documentId: document.id,
          });
        })
        .catch(async (error) => {
          const message = error instanceof Error ? error.message : "Processing failed.";

          console.error("[DocuMind upload] background generation failed", {
            documentId: document.id,
            message,
          });

          // Document status is already set to terminal state by processDocumentText
          // This catch block is a safety net for unexpected errors during finalization
          try {
            await updateDocumentState(document.id, "failed", `Generation error: ${message}`, 1);
          } catch {
            // Ignore update failures
          }
        });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to extract text from the uploaded PDF.";

      console.error("[DocuMind upload] extraction failed", {
        documentId: document.id,
        message,
      });

      await updateDocumentState(document.id, "failed", message, 1);
    }

    return NextResponse.json(
      {
        document: {
          id: document.id,
          filename: document.filename,
          mimeType: document.mime_type,
          sizeBytes: document.size_bytes,
          status: document.status,
          pageCount: document.page_count,
          uploadedAt: document.created_at,
          updatedAt: document.updated_at,
        },
        message: "Upload accepted. Processing has been scheduled.",
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Upload route failed.", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unexpected upload error." }, { status: 500 });
  }
}
