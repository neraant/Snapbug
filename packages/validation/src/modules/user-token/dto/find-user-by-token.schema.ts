import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { z } from "zod";

export const findUserByTokenInputDtoSchema = z.object({
  token: z.string().min(1),
});

export type FindUserByTokenInputDtoType = z.infer<typeof findUserByTokenInputDtoSchema>;

export const findUserByTokenOutputDtoSchema = userModelSchema;

export type FindUserByTokenOutputDtoType = z.infer<typeof findUserByTokenOutputDtoSchema>;
