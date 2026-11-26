import { emailFieldSchema } from "@workspace/validation/shared/email.schema";
import { PERSON_NAME_MAX_LENGTH } from "@workspace/validation/shared/person-name.schema";
import { validationText } from "@workspace/validation/validation-texts";
import { z } from "zod";

import { texts } from "@/client/modules/auth/consts/texts.const";

export const signUpSchema = z.object({
  email: emailFieldSchema({
    required: validationText.required(texts.field.signUpWorkEmail.label),
    invalid: texts.field.email.invalid,
    tooLong: texts.field.email.tooLong,
  }),
  name: z
    .string()
    .trim()
    .min(1, validationText.required(texts.field.name.label))
    .max(PERSON_NAME_MAX_LENGTH, texts.field.name.tooLong),
  password: z.string().min(8, validationText.minLength(texts.field.password.label, 8)),
  acceptedTerms: z.boolean().refine((value) => value, {
    message: validationText.required(texts.field.acceptedTerms.label),
  }),
});
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
