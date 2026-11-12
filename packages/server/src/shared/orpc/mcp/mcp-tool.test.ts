import { implement } from "@orpc/server";
import { bugReportContract } from "@workspace/server/modules/bug-report/bug-report.contract";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { createMcpHandler } from "@workspace/server/shared/orpc/mcp/create-mcp-handler";
import { listMcpTools } from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it } from "vitest";

describe("MCP tools", () => {
  it("exposes only list_tickets, get_ticket, get_screenshot, and update_ticket", () => {
    const procedures = implement(bugReportContract);
    const router = procedures.router({
      create: procedures.create.handler(() => undefined as never),
      findWidgetConfig: procedures.findWidgetConfig.handler(() => undefined as never),
      findMany: procedures.findMany.handler(() => undefined as never),
      findOne: procedures.findOne.handler(() => undefined as never),
      findScreenshot: procedures.findScreenshot.handler(() => undefined as never),
      findReplay: procedures.findReplay.handler(() => undefined as never),
      update: procedures.update.handler(() => undefined as never),
      findStats: procedures.findStats.handler(() => undefined as never),
      findCharts: procedures.findCharts.handler(() => undefined as never),
      findBreakdowns: procedures.findBreakdowns.handler(() => undefined as never),
      findRecent: procedures.findRecent.handler(() => undefined as never),
      findWorkload: procedures.findWorkload.handler(() => undefined as never),
      countOpenByProject: procedures.countOpenByProject.handler(() => undefined as never),
      countOpenByAssignee: procedures.countOpenByAssignee.handler(() => undefined as never),
      listTickets: procedures.listTickets.handler(() => undefined as never),
    });

    const tools = listMcpTools({ bugReport: router });

    expect(tools.map((tool) => tool.name).sort()).toEqual([
      "get_screenshot",
      "get_ticket",
      "list_tickets",
      "update_ticket",
    ]);
    expect(tools.find((tool) => tool.name === "update_ticket")?.readOnlyHint).toBe(false);
    expect(tools.filter((tool) => tool.name !== "update_ticket").every((tool) => tool.readOnlyHint)).toBe(true);
    expect(tools.some((tool) => tool.name.includes("replay"))).toBe(false);
  });

  it("lists those tools through a normal MCP client", async () => {
    const procedures = implement(bugReportContract);
    const router = procedures.router({
      create: procedures.create.handler(() => undefined as never),
      findWidgetConfig: procedures.findWidgetConfig.handler(() => undefined as never),
      findMany: procedures.findMany.handler(() => undefined as never),
      findOne: procedures.findOne.handler(() => undefined as never),
      findScreenshot: procedures.findScreenshot.handler(() => undefined as never),
      findReplay: procedures.findReplay.handler(() => undefined as never),
      update: procedures.update.handler(() => undefined as never),
      findStats: procedures.findStats.handler(() => undefined as never),
      findCharts: procedures.findCharts.handler(() => undefined as never),
      findBreakdowns: procedures.findBreakdowns.handler(() => undefined as never),
      findRecent: procedures.findRecent.handler(() => undefined as never),
      findWorkload: procedures.findWorkload.handler(() => undefined as never),
      countOpenByProject: procedures.countOpenByProject.handler(() => undefined as never),
      countOpenByAssignee: procedures.countOpenByAssignee.handler(() => undefined as never),
      listTickets: procedures.listTickets.handler(() => undefined as never),
    });
    const context: OrpcContext = {
      user: { id: "user-1", email: "a@b.test", name: null, role: UserRole.USER },
      organizationId: null,
      ip: "127.0.0.1",
      actor: { type: "mcp", id: "user-1" },
      requestOrigin: null,
    };
    const handler = createMcpHandler({ bugReport: router });
    const request = new Request("http://localhost/api/mcp", {
      method: "POST",
      headers: { accept: "application/json, text/event-stream", "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
    });

    const { response } = await handler.handle(request, { context });
    const body = (await response.json()) as { result: { tools: { name: string }[] } };

    expect(body.result.tools.map((tool) => tool.name).sort()).toEqual([
      "get_screenshot",
      "get_ticket",
      "list_tickets",
      "update_ticket",
    ]);
  });
});
