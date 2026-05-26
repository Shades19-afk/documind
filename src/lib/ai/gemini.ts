import { GoogleGenerativeAI } from "@google/generative-ai";
import { createAiError } from "./errors";

const FALLBACK_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const AI_TIMEOUT_MS = 30000;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw createAiError("GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY is not configured.");
  }

  return new GoogleGenerativeAI(apiKey);
}

function sanitizeText(text: string, maxLength = 120000) {
  const cleaned = text.replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
  return cleaned.slice(0, maxLength);
}

function logAiFailure(error: unknown, context: string) {
  const failure = error instanceof Error && "failure" in error ? (error as Error & { failure?: unknown }).failure : undefined;
  console.error(`[DocuMind AI] ${context}`, failure ?? error);
}

function withAiTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(createAiError(`AI request timed out after ${AI_TIMEOUT_MS}ms.`));
      }, AI_TIMEOUT_MS);
    }),
  ]);
}

export async function generateText(prompt: string) {
  try {
    const client = getClient();
    const model = client.getGenerativeModel({ model: FALLBACK_MODEL });
    const response = await withAiTimeout(model.generateContent(prompt));
    return response.response.text().trim();
  } catch (error) {
    logAiFailure(error, "generateContent failed");
    throw createAiError(error);
  }
}

export async function streamText(prompt: string, onChunk: (chunk: string) => void) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: FALLBACK_MODEL });

  try {
    const result = await withAiTimeout(model.generateContentStream(prompt));
    let fullText = "";

    for await (const chunk of result.stream) {
      const text = chunk.text().trim();

      if (!text) {
        continue;
      }

      fullText += text;
      onChunk(text);
    }

    return fullText;
  } catch (error) {
    logAiFailure(error, "stream generateContent failed");
    throw createAiError(error);
  }
}

export function clampText(text: string, maxLength = 18000) {
  return sanitizeText(text, maxLength);
}
