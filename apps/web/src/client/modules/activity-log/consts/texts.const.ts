export const texts = {
  title: "Activity log",
  description: "Who changed an application object, when, and what changed.",
  empty: "No activity yet.",
  column: {
    who: "Who",
    when: "When",
    object: "Object",
    source: "Source",
    change: "What changed",
  },
  source: {
    web: "Web",
    mcp: "MCP",
  },
  entity: {
    organization: "Organization",
    membership: "Membership",
    invitation: "Invitation",
    project: "Project",
    "api-key": "Project key",
    "bug-report": "Ticket",
    comment: "Comment",
    "project-access": "Project access",
  },
} as const;
