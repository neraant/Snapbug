import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { z } from "zod";

export const verifyCredentialsInputDtoSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export type VerifyCredentialsInputDtoType = z.infer<typeof verifyCredentialsInputDtoSchema>;

export const verifyCredentialsOutputDtoSchema = userModelSchema.nullable();
export type VerifyCredentialsOutputDtoType = z.infer<typeof verifyCredentialsOutputDtoSchema>;
