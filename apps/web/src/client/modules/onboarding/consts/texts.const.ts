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
    skip: "Skip onboarding",
  },
  toast: {
    completeError: "Could not finish onboarding. Try again.",
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
    description: "Name your first project. You can connect the SDK later from project settings.",
    field: {
      name: {
        label: "Project name",
        placeholder: "Default project",
        hint: "Default: Default project (editable later in Project Settings).",
      },
    },
    toast: {
      error: "Could not save your project. Try again.",
    },
  },
  teammate: {
    title: "Invite your teammates",
    description: "Bugs are caught faster together. Skip onboarding to invite teammates later from Settings.",
    field: {
      label: "Email",
      placeholder: "colleague@company.com",
    },
    addAnother: "Add another teammate",
    removeInvite: "Remove teammate",
    ready: {
      title: "Everything is ready to roll",
      description: "We'll take you to your project's live triage feed.",
    },
    finish: "Finish setup & launch",
    skip: "Skip onboarding",
    validation: {
      invalidEmail: "Enter a valid email address",
      duplicateEmail: "This email is already on the list",
      tooManyInvites: "You can invite up to 10 teammates at a time",
    },
    toast: {
      sendError: "Could not send invitations. Try again.",
    },
  },
} as const;
