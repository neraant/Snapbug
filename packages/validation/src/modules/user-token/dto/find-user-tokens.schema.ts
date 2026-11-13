import { userTokenModelSchema } from "@workspace/validation/modules/user-token/dto/user-token.model";
import type { z } from "zod";

export const findUserTokensOutputDtoSchema = userTokenModelSchema.array();

export type FindUserTokensOutputDtoType = z.infer<typeof findUserTokensOutputDtoSchema>;
