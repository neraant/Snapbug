import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { z } from "zod";

export const findUserByEmailInputDtoSchema = z.object({
  email: z.email(),
});
export type FindUserByEmailInputDtoType = z.infer<typeof findUserByEmailInputDtoSchema>;

export const findUserByEmailOutputDtoSchema = userModelSchema.nullable();
export type FindUserByEmailOutputDtoType = z.infer<typeof findUserByEmailOutputDtoSchema>;
