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
  chart: {
    reportsOverTime: {
      title: "Reports over time",
      description: "Daily created and resolved reports for the selected period.",
      seriesAriaLabel: "Chart series",
      series: {
        all: "All",
        created: "Created",
        resolved: "Resolved",
      },
      legend: {
        created: "Created",
        resolved: "Resolved",
      },
    },
    bySeverity: {
      title: "By severity",
      description: "New reports in the selected period, grouped by severity.",
      centerLabel: "Tickets",
      severityLabels: {
        critical: "Critical",
        high: "High",
        low: "Low",
        medium: "Medium",
      },
    },
  },
} as const;
