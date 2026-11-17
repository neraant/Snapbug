import {
  mcpToolScopeSchema,
  userTokenScopePresetSchema,
} from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import { z } from "zod";

export const userTokenModelSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  prefix: z.string(),
  scopes: z.array(mcpToolScopeSchema),
  scopePreset: userTokenScopePresetSchema.nullable(),
  projectIds: z.array(z.uuid()).nullable(),
  createdAt: z.iso.datetime(),
  revokedAt: z.iso.datetime().nullable(),
});

export type UserTokenModelType = z.infer<typeof userTokenModelSchema>;
