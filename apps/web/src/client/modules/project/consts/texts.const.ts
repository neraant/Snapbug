export const texts = {
  title: "Projects",
  newProject: "New project",
  search: {
    ariaLabel: "Search projects",
    placeholder: "Search projects…",
    clear: "Clear search",
  },
  empty: {
    title: "No projects yet",
    description: "Create a project to start collecting bug reports.",
  },
  emptyFiltered: {
    title: "No matching projects",
    description: "Try a different search term.",
  },
  card: {
    openIssues: (count: number) => (count === 1 ? "1 open issue" : `${count} open issues`),
    created: (dateLabel: string) => `Created ${dateLabel}`,
    menu: "Project actions",
    settings: "Settings",
    archive: "Archive",
    member: (name: string) => name,
    moreMembers: (count: number) => `+${count}`,
  },
  createSheet: {
    title: "New project",
    description: "Add a project for your team to triage bug reports.",
    field: {
      name: {
        label: "Project name",
        placeholder: "Default project",
        required: "Project name is required",
      },
      color: {
        label: "Color",
        swatchLabel: (color: string) => `Use color ${color}`,
      },
    },
    submit: "Create project",
    cancel: "Cancel",
  },
  toast: {
    createError: "Could not create the project. Try again.",
    missingOrganization: "Organization is not set up yet. Finish onboarding first.",
  },
} as const;
