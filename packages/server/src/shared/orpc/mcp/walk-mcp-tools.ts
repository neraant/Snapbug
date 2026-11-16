import type { AnyProcedure } from "@orpc/server";
import { isProcedure } from "@orpc/server";
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

export function filterMcpToolsForContext(tools: McpToolType[], context: { user?: { role?: string } | null }): McpToolType[] {
  if (isMcpAdmin(context)) return tools;
  return tools.filter((tool) => !tool.catalog.adminOnly);
}