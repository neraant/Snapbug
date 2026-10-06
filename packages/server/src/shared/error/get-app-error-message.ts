import { ORPCError } from "@orpc/client";
import type { ErrorCode } from "@workspace/server/shared/error/error-codes";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";

const KNOWN_ERROR_CODES = new Set<string>(Object.values(ERROR_CODES));

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.EMAIL_ALREADY_TAKEN]: "This email is already taken",
  [ERROR_CODES.USER_NOT_FOUND]: "User not found",
  [ERROR_CODES.UNAUTHORIZED]: "You need to sign in to continue",
  [ERROR_CODES.INVALID_API_KEY]: "This API key is invalid",
  [ERROR_CODES.ORGANIZATION_NOT_FOUND]: "Organization not found",
  [ERROR_CODES.MEMBERSHIP_ALREADY_EXISTS]: "This organization already has a member",
  [ERROR_CODES.USER_ALREADY_HAS_ORGANIZATION]: "You already belong to an organization",
  [ERROR_CODES.PROJECT_NOT_FOUND]: "Project not found",
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "Something went wrong. Please try again",
  [ERROR_CODES.EMAIL_SEND_FAILED]: "Failed to send email. Please try again",
  [ERROR_CODES.RATE_LIMITED]: "You have exceeded the rate limit. Please try again later",
  [ERROR_CODES.INVALID_RESET_PASSWORD_TOKEN]: "This reset link is invalid or has expired",
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
