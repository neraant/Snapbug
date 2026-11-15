import { userTokenModelSchema } from "@workspace/validation/modules/user-token/dto/user-token.model";
import { z } from "zod";

export const createUserTokenInputDtoSchema = z.object({
  name: z.string().trim().min(1),
});

export type CreateUserTokenInputDtoType = z.infer<typeof createUserTokenInputDtoSchema>;

export const createUserTokenOutputDtoSchema = userTokenModelSchema
  .pick({ id: true, name: true, createdAt: true })
  .extend({ secret: z.string().min(1) });

export type CreateUserTokenOutputDtoType = z.infer<typeof createUserTokenOutputDtoSchema>;
