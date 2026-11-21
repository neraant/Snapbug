import {
  expandMcpScopes,
  type McpToolScopeType,
} from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import {
  MCP_ADMIN_ONLY_TOOL_NAMES,
  MCP_SCOPE_GROUPS,
} from "@workspace/validation/modules/user-token/consts/mcp-scope-meta.const";

const adminOnlyTools = new Set<string>(MCP_ADMIN_ONLY_TOOL_NAMES);

function requiredScopeForTool(toolName: string, group: (typeof MCP_SCOPE_GROUPS)[number]): McpToolScopeType {
  if (toolName === "update_ticket") return "tickets:write";
  if (toolName === "add_comment") return "comments:write";
  return group.readScope;
}

function isToolAvailableToUser(toolName: string, canUseAdminOnlyTools: boolean): boolean {
  if (adminOnlyTools.has(toolName)) {
    return canUseAdminOnlyTools;
  }
  return true;
}

export function countTokenTools(
  scopes: readonly McpToolScopeType[],
  canUseAdminOnlyTools: boolean,
): { total: number; allowed: number } {
  const expanded = new Set(expandMcpScopes(scopes));
  let total = 0;
  let allowed = 0;
  for (const group of MCP_SCOPE_GROUPS) {
    for (const toolName of group.toolNames) {
      if (!isToolAvailableToUser(toolName, canUseAdminOnlyTools)) continue;
      total += 1;
      if (expanded.has(requiredScopeForTool(toolName, group))) {
        allowed += 1;
      }
    }
  }
  return { total, allowed };
}
