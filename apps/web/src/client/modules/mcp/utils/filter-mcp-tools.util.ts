import type { McpToolDtoType } from "@workspace/validation/modules/mcp/dto/list-tools.schema";

import type { McpToolAccessFilter } from "@/client/modules/mcp/consts/mcp-tool-filter.const";
import { mcpToolAccessFilters } from "@/client/modules/mcp/consts/mcp-tool-filter.const";

type FilterMcpToolsInput = {
  tools: McpToolDtoType[];
  search: string;
  access: McpToolAccessFilter;
  area?: McpToolDtoType["area"];
};

export function filterMcpTools({ tools, search, access, area }: FilterMcpToolsInput): McpToolDtoType[] {
  const query = search.trim().toLowerCase();

  return tools.filter((tool) => {
    if (area && tool.area !== area) return false;
    if (access === mcpToolAccessFilters.read && tool.access !== "read") return false;
    if (access === mcpToolAccessFilters.write && tool.access !== "write") return false;
    if (!query) return true;

    return (
      tool.name.toLowerCase().includes(query) ||
      tool.shortDescription.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query)
    );
  });
}
