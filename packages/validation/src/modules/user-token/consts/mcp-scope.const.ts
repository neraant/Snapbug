import { z } from "zod";

export const MCP_TOOL_SCOPES = [
  "tickets:read",
  "tickets:write",
  "comments:read",
  "comments:write",
  "projects:read",
  "members:read",
  "stats:read",
  "activity:read",
] as const;

export const mcpToolScopeSchema = z.enum(MCP_TOOL_SCOPES);

export type McpToolScopeType = z.infer<typeof mcpToolScopeSchema>;

const WRITE_TO_READ: Partial<Record<McpToolScopeType, McpToolScopeType>> = {
  "tickets:write": "tickets:read",
  "comments:write": "comments:read",
};

export function expandMcpScopes(scopes: readonly McpToolScopeType[]): McpToolScopeType[] {
  const expanded = new Set<McpToolScopeType>(scopes);
  for (const scope of scopes) {
    const implied = WRITE_TO_READ[scope];
    if (implied) expanded.add(implied);
  }
  return [...expanded];
}

export const USER_TOKEN_SCOPE_PRESETS = ["readOnly", "readAndComment", "fullAccess", "custom"] as const;

export const userTokenScopePresetSchema = z.enum(USER_TOKEN_SCOPE_PRESETS);

export type UserTokenScopePresetType = z.infer<typeof userTokenScopePresetSchema>;

export const MCP_READ_SCOPES: McpToolScopeType[] = [
  "tickets:read",
  "comments:read",
  "projects:read",
  "members:read",
  "stats:read",
  "activity:read",
];

export const MCP_WRITE_SCOPES: McpToolScopeType[] = ["tickets:write", "comments:write"];

export const LEGACY_USER_TOKEN_SCOPES: McpToolScopeType[] = [
  "tickets:read",
  "tickets:write",
  "comments:read",
  "comments:write",
];

type PresetScopesOptions = {
  includeActivityRead?: boolean;
};

export function presetScopes(
  preset: Exclude<UserTokenScopePresetType, "custom">,
  options?: PresetScopesOptions,
): McpToolScopeType[] {
  const includeActivityRead = options?.includeActivityRead ?? true;
  const readScopes = includeActivityRead
    ? MCP_READ_SCOPES
    : MCP_READ_SCOPES.filter((scope) => scope !== "activity:read");

  switch (preset) {
    case "readOnly":
      return readScopes.filter((scope) => scope !== "activity:read");
    case "readAndComment":
      return [...presetScopes("readOnly", options), "comments:write"];
    case "fullAccess":
      return [...readScopes, ...MCP_WRITE_SCOPES];
  }
}
