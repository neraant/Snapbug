import { userModelSchema } from "@workspace/validation/modules/user/dto/user.model";
import { mcpToolScopeSchema } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import { z } from "zod";

export const findUserByTokenInputDtoSchema = z.object({
  token: z.string().min(1),
});

export type FindUserByTokenInputDtoType = z.infer<typeof findUserByTokenInputDtoSchema>;

export const findUserByTokenOutputDtoSchema = userModelSchema.extend({
  mcpToken: z.object({
    scopes: z.array(mcpToolScopeSchema),
    projectIds: z.array(z.uuid()).nullable(),
  }),
});

export type FindUserByTokenOutputDtoType = z.infer<typeof findUserByTokenOutputDtoSchema>;
