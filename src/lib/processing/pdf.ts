import path from "path";
import { pathToFileURL } from "url";
import * as pdfParse from "pdf-parse";
import { ProcessingError } from "./errors";

const pdfWorkerUrl = pathToFileURL(
  path.resolve(process.cwd(), "node_modules/pdf-parse/dist/worker/pdf.worker.mjs")
).href;
const EXTRACTION_TIMEOUT_MS = 15000;

pdfParse.PDFParse.setWorker(pdfWorkerUrl);

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
}

function withExtractionTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new ProcessingError(`Timed out while extracting text from the uploaded PDF.`, "PDF_PARSE_TIMEOUT"));
      }, EXTRACTION_TIMEOUT_MS);
    }),
  ]);
}

export async function extractTextFromPdf(buffer: Buffer): Promise<PdfExtractionResult> {
  if (!Buffer.isBuffer(buffer)) {
    throw new ProcessingError("The uploaded PDF is not stored in a readable buffer.", "INVALID_BUFFER");
  }

  const bufferSize = buffer.length;
  const binaryHeader = buffer.subarray(0, 8).toString("latin1");

  console.log("[DocuMind extraction] start", {
    bufferSize,
    binaryHeader,
    workerUrl: pdfWorkerUrl,
  });

  try {
    const parser = new pdfParse.PDFParse({ data: buffer });

    console.log("[DocuMind extraction] invoking pdf-parse", {
      bufferSize,
      workerUrl: pdfWorkerUrl,
    });

    const result = await withExtractionTimeout(parser.getText());
    const resultWithPageMetadata = result as typeof result & { numpages?: number };
    const pageCount = Number(result.total ?? resultWithPageMetadata.numpages ?? 0);

    console.log("[DocuMind extraction] completion", {
      bufferSize,
      textLength: result.text?.length ?? 0,
      pageCount,
      total: result.total,
      numpages: resultWithPageMetadata.numpages,
    });

    if (!result.text || result.text.trim().length === 0) {
      throw new ProcessingError("The uploaded PDF does not contain extractable text.", "EMPTY_PDF");
    }

    return {
      text: result.text,
      pageCount,
    };
  } catch (error) {
    if (error instanceof ProcessingError) {
      console.error("[DocuMind extraction] failed", {
        code: error.code,
        message: error.message,
      });
      throw error;
    }

    const cause = error instanceof Error ? error.message : "Unknown PDF parse error.";
    console.error("[DocuMind extraction] failed", {
      code: "PDF_PARSE_ERROR",
      message: cause,
    });
    throw new ProcessingError(`Failed to extract text from the uploaded PDF: ${cause}`, "PDF_PARSE_ERROR");
  }
}
