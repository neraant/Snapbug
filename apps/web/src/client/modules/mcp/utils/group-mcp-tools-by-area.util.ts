import type { McpToolAreaType, McpToolDtoType } from "@workspace/validation/modules/mcp/dto/list-tools.schema";

const areaOrder: McpToolAreaType[] = ["tickets", "comments", "projects", "members", "overview", "search", "activity"];

export function groupMcpToolsByArea(
  tools: McpToolDtoType[],
): Array<{ area: McpToolAreaType; tools: McpToolDtoType[] }> {
  const grouped = new Map<McpToolAreaType, McpToolDtoType[]>();

  for (const tool of tools) {
    const items = grouped.get(tool.area) ?? [];
    items.push(tool);
    grouped.set(tool.area, items);
  }

  return areaOrder.filter((area) => grouped.has(area)).map((area) => ({ area, tools: grouped.get(area) ?? [] }));
}
