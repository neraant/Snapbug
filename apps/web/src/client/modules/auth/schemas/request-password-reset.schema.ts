import { validationText } from "@workspace/validation/validation-texts";
import { z } from "zod";

import { texts } from "@/client/modules/auth/consts/texts.const";

export const requestPasswordResetSchema = z.object({
  email: z.email(validationText.required(texts.field.workEmail.label)),
});
export type RequestPasswordResetSchemaType = z.infer<typeof requestPasswordResetSchema>;
