import { oc } from "@orpc/contract";
import { implement, os } from "@orpc/server";
import { listMcpTools, type OrpcMetaType } from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";
import { describe, expect, it } from "vitest";

const builder = os.$meta<OrpcMetaType>({});

const marked = builder
  .meta({ mcp: true })
  .route({ summary: "Find nested" })
  .handler(() => ({ ok: true }));

const unmarked = builder.route({ summary: "Hidden" }).handler(() => ({ ok: true }));

describe("listMcpTools", () => {
  it("includes nested mcp procedures with path-joined names", () => {
    const router = {
      portfolios: {
        capitalCalls: {
          findSummary: marked,
        },
      },
    };

    const tools = listMcpTools(router);

    expect(tools).toHaveLength(1);
    expect(tools[0]?.name).toBe("portfolios_capitalCalls_findSummary");
    expect(tools[0]?.description).toBe("Find nested");
    expect(tools[0]?.procedure).toBe(marked);
  });

  it("skips unmarked procedures", () => {
    const router = {
      hidden: unmarked,
      shown: marked,
    };

    expect(listMcpTools(router).map((tool) => tool.name)).toEqual(["shown"]);
  });

  it("returns an empty list for an empty router", () => {
    expect(listMcpTools({})).toEqual([]);
  });

  it("keeps contract meta after implement", () => {
    const contract = oc.$meta<OrpcMetaType>({});
    const bugReportContract = {
      create: contract.meta({ mcp: true }).route({ summary: "Create bug report" }),
      findMany: contract.route({ summary: "List bug reports" }),
    };
    const procedures = implement(bugReportContract);
    const router = {
      bugReport: procedures.router({
        create: procedures.create.handler(() => ({ ok: true })),
        findMany: procedures.findMany.handler(() => ({ ok: true })),
      }),
    };

    expect(listMcpTools(router).map((tool) => tool.name)).toEqual(["bugReport_create"]);
    expect(listMcpTools(router)[0]?.description).toBe("Create bug report");
  });

  it("uses an explicit tool name when meta provides one", () => {
    const named = builder
      .meta({ mcp: true, name: "list_tickets", readOnlyHint: false })
      .route({ summary: "List tickets" })
      .handler(() => ({ ok: true }));

    const tools = listMcpTools({ bugReport: { listTickets: named } });

    expect(tools).toEqual([
      expect.objectContaining({ name: "list_tickets", description: "List tickets", readOnlyHint: false }),
    ]);
  });
});
