import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AnySchema } from "@modelcontextprotocol/sdk/server/zod-compat.js";
import { normalizeObjectSchema } from "@modelcontextprotocol/sdk/server/zod-compat.js";
import { toJsonSchemaCompat } from "@modelcontextprotocol/sdk/server/zod-json-schema-compat.js";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const EMPTY_OBJECT_JSON_SCHEMA = { type: "object", properties: {} } as const;

type RegisteredMcpTool = {
  enabled: boolean;
  title?: string;
  description?: string;
  inputSchema?: AnySchema;
  outputSchema?: AnySchema;
  annotations?: Record<string, unknown>;
  execution?: unknown;
  _meta?: unknown;
};

function readRegisteredTools(server: McpServer): Record<string, RegisteredMcpTool> {
  return (server as unknown as { _registeredTools: Record<string, RegisteredMcpTool> })._registeredTools;
}

export function installScopedMcpToolsListHandler(server: McpServer, visibleToolNames: ReadonlySet<string>): void {
  server.server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: Object.entries(readRegisteredTools(server))
      .filter(([name, tool]) => tool.enabled && visibleToolNames.has(name))
      .map(([name, tool]) => {
        const toolDefinition: Record<string, unknown> = {
          name,
          title: tool.title,
          description: tool.description,
          inputSchema: (() => {
            const obj = normalizeObjectSchema(tool.inputSchema as AnySchema | undefined);
            return obj
              ? toJsonSchemaCompat(obj, {
                  strictUnions: true,
                  pipeStrategy: "input",
                })
              : EMPTY_OBJECT_JSON_SCHEMA;
          })(),
          annotations: tool.annotations,
          execution: tool.execution,
          _meta: tool._meta,
        };
        const outputObj = normalizeObjectSchema(tool.outputSchema as AnySchema | undefined);
        if (outputObj) {
          toolDefinition.outputSchema = toJsonSchemaCompat(outputObj, {
            strictUnions: true,
            pipeStrategy: "output",
          });
        }
        return toolDefinition;
      }),
  }));
}
