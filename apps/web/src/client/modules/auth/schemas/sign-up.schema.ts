import { validationText } from "@workspace/validation/validation-texts";
import { z } from "zod";

import { texts } from "@/client/modules/auth/consts/texts";

export const signUpSchema = z.object({
  email: z.email(validationText.required(texts.field.signUpWorkEmail.label)),
  name: z.string().min(1, validationText.required(texts.field.name.label)),
  password: z.string().min(8, validationText.minLength(texts.field.password.label, 8)),
});
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
