export const MIN_PASSWORD_LENGTH = 8;
export const NAME_MAX_LENGTH = 80;
export const ABOUT_MAX_LENGTH = 1000;

export const EMAIL_PATTERN = /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;

export const signupErrorMessage = {
  nameRequired: "Enter your name",
  nameTooLong: `Name must be at most ${NAME_MAX_LENGTH} characters`,
  emailInvalid: "Enter a valid email",
  passwordTooShort: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  passwordMismatch: "Passwords do not match",
  aboutTooLong: `Must be at most ${ABOUT_MAX_LENGTH} characters`,
  consentRequired: "Consent is required",
  emailTaken: "This email is already registered",
} as const;
