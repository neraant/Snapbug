import { validationText } from "@workspace/validation/validation-texts";
import { z } from "zod";

import { texts } from "@/client/modules/auth/consts/texts.const";

export const signInSchema = z.object({
  email: z.email(validationText.required(texts.field.workEmail.label)),
  password: z.string().min(1, validationText.required(texts.field.password.label)),
});
export type SignInSchemaType = z.infer<typeof signInSchema>;
