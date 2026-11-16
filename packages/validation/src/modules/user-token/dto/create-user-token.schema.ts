import { userTokenModelSchema } from "@workspace/validation/modules/user-token/dto/user-token.model";
import {
  mcpToolScopeSchema,
  userTokenScopePresetSchema,
} from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import { z } from "zod";

export const createUserTokenInputDtoSchema = z
  .object({
    name: z.string().trim().min(1),
    preset: userTokenScopePresetSchema.optional(),
    scopes: z.array(mcpToolScopeSchema).optional(),
    projectIds: z.array(z.uuid()).nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.preset === "custom" && (!value.scopes || value.scopes.length === 0)) {
      ctx.addIssue({
        code: "custom",
        message: "Custom tokens need at least one scope",
        path: ["scopes"],
      });
    }
  });

export type CreateUserTokenInputDtoType = z.infer<typeof createUserTokenInputDtoSchema>;

export const createUserTokenOutputDtoSchema = userTokenModelSchema
  .pick({ id: true, name: true, createdAt: true, scopes: true, scopePreset: true, projectIds: true })
  .extend({ secret: z.string().min(1) });

export type CreateUserTokenOutputDtoType = z.infer<typeof createUserTokenOutputDtoSchema>;