import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { acceptedTermsSchema } from "@workspace/validation/shared/accepted-terms.schema";
import { emailSchema } from "@workspace/validation/shared/email.schema";
import { personNameSchema } from "@workspace/validation/shared/person-name.schema";
import z from "zod";

export const createUserInputDtoSchema = z.object({
  email: emailSchema,
  name: personNameSchema,
  password: z.string().min(8),
  acceptedTerms: acceptedTermsSchema,
});
export type CreateUserInputDtoType = z.infer<typeof createUserInputDtoSchema>;

export const createUserOutputDtoSchema = userModelSchema;
export type CreateUserOutputDtoType = z.infer<typeof createUserOutputDtoSchema>;

export const createUserWithPasswordHashInputDtoSchema = z.object({
  email: emailSchema,
  name: personNameSchema,
  passwordHash: z.string().min(1),
  termsAcceptedAt: z.coerce.date().optional(),
});
export type CreateUserWithPasswordHashDtoType = z.infer<typeof createUserWithPasswordHashInputDtoSchema>;
