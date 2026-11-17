import { validationText } from "@workspace/validation/validation-texts";
import { z } from "zod";

import { texts } from "@/client/modules/user/consts/texts.const";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, validationText.required(texts.changePassword.currentPassword.label)),
    newPassword: z.string().min(8, validationText.minLength(texts.changePassword.newPassword.label, 8)),
    confirmPassword: z.string().min(1, validationText.required(texts.changePassword.confirmPassword.label)),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: texts.changePassword.mismatch,
    path: ["confirmPassword"],
  });

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
