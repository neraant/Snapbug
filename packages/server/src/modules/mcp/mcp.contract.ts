import { oc } from "@orpc/contract";
import { sessionAuthSpec } from "@workspace/server/shared/openapi/session-auth.const";
import { listMcpToolsOutputDtoSchema } from "@workspace/validation/modules/mcp/dto/list-tools.schema";

export const mcpContract = {
  listTools: oc.output(listMcpToolsOutputDtoSchema).route({
    method: "GET",
    path: "/mcp/tools",
    tags: ["mcp"],
    summary: "List MCP tools for the current member",
    spec: sessionAuthSpec,
  }),
};
