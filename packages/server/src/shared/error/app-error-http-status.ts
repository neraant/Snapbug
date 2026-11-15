import { fallbackORPCErrorStatus, ORPCError, toORPCError } from "@orpc/client";

import { AppError } from "@workspace/server/shared/error/app-errors";

export function appErrorHttpStatus(code: AppError["code"]): number {
  switch (code) {
    case "BAD_REQUEST":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "TOO_MANY_REQUESTS":
      return 429;
    default:
      return 500;
  }
}

function readOrpcHttpStatus(error: unknown): number | null {
  if (!(error instanceof Error)) return null;

  const candidate = error as ORPCError<string, unknown>;
  if (typeof candidate.status === "number" && candidate.status >= 400) {
    return candidate.status;
  }

  if (typeof candidate.code === "string") {
    return fallbackORPCErrorStatus(candidate.code, undefined);
  }

  return null;
}

export function getAppErrorHttpStatus(error: unknown): number {
  if (error instanceof AppError) {
    return appErrorHttpStatus(error.code);
  }

  const orpcStatus = readOrpcHttpStatus(error);
  if (orpcStatus !== null) {
    return orpcStatus;
  }

  return toORPCError(error).status;
}