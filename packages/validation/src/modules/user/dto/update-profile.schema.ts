import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { z } from "zod";

export const updateProfileInputDtoSchema = z.object({
  name: z.string().trim().min(1),
});

export type UpdateProfileInputDtoType = z.infer<typeof updateProfileInputDtoSchema>;

export const updateProfileOutputDtoSchema = userModelSchema;

export type UpdateProfileOutputDtoType = z.infer<typeof updateProfileOutputDtoSchema>;
