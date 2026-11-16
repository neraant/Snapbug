import type { McpToolScopeType } from "@workspace/validation/modules/user-token/consts/mcp-scope.const";

export type McpScopeGroupIdType =
  | "tickets"
  | "comments"
  | "projects"
  | "members"
  | "stats"
  | "activity";

export type McpScopeGroupMetaType = {
  id: McpScopeGroupIdType;
  readScope: McpToolScopeType;
  writeScope?: McpToolScopeType;
  toolNames: string[];
};

export const MCP_SCOPE_GROUPS: McpScopeGroupMetaType[] = [
  {
    id: "tickets",
    readScope: "tickets:read",
    writeScope: "tickets:write",
    toolNames: [
      "list_tickets",
      "get_ticket",
      "get_screenshot",
      "list_ticket_logs",
      "get_ticket_environment",
      "search",
    ],
  },
  {
    id: "comments",
    readScope: "comments:read",
    writeScope: "comments:write",
    toolNames: ["list_comments", "add_comment"],
  },
  {
    id: "projects",
    readScope: "projects:read",
    toolNames: ["list_projects", "get_project"],
  },
  {
    id: "members",
    readScope: "members:read",
    toolNames: ["list_members"],
  },
  {
    id: "stats",
    readScope: "stats:read",
    toolNames: ["get_overview_stats"],
  },
  {
    id: "activity",
    readScope: "activity:read",
    toolNames: ["list_activity"],
  },
];

export const MCP_TOOL_COUNT = MCP_SCOPE_GROUPS.reduce((count, group) => count + group.toolNames.length, 0);