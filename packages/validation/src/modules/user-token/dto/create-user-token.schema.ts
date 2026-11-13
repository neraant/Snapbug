import { userTokenModelSchema } from "@workspace/validation/modules/user-token/dto/user-token.model";
import { z } from "zod";

export const createUserTokenOutputDtoSchema = userTokenModelSchema
  .pick({ id: true, prefix: true, createdAt: true })
  .extend({ secret: z.string().min(1) });

export type CreateUserTokenOutputDtoType = z.infer<typeof createUserTokenOutputDtoSchema>;
