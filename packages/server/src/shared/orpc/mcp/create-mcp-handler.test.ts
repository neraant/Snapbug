import { implement } from "@orpc/server";
import { commentContract } from "@workspace/server/modules/comment/comment.contract";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { createMcpHandler } from "@workspace/server/shared/orpc/mcp/create-mcp-handler";
import { MCP_TOOL_CATALOG_BY_NAME } from "@workspace/server/shared/orpc/mcp/mcp-tool-catalog.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it } from "vitest";

const context: OrpcContext = {
  user: { id: "user-1", email: "a@b.test", name: null, role: UserRole.ADMIN },
  organizationId: null,
  ip: "127.0.0.1",
  actor: { type: "user", id: "user-1" },
  requestOrigin: null,
};

function buildCommentRouter(handlers: { addComment?: () => never; findComments?: () => never }) {
  const comment = implement(commentContract);
  return {
    comment: comment.router({
      addComment: comment.addComment.handler(handlers.addComment ?? (() => ({}) as never)),
      findComments: comment.findComments.handler(handlers.findComments ?? (() => [] as never)),
      updateComment: comment.updateComment.handler(() => ({}) as never),
      deleteComment: comment.deleteComment.handler(() => undefined),
    }),
  };
}

async function postJsonRpc(router: unknown, body: object) {
  const handler = createMcpHandler(router);
  const request = new Request("http://localhost/api/mcp", {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const { response } = await handler.handle(request, { context });
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

describe("createMcpHandler", () => {
  it.each(["GET", "DELETE"] as const)("returns 405 for %s so clients skip the SSE stream", async (method) => {
    const handler = createMcpHandler(buildCommentRouter({}));
    const request = new Request("http://localhost/api/mcp", {
      method,
      headers: { accept: "text/event-stream" },
    });

    const { response } = await handler.handle(request, { context });

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
  });

  it("registers only catalog mcp tools", async () => {
    const { body } = await postJsonRpc(buildCommentRouter({}), {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
      params: {},
    });
    const result = body.result as { tools: { name: string; description?: string }[] };

    expect(result.tools.map((tool) => tool.name).sort()).toEqual(["add_comment", "list_comments"]);
    expect(result.tools.find((tool) => tool.name === "add_comment")?.description).toBe(
      MCP_TOOL_CATALOG_BY_NAME.add_comment.description,
    );
  });

  it("calls the procedure with request context", async () => {
    let receivedUserId: string | undefined;
    const { body } = await postJsonRpc(
      buildCommentRouter({
        findComments: () => {
          receivedUserId = context.user?.id;
          return [] as never;
        },
      }),
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: "list_comments",
          arguments: { bugReportId: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4" },
        },
      },
    );
    const result = body.result as { content: { type: string; text: string }[]; isError?: boolean };

    expect(result.isError).toBeFalsy();
    expect(receivedUserId).toBe("user-1");
    expect(JSON.parse(result.content[0]?.text ?? "")).toEqual([]);
  });

  it("returns isError when the procedure throws a domain error", async () => {
    const { body } = await postJsonRpc(
      buildCommentRouter({
        addComment: () => {
          throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND, "missing");
        },
      }),
      {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "add_comment",
          arguments: {
            bugReportId: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
            body: "note",
          },
        },
      },
    );
    const result = body.result as { content: { type: string; text: string }[]; isError?: boolean };

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("missing");
  });
});
