import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { type AnyProcedure, createProcedureClient } from "@orpc/server";
import { listMcpTools } from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";

export type McpHandlerType = {
  handle(request: Request, options: { context: object }): Promise<{ response: Response }>;
};

export function createMcpHandler(router: unknown): McpHandlerType {
  return {
    async handle(request, { context }) {
      if (request.method !== "POST") {
        return { response: new Response(null, { status: 405, headers: { Allow: "POST" } }) };
      }

      const server = new McpServer({ name: "Snapbug MCP", version: "1.0.0" });

      for (const tool of listMcpTools(router)) {
        registerMcpTool(server, tool.name, tool.description, tool.procedure, context);
      }

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
  description: string | undefined,
  procedure: AnyProcedure,
  context: object,
): void {
  const inputSchema = procedure["~orpc"].inputSchema;

  server.registerTool(
    name,
    {
      description,
      ...(inputSchema ? { inputSchema: inputSchema as never } : {}),
      annotations: { readOnlyHint: true },
    },
    async (args) => {
      try {
        const result = await createProcedureClient(procedure, { context })(args);
        return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { isError: true, content: [{ type: "text" as const, text: message }] };
      }
    },
  );
}
