export const texts = {
  step: {
    of: (current: number, total: number) => `Step ${current} of ${total}`,
    organization: "Organization",
    project: "Connect App",
    teammate: "Teammates",
  },
  action: {
    back: "Back",
    continue: "Continue",
    skip: "Skip for now",
  },
  organization: {
    title: "Name your organization",
    description: "Projects, triage feeds, and settings live here. You can rename this anytime.",
    field: {
      label: "Organization name",
      placeholder: "Acme Labs",
      hint: "Defaults from your email if left blank",
    },
    toast: {
      error: "Could not save your organization. Try again.",
    },
  },
  project: {
    title: "Connect your app",
    description: "Install the SDK to start catching bugs in real time.",
    field: {
      name: {
        label: "Project name",
        placeholder: "Default project",
        hint: "Default: Default project (editable later in Project Settings).",
      },
    },
    install: {
      title: "Install & initialize",
      package: "@workspace/sdk",
      copy: "Copy",
      copied: "Copied",
    },
    toast: {
      error: "Could not save your project. Try again.",
    },
  },
  teammate: {
    title: "Invite your teammates",
    description: "Bugs are caught faster together. You can skip and invite later from Settings.",
    field: {
      placeholder: "colleague@company.com",
    },
    addAnother: "Add another teammate",
    ready: {
      title: "Everything is ready to roll",
      description: "We'll take you to your project's live triage feed.",
    },
    finish: "Finish setup & launch",
    skip: "Skip for now & launch without invites →",
  },
} as const;
