import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { type AnyProcedure, createProcedureClient } from "@orpc/server";
import { EvaluateMcpToolAccessUseCase } from "@workspace/server/modules/user-token/application/evaluate-mcp-tool-access.use-case";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import { installScopedMcpToolsListHandler } from "@workspace/server/shared/orpc/mcp/mcp-tool-list-handler.util";
import {
  filterMcpToolsForRole,
  filterMcpToolsForTokenList,
  listMcpTools,
} from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";

export type McpHandlerType = {
  handle(request: Request, options: { context: object }): Promise<{ response: Response }>;
};

const evaluateMcpToolAccess = new EvaluateMcpToolAccessUseCase();

export function createMcpHandler(router: unknown): McpHandlerType {
  return {
    async handle(request, { context }) {
      if (request.method !== "POST") {
        return { response: new Response(null, { status: 405, headers: { Allow: "POST" } }) };
      }

      const orpcContext = context as OrpcContext;
      const server = new McpServer({ name: "Snapbug MCP", version: "1.0.0" });
      const allTools = listMcpTools(router);
      const registeredTools = filterMcpToolsForRole(allTools, orpcContext);
      const listableTools = filterMcpToolsForTokenList(allTools, orpcContext);

      for (const tool of registeredTools) {
        registerMcpTool(
          server,
          tool.name,
          tool.description,
          tool.readOnlyHint,
          tool.destructiveHint,
          tool.procedure,
          orpcContext,
        );
      }

      installScopedMcpToolsListHandler(server, new Set(listableTools.map((tool) => tool.name)));

      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });
      await server.connect(transport);
      return { response: await transport.handleRequest(request) };
    },
  };
}

function registerMcpTool(
  server: McpServer,
  name: string,
  description: string,
  readOnlyHint: boolean,
  destructiveHint: boolean,
  procedure: AnyProcedure,
  context: OrpcContext,
): void {
  const inputSchema = procedure["~orpc"].inputSchema;

  server.registerTool(
    name,
    {
      description,
      ...(inputSchema ? { inputSchema: inputSchema as never } : {}),
      annotations: { readOnlyHint, destructiveHint },
    },
    async (args) => {
      if (context.mcp?.tokenScopes) {
        const access = evaluateMcpToolAccess.execute({
          toolName: name,
          tokenScopes: context.mcp.tokenScopes,
          userRole: context.user?.role,
        });
        if (!access.allowed && access.reason === "scope") {
          return {
            isError: true,
            content: [
              {
                type: "text" as const,
                text: `This token does not have the \`${access.missingScope}\` scope`,
              },
            ],
          };
        }
      }

      try {
        const result = await createProcedureClient(procedure, { context })(args);
        if (result instanceof Blob) {
          const bytes = new Uint8Array(await result.arrayBuffer());
          return {
            content: [
              {
                type: "image" as const,
                data: Buffer.from(bytes).toString("base64"),
                mimeType: result.type || "application/octet-stream",
              },
            ],
          };
        }
        return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { isError: true, content: [{ type: "text" as const, text: message }] };
      }
    },
  );
}
