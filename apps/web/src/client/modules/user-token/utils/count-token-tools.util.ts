import {
  expandMcpScopes,
  type McpToolScopeType,
} from "@workspace/validation/modules/user-token/consts/mcp-scope.const";
import { MCP_SCOPE_GROUPS, MCP_TOOL_COUNT } from "@workspace/validation/modules/user-token/consts/mcp-scope-meta.const";

function requiredScopeForTool(toolName: string, group: (typeof MCP_SCOPE_GROUPS)[number]): McpToolScopeType {
  if (toolName === "update_ticket") return "tickets:write";
  if (toolName === "add_comment") return "comments:write";
  return group.readScope;
}

export function countTokenTools(scopes: readonly McpToolScopeType[]): { total: number; allowed: number } {
  const expanded = new Set(expandMcpScopes(scopes));
  let allowed = 0;
  for (const group of MCP_SCOPE_GROUPS) {
    for (const toolName of group.toolNames) {
      if (expanded.has(requiredScopeForTool(toolName, group))) {
        allowed += 1;
      }
    }
  }
  return { total: MCP_TOOL_COUNT, allowed };
}
