import { MIN_PASSWORD_LENGTH } from "@/shared/signup/signup.const";

export const texts = {
  signup: {
    title: "Create your account",
    description: "Sample signup form for testing the Snapbug widget.",
    submit: "Create account",
    submitting: "Creating account…",
  },
  field: {
    name: { label: "Name", placeholder: "Jane Doe" },
    email: { label: "Email", placeholder: "you@example.com" },
    password: {
      label: "Password",
      placeholder: "Create a password",
      hint: `At least ${MIN_PASSWORD_LENGTH} characters`,
    },
    confirmPassword: { label: "Confirm password", placeholder: "Repeat your password" },
    birthDate: { label: "Date of birth (optional)" },
    about: { label: "About you (Markdown)", placeholder: "Tell us about yourself", preview: "Preview" },
    consent: { label: "I agree to the processing of my data" },
  },
  success: {
    title: "Account created",
    description: "Your registration was submitted.",
    name: "Name",
    email: "Email",
    birthDate: "Date of birth",
    about: "Saved text",
    notSet: "Not set",
    reset: "New signup",
  },
} as const;
