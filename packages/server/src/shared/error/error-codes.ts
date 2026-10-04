export const ERROR_CODES = {
  EMAIL_ALREADY_TAKEN: "email-already-taken",
  RATE_LIMITED: "rate-limited",
  USER_NOT_FOUND: "user-not-found",
  UNAUTHORIZED: "unauthorized",
  INVALID_API_KEY: "invalid-api-key",
  ORGANIZATION_NOT_FOUND: "organization-not-found",
  INTERNAL_SERVER_ERROR: "internal-server-error",
  EMAIL_SEND_FAILED: "email-send-failed",
  INVALID_RESET_PASSWORD_TOKEN: "invalid-reset-password-token",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
