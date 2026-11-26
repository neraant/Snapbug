import { z } from "zod";

import {
  ABOUT_MAX_LENGTH,
  EMAIL_PATTERN,
  MIN_PASSWORD_LENGTH,
  NAME_MAX_LENGTH,
  signupErrorMessage,
} from "@/shared/signup/signup.const";

export const signupInputSchema = z.object({
  name: z.string().trim().min(1, signupErrorMessage.nameRequired).max(NAME_MAX_LENGTH, signupErrorMessage.nameTooLong),
  email: z.string().trim().regex(EMAIL_PATTERN, signupErrorMessage.emailInvalid),
  password: z.string().refine((value) => value.length > MIN_PASSWORD_LENGTH, signupErrorMessage.passwordTooShort),
  about: z.string().max(ABOUT_MAX_LENGTH, signupErrorMessage.aboutTooLong),
  birthDate: z.iso.date().nullable(),
  consent: z.boolean().refine((value) => value, signupErrorMessage.consentRequired),
});

export type SignupInputType = z.infer<typeof signupInputSchema>;

export type SignupUserType = Pick<SignupInputType, "name" | "email" | "about" | "birthDate"> & {
  id: string;
  createdAt: string;
};
