import { createMcpHandler } from "@workspace/server/shared/orpc/mcp/create-mcp-handler";
import { MCP_TOOL_CATALOG } from "@workspace/server/shared/orpc/mcp/mcp-tool-catalog.const";
import { router } from "@workspace/server/shared/router.const";
import { filterMcpToolsForContext, listMcpTools } from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it } from "vitest";

const memberContext: OrpcContext = {
  user: { id: "user-1", email: "a@b.test", name: null, role: UserRole.USER },
  organizationId: null,
  ip: "127.0.0.1",
  actor: { type: "mcp", id: "user-1" },
  requestOrigin: null,
};

const adminContext: OrpcContext = {
  ...memberContext,
  user: { ...memberContext.user!, role: UserRole.ADMIN },
};

describe("MCP tools", () => {
  it("exposes the full catalog for admins", () => {
    const tools = filterMcpToolsForContext(listMcpTools(router), adminContext);
    expect(tools.map((tool) => tool.name).sort()).toEqual(MCP_TOOL_CATALOG.map((entry) => entry.name).sort());
  });

  it("hides admin-only tools from members in tools/list", async () => {
    const handler = createMcpHandler(router);
    const request = new Request("http://localhost/api/mcp", {
      method: "POST",
      headers: { accept: "application/json, text/event-stream", "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
    });

    const { response } = await handler.handle(request, { context: memberContext });
    const body = (await response.json()) as { result: { tools: { name: string }[] } };
    const names = body.result.tools.map((tool) => tool.name);

    expect(names).not.toContain("list_activity");
    expect(names).toContain("list_tickets");
    expect(names).toContain("search");
  });
});