import { ORPCError } from "@orpc/client";
import type { ErrorCode } from "@workspace/server/shared/error/error-codes";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";

const KNOWN_ERROR_CODES = new Set<string>(Object.values(ERROR_CODES));

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.EMAIL_ALREADY_TAKEN]: "This email is already taken",
  [ERROR_CODES.USER_NOT_FOUND]: "User not found",
  [ERROR_CODES.UNAUTHORIZED]: "You need to sign in to continue",
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "Something went wrong. Please try again",
};

function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === "string" && KNOWN_ERROR_CODES.has(value);
}

function getAppErrorCode(error: unknown): ErrorCode | null {
  if (!(error instanceof ORPCError)) return null;

  const errorCode = (error.data as { errorCode?: unknown } | undefined)?.errorCode;
  return isErrorCode(errorCode) ? errorCode : null;
}

export function getAppErrorMessage(error: unknown, fallback: string): string {
  const errorCode = getAppErrorCode(error);
  if (errorCode) return ERROR_MESSAGES[errorCode];
  return fallback;
}
