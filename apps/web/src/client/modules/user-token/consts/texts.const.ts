export const texts = {
  title: "MCP",
  description:
    "Connect a normal MCP client with a personal token. Send it as a Bearer token to /api/mcp. A project key is not accepted.",
  create: {
    action: "Create token",
    error: "Could not create the token. Try again.",
  },
  secret: {
    title: "Copy this token",
    description: "This token is shown once. Store it now. You can revoke it later.",
    copy: "Copy",
    copied: "Copied",
  },
  column: {
    token: "Token",
    created: "Created",
    status: "Status",
  },
  status: {
    active: "Active",
    revoked: "Revoked",
  },
  revoke: {
    action: "Revoke",
    success: "Token revoked",
    error: "Could not revoke the token. Try again.",
  },
  empty: "No tokens yet.",
} as const;
