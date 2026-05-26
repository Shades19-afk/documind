export type AiFailureKind = "quota_exceeded" | "rate_limited" | "temporary" | "invalid_response" | "configuration" | "unknown";
export type GenerationFailureStatus = "quota_exceeded" | "retry_pending" | "generation_failed";

export interface AiFailure {
  kind: AiFailureKind;
  status: GenerationFailureStatus;
  retryable: boolean;
  userMessage: string;
  debugMessage: string;
}

class AiError extends Error {
  constructor(public readonly failure: AiFailure) {
    super(failure.debugMessage);
    this.name = "AiError";
  }
}

function extractMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown AI failure.";
}

function isRateLimit(message: string) {
  return /rate limit|rate-limit|429|too many requests|quota|exceeded your current quota|retry after|QUOTA_EXCEEDED|RESOURCE_EXHAUSTED|quota metric|service quota/i.test(message);
}

function isTemporaryFailure(message: string) {
  return /timeout|timed out|network|fetch failed|connection|503|service unavailable|temporar|try again/i.test(message);
}

function isInvalidResponse(message: string) {
  return /invalid payload|invalid response|returned an invalid|malformed|json/i.test(message);
}

function isConfigurationFailure(message: string) {
  return /api key|not configured|missing.*key|GEMINI_API_KEY/i.test(message);
}

export function classifyAiError(error: unknown): AiFailure {
  const message = extractMessage(error).toLowerCase();

  if (isConfigurationFailure(message)) {
    return {
      kind: "configuration",
      status: "generation_failed",
      retryable: false,
      userMessage: "AI generation temporarily unavailable",
      debugMessage: `AI configuration error: ${extractMessage(error)}`,
    };
  }

  // Check quota BEFORE rate limit since rate limit function includes quota keywords
  if (/QUOTA_EXCEEDED|RESOURCE_EXHAUSTED|exceeded your current quota|quota exceeded|quota metric/i.test(message)) {
    return {
      kind: "quota_exceeded",
      status: "quota_exceeded",
      retryable: true,
      userMessage: "Quota exhausted, retry later",
      debugMessage: `AI quota error: ${extractMessage(error)}`,
    };
  }

  if (isRateLimit(message)) {
    return {
      kind: "rate_limited",
      status: "retry_pending",
      retryable: true,
      userMessage: "AI generation temporarily unavailable",
      debugMessage: `AI rate limit error: ${extractMessage(error)}`,
    };
  }

  if (isTemporaryFailure(message)) {
    return {
      kind: "temporary",
      status: "retry_pending",
      retryable: true,
      userMessage: "AI generation temporarily unavailable",
      debugMessage: `Temporary AI service error: ${extractMessage(error)}`,
    };
  }

  if (isInvalidResponse(message)) {
    return {
      kind: "invalid_response",
      status: "generation_failed",
      retryable: true,
      userMessage: "Generation failed, please retry",
      debugMessage: `Invalid AI response: ${extractMessage(error)}`,
    };
  }

  return {
    kind: "unknown",
    status: "generation_failed",
    retryable: true,
    userMessage: "Generation failed, please retry",
    debugMessage: `Unexpected AI failure: ${extractMessage(error)}`,
  };
}

export function createAiError(error: unknown) {
  return new AiError(classifyAiError(error));
}

export function getFriendlyGenerationMessage(message?: string) {
  if (!message) {
    return "Generation failed, please retry";
  }

  const normalized = message.toLowerCase();

  if (/quota|429|too many requests|exceeded your current quota|retry later/i.test(normalized)) {
    return "Quota exhausted, retry later";
  }

  if (/temporar|rate limit|rate-limit|timeout|timed out|fetch failed|503|service unavailable|network/i.test(normalized)) {
    return "AI generation temporarily unavailable";
  }

  if (/invalid payload|invalid response|malformed|json/i.test(normalized)) {
    return "Generation failed, please retry";
  }

  if (/not configured|api key|configuration/i.test(normalized)) {
    return "AI generation temporarily unavailable";
  }

  return message;
}

export function getUserFriendlyStatus(message?: string): GenerationFailureStatus {
  const normalized = message?.toLowerCase() || "";

  if (/quota|429|too many requests|exceeded your current quota/i.test(normalized)) {
    return "quota_exceeded";
  }

  if (/temporar|rate limit|rate-limit|timeout|timed out|503|service unavailable|network|fetch failed/i.test(normalized)) {
    return "retry_pending";
  }

  return "generation_failed";
}
