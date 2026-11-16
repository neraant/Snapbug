import type { McpToolScopeType } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import type { UserTokenScopePresetType } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";

export type UserTokenRowType = {
  id: string;
  userId: string;
  tokenHash: string;
  name: string;
  prefix: string;
  scopes: string[];
  scopePreset: string | null;
  projectIds: string[] | null;
  createdAt: Date;
  revokedAt: Date | null;
};

export type UserTokenPersistedType = {
  id: string;
  userId: string;
  tokenHash: string;
  name: string;
  prefix: string;
  scopes: McpToolScopeType[];
  scopePreset: UserTokenScopePresetType | null;
  projectIds: string[] | null;
  createdAt: Date;
  revokedAt: Date | null;
};
