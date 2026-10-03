import type { CommonORPCErrorCode } from "@orpc/client";

type AppErrorCode = Extract<
  CommonORPCErrorCode,
  "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "INTERNAL_SERVER_ERROR"
>;

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly errorCode: string;

  constructor(code: AppErrorCode, errorCode: string, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "AppError";
    this.code = code;
    this.errorCode = errorCode;
  }
}

export class BadRequestError extends AppError {
  constructor(errorCode: string, message = "Bad request", options?: ErrorOptions) {
    super("BAD_REQUEST", errorCode, message, options);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(errorCode: string, message = "Unauthorized", options?: ErrorOptions) {
    super("UNAUTHORIZED", errorCode, message, options);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(errorCode: string, message = "Forbidden", options?: ErrorOptions) {
    super("FORBIDDEN", errorCode, message, options);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(errorCode: string, message = "Not found", options?: ErrorOptions) {
    super("NOT_FOUND", errorCode, message, options);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(errorCode: string, message = "Conflict", options?: ErrorOptions) {
    super("CONFLICT", errorCode, message, options);
    this.name = "ConflictError";
  }
}

export class InternalServerError extends AppError {
  constructor(errorCode: string, message = "Internal server error", options?: ErrorOptions) {
    super("INTERNAL_SERVER_ERROR", errorCode, message, options);
    this.name = "InternalServerError";
  }
}
