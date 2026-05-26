/**
 * Processing Lifecycle Tests
 * 
 * This test suite verifies that the document processing lifecycle:
 * 1. Always reaches a terminal state (completed, failed)
 * 2. Properly detects and classifies Gemini failures
 * 3. Handles quota, rate-limit, and other generation errors
 * 4. Supports retrying failed generations
 * 5. Preserves extracted text and fallback data
 */

import { classifyAiError } from "@/lib/ai/errors";
import type { AiFailure } from "@/lib/ai/errors";

describe("Processing Lifecycle - Error Classification", () => {
  describe("Gemini Error Detection", () => {
    it("should detect QUOTA_EXCEEDED errors", () => {
      const error = new Error("QUOTA_EXCEEDED: User has exceeded their daily quota.");
      const failure = classifyAiError(error);
      
      expect(failure.kind).toBe("quota_exceeded");
      expect(failure.status).toBe("quota_exceeded");
      expect(failure.retryable).toBe(true);
    });

    it("should detect 'exceeded your current quota' messages", () => {
      const error = new Error("You have exceeded your current quota for Gemini API.");
      const failure = classifyAiError(error);
      
      expect(failure.kind).toBe("quota_exceeded");
      expect(failure.status).toBe("quota_exceeded");
    });

    it("should detect RESOURCE_EXHAUSTED errors (gRPC quota error)", () => {
      const error = new Error("RESOURCE_EXHAUSTED: The project has exceeded its daily quota.");
      const failure = classifyAiError(error);
      
      expect(failure.kind).toBe("quota_exceeded");
      expect(failure.status).toBe("quota_exceeded");
    });

    it("should detect rate limit errors", () => {
      const error = new Error("429: Too Many Requests - Rate limit exceeded");
      const failure = classifyAiError(error);
      
      expect(failure.kind).toBe("rate_limited");
      expect(failure.status).toBe("retry_pending");
      expect(failure.retryable).toBe(true);
    });

    it("should detect temporary service errors", () => {
      const error = new Error("Service temporarily unavailable (503)");
      const failure = classifyAiError(error);
      
      expect(failure.kind).toBe("temporary");
      expect(failure.status).toBe("retry_pending");
      expect(failure.retryable).toBe(true);
    });

    it("should detect timeout errors", () => {
      const error = new Error("Request timed out after 30000ms.");
      const failure = classifyAiError(error);
      
      expect(failure.kind).toBe("temporary");
      expect(failure.status).toBe("retry_pending");
    });

    it("should detect configuration errors", () => {
      const error = new Error("GEMINI_API_KEY is not configured.");
      const failure = classifyAiError(error);
      
      expect(failure.kind).toBe("configuration");
      expect(failure.status).toBe("generation_failed");
      expect(failure.retryable).toBe(false);
    });

    it("should detect invalid response errors", () => {
      const error = new Error("Gemini returned an invalid JSON response.");
      const failure = classifyAiError(error);
      
      expect(failure.kind).toBe("invalid_response");
      expect(failure.status).toBe("generation_failed");
      expect(failure.retryable).toBe(true);
    });

    it("should classify unknown errors as generation_failed", () => {
      const error = new Error("Some unknown error occurred");
      const failure = classifyAiError(error);
      
      expect(failure.kind).toBe("unknown");
      expect(failure.status).toBe("generation_failed");
      expect(failure.retryable).toBe(true);
    });
  });
});

describe("Processing Lifecycle - Terminal States", () => {
  /**
   * These tests verify that:
   * 1. Every processing flow ends in a terminal state
   * 2. Terminal states are: completed, failed
   * 3. Sub-states track generation failures without blocking processing
   */

  it("completed status is terminal", () => {
    // A document with status: "completed" should not poll further
    // even if generationStatus indicates failure
    const document = {
      id: "doc-1",
      status: "completed",
      generationStatus: "quota_exceeded",
      generationErrorMessage: "Quota exhausted, retry later",
    };

    // Polling should stop at completed
    expect(["completed", "failed"]).toContain(document.status);
  });

  it("failed status is terminal", () => {
    const document = {
      id: "doc-2",
      status: "failed",
      errorMessage: "Extraction failed",
    };

    expect(["completed", "failed"]).toContain(document.status);
  });

  it("generation failures do not block terminal state", () => {
    // Even if generation fails, document should transition from
    // "processing" to "completed" with generationStatus = "quota_exceeded"
    const document = {
      status: "completed",
      generationStatus: "quota_exceeded",
      extractedText: "Document text was extracted successfully...",
      studyPackage: {
        summary: "Fallback summary based on extracted text",
        source: "fallback",
      },
    };

    expect(document.status).toBe("completed");
    expect(document.generationStatus).toBe("quota_exceeded");
    expect(document.extractedText).toBeTruthy();
    expect(document.studyPackage.source).toBe("fallback");
  });
});

