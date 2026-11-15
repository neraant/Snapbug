export function buildMcpClientConfig(origin: string, token: string): string {
  const config = {
    mcpServers: {
      snapbug: {
        url: `${origin}/api/mcp`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  };

  return JSON.stringify(config, null, 2);
}
