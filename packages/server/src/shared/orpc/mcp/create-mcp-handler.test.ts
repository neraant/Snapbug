import { os } from "@orpc/server";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { createMcpHandler } from "@workspace/server/shared/orpc/mcp/create-mcp-handler";
import type { OrpcMetaType } from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it } from "vitest";
import { z } from "zod";

const builder = os.$context<OrpcContext>().$meta<OrpcMetaType>({});

const echo = builder
  .meta({ mcp: true })
  .route({ summary: "Echo user" })
  .input(z.object({ id: z.string() }))
  .handler(({ input, context }) => ({ id: input.id, userId: context.user?.id ?? null }));

const boom = builder
  .meta({ mcp: true })
  .route({ summary: "Boom" })
  .handler(() => {
    throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND, "missing");
  });

const hidden = builder.route({ summary: "Hidden" }).handler(() => ({ ok: true }));

const router = {
  echo,
  nested: { boom },
  hidden,
};

const context: OrpcContext = {
  user: { id: "user-1", email: "a@b.test", name: null, role: UserRole.ADMIN },
  organizationId: null,
  ip: "127.0.0.1",
  actor: { type: "user", id: "user-1" },
  requestOrigin: null,
};

async function postJsonRpc(body: object) {
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
    const handler = createMcpHandler(router);
    const request = new Request("http://localhost/api/mcp", {
      method,
      headers: { accept: "text/event-stream" },
    });

    const { response } = await handler.handle(request, { context });

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
  });

  it("registers only mcp-marked procedures as tools", async () => {
    const { body } = await postJsonRpc({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} });
    const result = body.result as { tools: { name: string }[] };

    expect(result.tools.map((tool) => tool.name).sort()).toEqual(["echo", "nested_boom"]);
  });

  it("calls the procedure with request context", async () => {
    const { body } = await postJsonRpc({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: { name: "echo", arguments: { id: "abc" } },
    });
    const result = body.result as { content: { type: string; text: string }[]; isError?: boolean };

    expect(result.isError).toBeFalsy();
    expect(JSON.parse(result.content[0]?.text ?? "")).toEqual({ id: "abc", userId: "user-1" });
  });

  it("returns isError when the procedure throws a domain error", async () => {
    const { body } = await postJsonRpc({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "nested_boom", arguments: {} },
    });
    const result = body.result as { content: { type: string; text: string }[]; isError?: boolean };

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("missing");
  });

  it("returns screenshot bytes as an image", async () => {
    const picture = builder
      .meta({ mcp: true })
      .route({ summary: "Picture" })
      .handler(() => new Blob([Uint8Array.from([1, 2, 3])], { type: "image/png" }));
    const handler = createMcpHandler({ picture });
    const request = new Request("http://localhost/api/mcp", {
      method: "POST",
      headers: { accept: "application/json, text/event-stream", "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "picture", arguments: {} } }),
    });

    const { response } = await handler.handle(request, { context });
    const body = (await response.json()) as {
      result: { content: { type: string; data?: string; mimeType?: string }[] };
    };

    expect(body.result.content[0]).toEqual({
      type: "image",
      data: Buffer.from(Uint8Array.from([1, 2, 3])).toString("base64"),
      mimeType: "image/png",
    });
  });
});
