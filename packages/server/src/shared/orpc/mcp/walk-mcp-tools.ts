import type { AnyProcedure } from "@orpc/server";
import { isProcedure } from "@orpc/server";
import { EvaluateMcpToolAccessUseCase } from "@workspace/server/modules/user-token/application/evaluate-mcp-tool-access.use-case";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import {
  MCP_TOOL_CATALOG_BY_NAME,
  type McpToolCatalogEntryType,
} from "@workspace/server/shared/orpc/mcp/mcp-tool-catalog.const";

export type OrpcMetaType = {
  mcp?: boolean;
  name?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
};

export type McpToolType = {
  name: string;
  procedure: AnyProcedure;
  description: string;
  readOnlyHint: boolean;
  destructiveHint: boolean;
  catalog: McpToolCatalogEntryType;
};

export function listMcpTools(router: unknown): McpToolType[] {
  const tools: McpToolType[] = [];
  walk(router, [], tools);
  return tools;
}

function walk(node: unknown, path: string[], tools: McpToolType[]): void {
  if (isProcedure(node)) {
    const meta = node["~orpc"].meta as OrpcMetaType | undefined;
    if (meta?.mcp !== true) return;

    const name = meta.name ?? path.join("_");
    const catalog = MCP_TOOL_CATALOG_BY_NAME[name as keyof typeof MCP_TOOL_CATALOG_BY_NAME];
    if (!catalog) return;

    tools.push({
      name,
      procedure: node,
      description: catalog.description,
      readOnlyHint: meta.readOnlyHint !== false,
      destructiveHint: meta.destructiveHint === true,
      catalog,
    });
    return;
  }

  if (node == null || typeof node !== "object") return;

  for (const [key, child] of Object.entries(node)) {
    walk(child, [...path, key], tools);
  }
}

export function isMcpAdmin(context: { user?: { role?: string } | null }): boolean {
  return context.user?.role === "admin";
}

const evaluateMcpToolAccess = new EvaluateMcpToolAccessUseCase();

export function filterMcpToolsForRole(tools: McpToolType[], context: OrpcContext): McpToolType[] {
  if (isMcpAdmin(context)) return tools;
  return tools.filter((tool) => !tool.catalog.adminOnly);
}

export function filterMcpToolsForTokenList(tools: McpToolType[], context: OrpcContext): McpToolType[] {
  const tokenScopes = context.mcp?.tokenScopes;
  if (!tokenScopes) {
    return filterMcpToolsForRole(tools, context);
  }

  const visibleNames = new Set(evaluateMcpToolAccess.listVisibleToolNames(tokenScopes, context.user?.role));
  return tools.filter((tool) => visibleNames.has(tool.name));
}

/** @deprecated Use filterMcpToolsForTokenList for tools/list; register with filterMcpToolsForRole. */
export function filterMcpToolsForContext(tools: McpToolType[], context: OrpcContext): McpToolType[] {
  return filterMcpToolsForTokenList(tools, context);
}
