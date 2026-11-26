import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { emailSchema } from "@workspace/validation/shared/email.schema";
import { z } from "zod";

export const verifyCredentialsInputDtoSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});
export type VerifyCredentialsInputDtoType = z.infer<typeof verifyCredentialsInputDtoSchema>;

export const verifyCredentialsOutputDtoSchema = userModelSchema.nullable();
export type VerifyCredentialsOutputDtoType = z.infer<typeof verifyCredentialsOutputDtoSchema>;
