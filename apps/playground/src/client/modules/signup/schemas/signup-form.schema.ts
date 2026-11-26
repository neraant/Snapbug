import { z } from "zod";

import { signupErrorMessage } from "@/shared/signup/signup.const";
import { signupInputSchema } from "@/shared/signup/signup.schema";

export const signupFormSchema = signupInputSchema
  .extend({
    name: z.string().trim().min(1, signupErrorMessage.nameRequired),
    confirmPassword: z.string(),
    birthDate: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: signupErrorMessage.passwordMismatch,
    path: ["confirmPassword"],
  });

export type SignupFormSchemaType = z.infer<typeof signupFormSchema>;
