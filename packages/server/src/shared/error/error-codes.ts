export const ERROR_CODES = {
  EMAIL_ALREADY_TAKEN: "email-already-taken",
  RATE_LIMITED: "rate-limited",
  USER_NOT_FOUND: "user-not-found",
  UNAUTHORIZED: "unauthorized",
  INVALID_API_KEY: "invalid-api-key",
  ORIGIN_NOT_ALLOWED: "origin-not-allowed",
  ORGANIZATION_NOT_FOUND: "organization-not-found",
  MEMBERSHIP_ALREADY_EXISTS: "membership-already-exists",
  USER_ALREADY_HAS_ORGANIZATION: "user-already-has-organization",
  PROJECT_NOT_FOUND: "project-not-found",
  BUG_REPORT_NOT_FOUND: "bug-report-not-found",
  INTERNAL_SERVER_ERROR: "internal-server-error",
  EMAIL_SEND_FAILED: "email-send-failed",
  INVALID_RESET_PASSWORD_TOKEN: "invalid-reset-password-token",
  INVALID_INVITATION_TOKEN: "invalid-invitation-token",
  INVITATION_EMAIL_MISMATCH: "invitation-email-mismatch",
  SCREENSHOT_TOO_LARGE: "screenshot-too-large",
  INVALID_SCREENSHOT: "invalid-screenshot",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
