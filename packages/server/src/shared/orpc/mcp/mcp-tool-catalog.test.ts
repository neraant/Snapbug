import { router } from "@workspace/server/shared/router.const";
import { MCP_EXCLUDED_MODULE_PREFIXES, MCP_TOOL_CATALOG } from "@workspace/server/shared/orpc/mcp/mcp-tool-catalog.const";
import { assertZodObjectFieldsDescribed } from "@workspace/server/shared/orpc/mcp/mcp-schema.util";
import { listMcpTools } from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";
import { describe, expect, it } from "vitest";

describe("MCP tool catalog", () => {
  it("matches every mcp-marked procedure and only catalog tools are exposed", () => {
    const tools = listMcpTools(router);
    const catalogNames = MCP_TOOL_CATALOG.map((entry) => entry.name).sort();
    const exposedNames = tools.map((tool) => tool.name).sort();

    expect(exposedNames).toEqual(catalogNames);
    expect(tools.every((tool) => tool.description.length > 20)).toBe(true);

    for (const tool of tools) {
      const inputSchema = tool.procedure["~orpc"].inputSchema;
      if (!inputSchema) continue;
      expect(assertZodObjectFieldsDescribed(inputSchema as never)).toEqual([]);
    }
  });

  it("does not expose tools from excluded modules", () => {
    const tools = listMcpTools(router);
    for (const tool of tools) {
      expect(MCP_EXCLUDED_MODULE_PREFIXES.some((prefix) => tool.catalog.module.startsWith(prefix))).toBe(false);
    }
  });
});