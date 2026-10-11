export const texts = {
  filter: {
    project: {
      ariaLabel: "Project",
      allProjects: "All projects",
    },
    period: {
      ariaLabel: "Time range",
      last7Days: "Last 7 days",
      last30Days: "Last 30 days",
      last90Days: "Last 90 days",
    },
  },
  stat: {
    comparisonPeriod: (periodDays: number) => `vs previous ${periodDays} days`,
    card: {
      newReport: {
        title: "New reports",
      },
      openIssue: {
        title: "Open issues",
        valueHint: "New + In progress",
      },
      criticalHighOpen: {
        title: "Critical & High open",
      },
      medianTimeToResolve: {
        title: "Median time to resolve",
      },
    },
  },
} as const;
