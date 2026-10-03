export const ERROR_CODES = {
  EMAIL_ALREADY_TAKEN: "email-already-taken",
  USER_NOT_FOUND: "user-not-found",
  UNAUTHORIZED: "unauthorized",
  INTERNAL_SERVER_ERROR: "internal-server-error",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
