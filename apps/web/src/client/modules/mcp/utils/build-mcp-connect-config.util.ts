import type { McpConnectClient } from "@/client/modules/mcp/consts/mcp-tool-filter.const";

const tokenPlaceholder = "YOUR_TOKEN";

export function buildMcpConnectConfig(origin: string, client: McpConnectClient): string {
  const url = `${origin}/api/mcp`;

  if (client === "claude-code") {
    return `claude mcp add snapbug --transport http --url ${url} --header "Authorization: Bearer ${tokenPlaceholder}"`;
  }

  const config = {
    mcpServers: {
      snapbug: {
        url,
        headers: {
          Authorization: `Bearer ${tokenPlaceholder}`,
        },
      },
    },
  };

  if (client === "other") {
    return `// Replace YOUR_TOKEN with a token from the Tokens tab.\n${JSON.stringify(config, null, 2)}`;
  }

  return JSON.stringify(config, null, 2);
}
