import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { z } from "zod";

export const findUserCredentialsByEmailInputDtoSchema = z.object({
  email: z.email(),
});
export type FindUserCredentialsByEmailInputDtoType = z.infer<typeof findUserCredentialsByEmailInputDtoSchema>;

export const findUserCredentialsByEmailOutputDtoSchema = userModelSchema
  .extend({ passwordHash: z.string() })
  .nullable();
export type FindUserCredentialsByEmailOutputDtoType = z.infer<typeof findUserCredentialsByEmailOutputDtoSchema>;
