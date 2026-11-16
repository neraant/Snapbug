export const mcpToolAccessFilters = {
  all: "all",
  read: "read",
  write: "write",
} as const;

export type McpToolAccessFilter = (typeof mcpToolAccessFilters)[keyof typeof mcpToolAccessFilters];

export const mcpConnectClients = {
  cursor: "cursor",
  claudeDesktop: "claude-desktop",
  claudeCode: "claude-code",
  other: "other",
} as const;

export type McpConnectClient = (typeof mcpConnectClients)[keyof typeof mcpConnectClients];
