import type { McpToolCatalogEntryType } from "@workspace/server/shared/orpc/mcp/mcp-tool-catalog.const";
import type { McpToolAreaType } from "@workspace/validation/modules/mcp/dto/list-tools.schema";

export type McpToolUiEntryType = {
  area: McpToolAreaType;
  shortDescription: string;
  returns: string;
  examplePrompt: string;
  exampleArguments: Record<string, unknown>;
};

export const MCP_TOOL_UI_BY_NAME = {
  list_tickets: {
    area: "tickets",
    shortDescription: "Find tickets by status, severity, or text",
    returns: "Paginated ticket summaries with optional filters.",
    examplePrompt: "Show me the high severity tickets that are new",
    exampleArguments: { severity: "high", status: "new", limit: 20 },
  },
  get_ticket: {
    area: "tickets",
    shortDescription: "Open one ticket by short id",
    returns: "Full ticket fields, assignee, and organization id.",
    examplePrompt: "Get the details for ticket SNB-12",
    exampleArguments: { id: "SNB-12" },
  },
  get_screenshot: {
    area: "tickets",
    shortDescription: "Download a ticket screenshot",
    returns: "Screenshot image bytes for the ticket.",
    examplePrompt: "Show the screenshot for SNB-12",
    exampleArguments: { id: "SNB-12" },
  },
  list_ticket_logs: {
    area: "tickets",
    shortDescription: "Read console and network logs for a ticket",
    returns: "Bounded console and network log summary.",
    examplePrompt: "What errors appear in the console for SNB-12?",
    exampleArguments: { id: "SNB-12" },
  },
  get_ticket_environment: {
    area: "tickets",
    shortDescription: "See browser, OS, and URL for a ticket",
    returns: "Browser, OS, device, URL, user agent, and viewport.",
    examplePrompt: "Which browser reproduced SNB-12?",
    exampleArguments: { id: "SNB-12" },
  },
  update_ticket: {
    area: "tickets",
    shortDescription: "Change status, severity, or assignee",
    returns: "Updated ticket fields.",
    examplePrompt: "Move SNB-12 to in progress and assign it to me",
    exampleArguments: { id: "SNB-12", status: "in_progress" },
  },
  add_comment: {
    area: "comments",
    shortDescription: "Add an internal note on a ticket",
    returns: "The created comment.",
    examplePrompt: "Leave a note on SNB-12 that I reproduced the issue",
    exampleArguments: { bugReportId: "00000000-0000-4000-8000-000000000001", body: "Reproduced locally." },
  },
  list_comments: {
    area: "comments",
    shortDescription: "Read the discussion on a ticket",
    returns: "Comments for the ticket thread.",
    examplePrompt: "What has the team said about SNB-12?",
    exampleArguments: { bugReportId: "00000000-0000-4000-8000-000000000001" },
  },
  list_projects: {
    area: "projects",
    shortDescription: "List projects you can access",
    returns: "Project ids, names, and slugs.",
    examplePrompt: "Which projects can I file tickets in?",
    exampleArguments: {},
  },
  get_project: {
    area: "projects",
    shortDescription: "Load one project by id",
    returns: "Project metadata including slug and settings.",
    examplePrompt: "What is the slug for my checkout project?",
    exampleArguments: { projectId: "00000000-0000-4000-8000-000000000002" },
  },
  list_members: {
    area: "members",
    shortDescription: "List teammates for assignment",
    returns: "Member ids, names, and roles.",
    examplePrompt: "Who can I assign tickets to?",
    exampleArguments: {},
  },
  get_overview_stats: {
    area: "overview",
    shortDescription: "Count open tickets by status and severity",
    returns: "Open ticket counts grouped by status and severity.",
    examplePrompt: "How many critical tickets are still open?",
    exampleArguments: {},
  },
  search: {
    area: "search",
    shortDescription: "Search tickets and projects by keyword",
    returns: "Matching tickets and projects in your scope.",
    examplePrompt: "Find tickets mentioning checkout",
    exampleArguments: { query: "checkout" },
  },
  list_activity: {
    area: "activity",
    shortDescription: "Review organization audit activity",
    returns: "Paginated audit events; admin only.",
    examplePrompt: "Who changed ticket SNB-12 this week?",
    exampleArguments: { limit: 20 },
  },
} as const satisfies Record<McpToolCatalogEntryType["name"], McpToolUiEntryType>;
