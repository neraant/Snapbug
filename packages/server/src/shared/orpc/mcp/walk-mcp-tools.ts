import type { AnyProcedure } from "@orpc/server";
import { isProcedure } from "@orpc/server";

export type McpToolType = {
  name: string;
  procedure: AnyProcedure;
  description: string | undefined;
};

export type OrpcMetaType = { mcp?: boolean; mcpName?: string };

export function listMcpTools(router: unknown): McpToolType[] {
  const tools: McpToolType[] = [];
  walk(router, [], tools);
  return tools;
}

function walk(node: unknown, path: string[], tools: McpToolType[]): void {
  if (isProcedure(node)) {
    const meta = node["~orpc"].meta as OrpcMetaType | undefined;
    if (meta?.mcp !== true) return;

    const mcpName = meta.mcpName?.trim();
    tools.push({
      name: mcpName ? mcpName : path.join("_"),
      procedure: node,
      description: node["~orpc"].route.summary,
    });
    return;
  }

  if (node == null || typeof node !== "object") return;

  for (const [key, child] of Object.entries(node)) {
    walk(child, [...path, key], tools);
  }
}
