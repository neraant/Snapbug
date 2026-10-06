import { validationText } from "@workspace/validation/validation-texts";
import { z } from "zod";

import { texts } from "@/client/modules/auth/consts/texts.const";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, validationText.minLength(texts.resetPassword.newPassword.label, 8)),
    confirmPassword: z.string().min(1, validationText.required(texts.resetPassword.confirmPassword.label)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: texts.resetPassword.validation.confirmMismatch,
    path: ["confirmPassword"],
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
