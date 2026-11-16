import { extractMcpToolInputFields } from "@workspace/server/shared/orpc/mcp/extract-mcp-tool-input-fields.util";
import { MCP_TOOL_CATALOG } from "@workspace/server/shared/orpc/mcp/mcp-tool-catalog.const";
import { MCP_TOOL_UI_BY_NAME } from "@workspace/server/shared/orpc/mcp/mcp-tool-ui.const";
import { listMcpTools } from "@workspace/server/shared/orpc/mcp/walk-mcp-tools";
import type {
  ListMcpToolsOutputDtoType,
  McpToolDtoType,
} from "@workspace/validation/modules/mcp/dto/list-tools.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class McpToolListingService {
  listForRole(role: UserRole | undefined, router: unknown): ListMcpToolsOutputDtoType {
    const isAdmin = role === UserRole.ADMIN;
    const toolsByName = new Map(listMcpTools(router).map((tool) => [tool.name, tool]));

    const tools: McpToolDtoType[] = MCP_TOOL_CATALOG.map((catalog) => {
      const runtime = toolsByName.get(catalog.name);
      const ui = MCP_TOOL_UI_BY_NAME[catalog.name];
      const inputSchema = runtime?.procedure["~orpc"].inputSchema;

      return {
        name: catalog.name,
        access: catalog.access,
        scope: catalog.scope,
        area: ui.area,
        shortDescription: ui.shortDescription,
        description: catalog.description,
        adminOnly: catalog.adminOnly,
        unavailable: catalog.adminOnly && !isAdmin,
        inputs: extractMcpToolInputFields(inputSchema as never),
        returns: ui.returns,
        examplePrompt: ui.examplePrompt,
        exampleCall: JSON.stringify(
          {
            name: catalog.name,
            arguments: ui.exampleArguments,
          },
          null,
          2,
        ),
      };
    });

    return {
      tools,
      summary: {
        total: tools.length,
        read: tools.filter((tool) => tool.access === "read").length,
        write: tools.filter((tool) => tool.access === "write").length,
      },
    };
  }
}
