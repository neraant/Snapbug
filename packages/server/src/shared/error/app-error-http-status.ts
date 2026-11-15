import type { ORPCError } from "@orpc/client";
import { fallbackORPCErrorStatus, toORPCError } from "@orpc/client";
import { AppError } from "@workspace/server/shared/error/app-errors";

const ROUTE_ERROR_HTTP_STATUS_PATTERN = /^\[snapbug:http=(\d{3})\]\s?/;
const ROUTE_ERROR_HTTP_STATUS_SNIPPET = /snapbug:http=(\d{3})/;

export type ErrorWithHttpStatus = Error & { httpStatus?: number; digest?: string };

export function formatRouteErrorHttpStatusPrefix(status: number): string {
  return `[snapbug:http=${status}]`;
}

function parseRouteErrorHttpStatus(value: string): number | null {
  const status = Number(value);
  return status >= 400 && status <= 599 ? status : null;
}

export function readRouteErrorHttpStatusFromMessage(message: string): number | null {
  const match = ROUTE_ERROR_HTTP_STATUS_PATTERN.exec(message);
  if (!match) {
    return null;
  }
  return parseRouteErrorHttpStatus(match[1] ?? "");
}

export function readRouteErrorHttpStatusFromDigest(digest: string): number | null {
  const match = ROUTE_ERROR_HTTP_STATUS_SNIPPET.exec(digest);
  if (!match) {
    return null;
  }
  return parseRouteErrorHttpStatus(match[1] ?? "");
}

export function stripRouteErrorHttpStatusFromMessage(message: string): string {
  return message.replace(ROUTE_ERROR_HTTP_STATUS_PATTERN, "");
}

function hasStampedHttpStatus(error: Error): error is ErrorWithHttpStatus {
  return typeof (error as ErrorWithHttpStatus).httpStatus === "number";
}

export function attachRouteErrorHttpStatus(error: unknown): ErrorWithHttpStatus {
  if (error instanceof Error && hasStampedHttpStatus(error)) {
    return error;
  }

  const status = getAppErrorHttpStatus(error);
  const baseMessage = error instanceof Error ? error.message : String(error);
  const routeError = new Error(
    `${formatRouteErrorHttpStatusPrefix(status)} ${stripRouteErrorHttpStatusFromMessage(baseMessage)}`.trim(),
  ) as ErrorWithHttpStatus;
  routeError.httpStatus = status;
  if (error instanceof Error) {
    routeError.cause = error;
  }
  return routeError;
}

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
  if (error instanceof Error) {
    if (hasStampedHttpStatus(error) && error.httpStatus !== undefined) {
      return error.httpStatus;
    }

    const fromMessage = readRouteErrorHttpStatusFromMessage(error.message);
    if (fromMessage !== null) {
      return fromMessage;
    }

    const digest = (error as ErrorWithHttpStatus).digest;
    if (typeof digest === "string") {
      const fromDigest = readRouteErrorHttpStatusFromDigest(digest);
      if (fromDigest !== null) {
        return fromDigest;
      }
    }

    if (error.cause !== undefined) {
      return getAppErrorHttpStatus(error.cause);
    }
  }

  if (error instanceof AppError) {
    return appErrorHttpStatus(error.code);
  }

  const orpcStatus = readOrpcHttpStatus(error);
  if (orpcStatus !== null) {
    return orpcStatus;
  }

  return toORPCError(error).status;
}
