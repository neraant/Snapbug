import { implement } from "@orpc/server";
import { bugReportContract } from "@workspace/server/modules/bug-report/bug-report.contract";
import { commentContract } from "@workspace/server/modules/comment/comment.contract";
import { MCP_TOOL_CATALOG_BY_NAME } from "@workspace/server/shared/orpc/mcp/mcp-tool-catalog.const";
import { listMcpTools } from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";
import { describe, expect, it } from "vitest";

describe("listMcpTools", () => {
  it("returns only catalog tools with catalog descriptions", () => {
    const comment = implement(commentContract);
    const bugReport = implement(bugReportContract);
    const tools = listMcpTools({
      comment: {
        addComment: comment.addComment.handler(() => ({}) as never),
        findComments: comment.findComments.handler(() => []),
      },
      bugReport: {
        findOne: bugReport.findOne.handler(() => ({}) as never),
        findReplay: bugReport.findReplay.handler(() => new Blob()),
      },
    });
    const names = tools.map((tool) => tool.name);

    expect(names).toContain("add_comment");
    expect(names).toContain("get_ticket");
    expect(names).not.toContain("findReplay");
    expect(tools.find((tool) => tool.name === "add_comment")?.description).toBe(
      MCP_TOOL_CATALOG_BY_NAME.add_comment.description,
    );
    expect(tools.find((tool) => tool.name === "add_comment")?.readOnlyHint).toBe(false);
  });

  it("skips mcp procedures that are not in the catalog", () => {
    const comment = implement(commentContract);
    const router = {
      comment: {
        addComment: comment.addComment.handler(() => ({}) as never),
      },
      bugReport: {
        create: implement(bugReportContract).create.handler(() => ({}) as never),
      },
    };

    expect(listMcpTools(router).map((tool) => tool.name)).toEqual(["add_comment"]);
  });
});
