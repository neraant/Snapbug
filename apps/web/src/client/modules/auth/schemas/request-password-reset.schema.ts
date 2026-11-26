import { emailFieldSchema } from "@workspace/validation/shared/email.schema";
import { validationText } from "@workspace/validation/validation-texts";
import { z } from "zod";

import { texts } from "@/client/modules/auth/consts/texts.const";

export const requestPasswordResetSchema = z.object({
  email: emailFieldSchema({
    required: validationText.required(texts.field.workEmail.label),
    invalid: texts.field.email.invalid,
    tooLong: texts.field.email.tooLong,
  }),
});
export type RequestPasswordResetSchemaType = z.infer<typeof requestPasswordResetSchema>;
