import { createAiError } from "./errors";

const FALLBACK_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";
const AI_TIMEOUT_MS = 30000;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

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

async function requestText(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw createAiError("OPENROUTER_API_KEY is not configured.");
  }

  const response = await withAiTimeout(
    fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(process.env.NEXT_PUBLIC_BASE_URL ? { "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL } : {}),
        ...(process.env.OPENROUTER_APP_NAME ? { "X-Title": process.env.OPENROUTER_APP_NAME } : {}),
      },
      body: JSON.stringify({
        model: FALLBACK_MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    }),
  );

  const responseText = await response.text();
  let data: unknown;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`OpenRouter returned a non-JSON response (${response.status}): ${responseText}`);
  }

  if (!response.ok) {
    throw new Error(`OpenRouter request failed (${response.status}): ${responseText}`);
  }

  const content =
    typeof data === "object" &&
    data !== null &&
    "choices" in data &&
    Array.isArray(data.choices) &&
    data.choices.length > 0 &&
    typeof data.choices[0] === "object" &&
    data.choices[0] !== null &&
    "message" in data.choices[0] &&
    typeof data.choices[0].message === "object" &&
    data.choices[0].message !== null &&
    "content" in data.choices[0].message &&
    typeof data.choices[0].message.content === "string"
      ? data.choices[0].message.content
      : null;

  if (!content) {
    throw new Error(`OpenRouter response did not include choices[0].message.content: ${responseText}`);
  }

  return content.trim();
}

export async function generateText(prompt: string) {
  try {
    return await requestText(prompt);
  } catch (error) {
    logAiFailure(error, "generateContent failed");
    throw createAiError(error);
  }
}

export async function streamText(prompt: string, onChunk: (chunk: string) => void) {
  try {
    const text = await requestText(prompt);
    onChunk(text);
    return text;
  } catch (error) {
    logAiFailure(error, "stream generateContent failed");
    throw createAiError(error);
  }
}

export function clampText(text: string, maxLength = 18000) {
  return sanitizeText(text, maxLength);
}
