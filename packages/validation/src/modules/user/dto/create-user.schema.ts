import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import z from "zod";

export const createUserInputDtoSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  password: z.string().min(8),
});
export type CreateUserInputDtoType = z.infer<typeof createUserInputDtoSchema>;

export const createUserOutputDtoSchema = userModelSchema;
export type CreateUserOutputDtoType = z.infer<typeof createUserOutputDtoSchema>;

export type CreateUserWithPasswordHashDtoType = {
  email: string;
  name: string;
  passwordHash: string;
};
