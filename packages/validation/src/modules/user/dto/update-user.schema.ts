import { interfaceLanguageSchema } from "@workspace/validation/modules/user/consts/interface-language.const";
import { emailSchema } from "@workspace/validation/shared/email.schema";
import { personNameSchema } from "@workspace/validation/shared/person-name.schema";
import { z } from "zod";

export const updateUserInputDtoSchema = z
  .object({
    userId: z.uuid(),
    name: personNameSchema.nullable().optional(),
    email: emailSchema.optional(),
    passwordHash: z.string().min(1).optional(),
    interfaceLanguage: interfaceLanguageSchema.optional(),
    onboardingCompletedAt: z.coerce.date().nullable().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined ||
      data.passwordHash !== undefined ||
      data.interfaceLanguage !== undefined ||
      data.onboardingCompletedAt !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export type UpdateUserInputDtoType = z.infer<typeof updateUserInputDtoSchema>;