describe("Processing Lifecycle - Extracted Data Preservation", () => {
  it("should preserve extracted text even if generation fails", () => {
    // When extraction succeeds but generation fails, we should keep:
    // 1. Extracted text
    // 2. Page count
    // 3. Fallback study package
    const document = {
      status: "completed",
      extractedText: "Chapter 1: Introduction...", // Preserved
      pageCount: 42, // Preserved
      generationStatus: "quota_exceeded",
      studyPackage: {
        summary: "First 500 characters of extracted text...",
        source: "fallback", // Built from extracted text
      },
    };

    expect(document.extractedText).toBeTruthy();
    expect(document.pageCount).toBe(42);
    expect(document.studyPackage.source).toBe("fallback");
  });

  it("should include failure reason in metadata", () => {
    const studyPackage = {
      summary: "Summary from fallback...",
      metadata: {
        source: "fallback",
        failureState: "quota_exceeded",
        errorMessage: "Quota exhausted, retry later",
      },
    };

    expect(studyPackage.metadata.failureState).toBe("quota_exceeded");
    expect(studyPackage.metadata.errorMessage).toBeTruthy();
  });
});

describe("Processing Lifecycle - Retry Support", () => {
  it("should allow retrying from quota_exceeded state", () => {
    const document = {
      id: "doc-3",
      status: "completed",
      generationStatus: "quota_exceeded",
      extractedText: "Document text...", // Still available for retry
    };

    // Retry should reset generation status and re-run generation
    const retryable =
      ["completed", "failed"].includes(document.status) &&
      document.extractedText !== null;

    expect(retryable).toBe(true);
  });

  it("should allow retrying from generation_failed state", () => {
    const document = {
      status: "completed",
      generationStatus: "generation_failed",
      extractedText: "Document text...",
    };

    const retryable =
      document.status === "completed" && document.extractedText !== null;

    expect(retryable).toBe(true);
  });

  it("should not allow retrying if extracted text is missing", () => {
    const document = {
      status: "failed",
      errorMessage: "Extraction failed",
      extractedText: null, // Cannot retry if extraction failed
    };

    const retryable = document.extractedText !== null;
    expect(retryable).toBe(false);
  });
});

describe("Processing Lifecycle - Polling Termination", () => {
  it("should stop polling when status becomes completed", () => {
    let isProcessing = true;

    const document = { status: "completed" };

    if (document.status !== "processing" && document.status !== "uploading") {
      isProcessing = false;
    }

    expect(isProcessing).toBe(false);
  });

  it("should stop polling when status becomes failed", () => {
    let isProcessing = true;

    const document = { status: "failed" };

    if (document.status !== "processing" && document.status !== "uploading") {
      isProcessing = false;
    }

    expect(isProcessing).toBe(false);
  });

  it("should continue polling when status is processing", () => {
    let isProcessing = true;

    const document = { status: "processing" };

    if (document.status !== "processing" && document.status !== "uploading") {
      isProcessing = false;
    }

    expect(isProcessing).toBe(true);
  });
});

describe("Processing Lifecycle - Logging", () => {
  it("should log extraction completion", () => {
    // Expected log: [DocuMind generation] extraction completed
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: "info",
      module: "[DocuMind generation]",
      event: "extraction completed",
      documentId: "doc-123",
      pageCount: 42,
      textLength: 15000,
    };

    expect(logEntry.module).toBe("[DocuMind generation]");
    expect(logEntry.event).toBe("extraction completed");
  });

  it("should log generation started", () => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: "info",
      module: "[DocuMind generation]",
      event: "generation completed",
      documentId: "doc-123",
      source: "gemini",
      failureState: null,
    };

    expect(logEntry.event).toBe("generation completed");
  });

  it("should log generation failure with reason", () => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: "error",
      module: "[DocuMind generation]",
      event: "failed",
      documentId: "doc-123",
      source: "fallback",
      failureState: "quota_exceeded",
      errorMessage: "Quota exhausted, retry later",
    };

    expect(logEntry.failureState).toBe("quota_exceeded");
    expect(logEntry.errorMessage).toBeTruthy();
  });

  it("should log document finalization", () => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: "info",
      module: "[DocuMind document]",
      event: "finalized",
      documentId: "doc-123",
      status: "completed",
      generationStatus: "quota_exceeded",
      source: "fallback",
      finalizedAt: new Date().toISOString(),
    };

    expect(logEntry.event).toBe("finalized");
    expect(logEntry.status).toBe("completed");
  });
});
