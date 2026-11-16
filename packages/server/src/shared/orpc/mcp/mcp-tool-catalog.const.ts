export type McpToolAccessType = "read" | "write";

export type McpToolScopeType =
  | "tickets:read"
  | "tickets:write"
  | "comments:read"
  | "comments:write"
  | "projects:read"
  | "members:read"
  | "stats:read"
  | "activity:read";

export type McpToolCatalogEntryType = {
  name: string;
  module: string;
  procedure: string;
  description: string;
  access: McpToolAccessType;
  scope: McpToolScopeType;
  adminOnly: boolean;
  destructiveHint: boolean;
  reason: string;
};

export const MCP_TOOL_CATALOG = [
  {
    name: "list_tickets",
    module: "bugReport",
    procedure: "listTickets",
    description:
      "List bug tickets the token owner can access. Use when you need several tickets with optional filters (project, status, severity, assignee, text search). Returns a paginated summary without console/network logs or replay. Follow nextCursor until it is null.",
    access: "read",
    scope: "tickets:read",
    adminOnly: false,
    destructiveHint: false,
    reason: "Core triage workflow for agents fixing bugs.",
  },
  {
    name: "get_ticket",
    module: "bugReport",
    procedure: "findOne",
    description:
      "Fetch one ticket by short id (for example SNB-12). Use when you already know the id from search or list_tickets. Returns full ticket fields, assignee, and organization id.",
    access: "read",
    scope: "tickets:read",
    adminOnly: false,
    destructiveHint: false,
    reason: "Inspect a single report without listing everything.",
  },
  {
    name: "get_screenshot",
    module: "bugReport",
    procedure: "findScreenshot",
    description:
      "Download the ticket screenshot as an image. Use after get_ticket when hasScreenshot is true and you need visual context.",
    access: "read",
    scope: "tickets:read",
    adminOnly: false,
    destructiveHint: false,
    reason: "Visual debugging for agents.",
  },
  {
    name: "list_ticket_logs",
    module: "bugReport",
    procedure: "listTicketLogs",
    description:
      "Return a bounded console and network log summary for one ticket. Use when debugging client errors; output is capped and excludes secrets.",
    access: "read",
    scope: "tickets:read",
    adminOnly: false,
    destructiveHint: false,
    reason: "Agents need logs without loading full ingest payloads on every list.",
  },
  {
    name: "get_ticket_environment",
    module: "bugReport",
    procedure: "getTicketEnvironment",
    description:
      "Return browser, OS, device, URL, user agent, and viewport for a ticket. Use to understand reproduction environment without fetching logs or screenshots.",
    access: "read",
    scope: "tickets:read",
    adminOnly: false,
    destructiveHint: false,
    reason: "Environment context is safe and bounded.",
  },
  {
    name: "update_ticket",
    module: "bugReport",
    procedure: "updateTicketMcp",
    description:
      "Update ticket status, severity, or assignee. Use when triaging or handing off work. Changes are audited as mcp.",
    access: "write",
    scope: "tickets:write",
    adminOnly: false,
    destructiveHint: false,
    reason: "Allows agents to move tickets through the workflow.",
  },
  {
    name: "add_comment",
    module: "comment",
    procedure: "addComment",
    description:
      "Add an internal comment to a ticket thread. Use to leave notes for humans or document what you tried.",
    access: "write",
    scope: "comments:write",
    adminOnly: false,
    destructiveHint: false,
    reason: "Agents coordinate through the same thread as the team.",
  },
  {
    name: "list_comments",
    module: "comment",
    procedure: "findComments",
    description: "List comments on a ticket by bug report id. Use before add_comment to read existing discussion.",
    access: "read",
    scope: "comments:read",
    adminOnly: false,
    destructiveHint: false,
    reason: "Read thread context before writing.",
  },
  {
    name: "list_projects",
    module: "project",
    procedure: "listProjects",
    description:
      "List projects the token owner can access with ids, names, and slugs. Use to pick a projectId for filters or stats.",
    access: "read",
    scope: "projects:read",
    adminOnly: false,
    destructiveHint: false,
    reason: "Agents need project ids without admin project APIs.",
  },
  {
    name: "get_project",
    module: "project",
    procedure: "getProject",
    description:
      "Fetch one project by id when the owner has access. Use after list_projects to confirm settings or slug.",
    access: "read",
    scope: "projects:read",
    adminOnly: false,
    destructiveHint: false,
    reason: "Resolve project metadata for a known id.",
  },
  {
    name: "list_members",
    module: "membership",
    procedure: "listMembers",
    description:
      "List organization members with id, name, and role so you can assign tickets. Emails are omitted for non-admin callers.",
    access: "read",
    scope: "members:read",
    adminOnly: false,
    destructiveHint: false,
    reason: "Assignment requires member ids without invitation or role APIs.",
  },
  {
    name: "get_overview_stats",
    module: "bugReport",
    procedure: "getOverviewStats",
    description:
      "Return open ticket counts grouped by status and severity for one project or all accessible projects. Use for situational awareness before diving into tickets.",
    access: "read",
    scope: "stats:read",
    adminOnly: false,
    destructiveHint: false,
    reason: "Lightweight stats without chart endpoints.",
  },
  {
    name: "search",
    module: "search",
    procedure: "search",
    description:
      "Search tickets and projects in the same scope as the in-app search. Use when you know a keyword but not the short id.",
    access: "read",
    scope: "tickets:read",
    adminOnly: false,
    destructiveHint: false,
    reason: "Keyword discovery across accessible data.",
  },
  {
    name: "list_activity",
    module: "audit",
    procedure: "listActivity",
    description:
      "List organization audit activity (admin only). Use to see who changed tickets or projects. Paginate with nextCursor.",
    access: "read",
    scope: "activity:read",
    adminOnly: true,
    destructiveHint: false,
    reason: "Admins debugging team actions; members must not see it.",
  },
] as const satisfies readonly McpToolCatalogEntryType[];

export const MCP_TOOL_CATALOG_BY_NAME = Object.fromEntries(
  MCP_TOOL_CATALOG.map((entry) => [entry.name, entry]),
) as Record<(typeof MCP_TOOL_CATALOG)[number]["name"], (typeof MCP_TOOL_CATALOG)[number]>;

export const MCP_EXCLUDED_MODULE_PREFIXES = [
  "userToken",
  "apiKey",
  "auth",
  "identity",
  "invitation",
  "organization",
] as const;
