import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export const texts = {
  overview: "Overview",
  tickets: "Tickets",
  sdkSetup: "SDK Setup",
  mcp: "MCP",
  playground: "Playground",
  projects: "Projects",
  team: "Team",
  settings: "Settings",
  organization: {
    ariaLabel: "Organization",
    create: "Create organization",
    empty: "No organization",
    switchError: "Could not switch organization. Try again.",
    role: {
      [UserRole.ADMIN]: "Admin",
      [UserRole.USER]: "Member",
    },
    dialog: {
      title: "Create organization",
      description: "Projects and tickets in this organization stay separate from your others.",
      nameLabel: "Name",
      namePlaceholder: "Acme",
      cancel: "Cancel",
      submit: "Create",
      error: "Could not create the organization. Try again.",
    },
  },
} as const;
