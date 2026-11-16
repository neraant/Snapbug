export const mcpTabSearchParamKey = "tab";

export const mcpTabs = {
  tools: "tools",
  connect: "connect",
  tokens: "tokens",
} as const;

export type McpTab = (typeof mcpTabs)[keyof typeof mcpTabs];

export const defaultMcpTab = mcpTabs.tools;
