import { MCP_TOOL_CATALOG_BY_NAME } from "@workspace/server/shared/orpc/mcp/mcp-tool-catalog.const";
import type { McpToolScopeType } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import { expandMcpScopes } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export type EvaluateMcpToolAccessInputType = {
  toolName: string;
  tokenScopes: readonly McpToolScopeType[];
  userRole?: UserRole;
};

export type EvaluateMcpToolAccessOutputType =
  | { allowed: true }
  | { allowed: false; missingScope: McpToolScopeType; reason: "scope" | "role" };

export class EvaluateMcpToolAccessUseCase {
  execute(input: EvaluateMcpToolAccessInputType): EvaluateMcpToolAccessOutputType {
    const catalog = MCP_TOOL_CATALOG_BY_NAME[input.toolName as keyof typeof MCP_TOOL_CATALOG_BY_NAME];
    if (!catalog) {
      return { allowed: false, missingScope: "tickets:read", reason: "scope" };
    }

    if (catalog.adminOnly && input.userRole !== UserRole.ADMIN) {
      return { allowed: false, missingScope: catalog.scope, reason: "role" };
    }

    const effectiveScopes = expandMcpScopes(input.tokenScopes);
    if (!effectiveScopes.includes(catalog.scope)) {
      return { allowed: false, missingScope: catalog.scope, reason: "scope" };
    }

    return { allowed: true };
  }

  listVisibleToolNames(tokenScopes: readonly McpToolScopeType[], userRole?: UserRole): string[] {
    const effectiveScopes = new Set(expandMcpScopes(tokenScopes));
    return Object.values(MCP_TOOL_CATALOG_BY_NAME)
      .filter((entry) => {
        if (entry.adminOnly && userRole !== UserRole.ADMIN) return false;
        return effectiveScopes.has(entry.scope);
      })
      .map((entry) => entry.name);
  }
}
