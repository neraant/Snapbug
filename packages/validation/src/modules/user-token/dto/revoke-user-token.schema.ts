import { userTokenModelSchema } from "@workspace/validation/modules/user-token/dto/user-token.model";
import type { z } from "zod";

export const revokeUserTokenInputDtoSchema = userTokenModelSchema.pick({ id: true });

export type RevokeUserTokenInputDtoType = z.infer<typeof revokeUserTokenInputDtoSchema>;

export const revokeUserTokenOutputDtoSchema = userTokenModelSchema;

export type RevokeUserTokenOutputDtoType = z.infer<typeof revokeUserTokenOutputDtoSchema>;
