export class ProcessingError extends Error {
  constructor(message: string, public readonly code: string = "PROCESSING_ERROR") {
    super(message);
    this.name = "ProcessingError";
  }
}

export class ValidationError extends Error {
  constructor(message: string, public readonly code: string = "VALIDATION_ERROR") {
    super(message);
    this.name = "ValidationError";
  }
}
