import { ValidationError } from "./errors";

export const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = new Set(["application/pdf"]);

export function validatePdfUpload(file: File): void {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new ValidationError("Only PDF files are supported.");
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    throw new ValidationError("PDF exceeds the 25 MB upload limit.");
  }
}
