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
    busiestHours: {
      title: "Busiest Hours Heatmap",
      description: "Distribution of report arrival times by day of week and hour of day (UTC)",
      weekdayLabels: {
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
        7: "Sun",
      },
      formatHourLabel: (hour: number) => `${hour}:00`,
      formatTooltip: (weekdayLabel: string, hour: number, count: number) =>
        `${weekdayLabel}, ${hour}:00 UTC — ${count} ${count === 1 ? "report" : "reports"}`,
      formatAccessibleName: (weekdayLabel: string, hour: number, count: number) =>
        `${weekdayLabel}, ${hour}:00 UTC, ${count} ${count === 1 ? "report" : "reports"}`,
      legendFewer: "Fewer reports",
      legendMore: "More reports",
    },
  },
  breakdown: {
    emptyList: "No reports in this period",
    byStatus: {
      title: "By status",
      description: "New reports in the selected period, grouped by status.",
      statusLabels: {
        new: "New",
        in_progress: "In progress",
        resolved: "Resolved",
        closed: "Closed",
      },
    },
    topPages: {
      title: "Top pages",
      description: "Pages with the most new reports in the selected period.",
      formatBugCount: (count: number) => (count === 1 ? "1 bug" : `${count} bugs`),
    },
    environment: {
      title: "Environment",
      description: "Where new reports came from in the selected period.",
      segmentAriaLabel: "Environment dimension",
      segmentLabels: {
        browser: "Browser",
        os: "OS",
        device: "Device",
      },
      formatShare: (count: number, total: number) => {
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        return `${count} (${percent}%)`;
      },
    },
  },
} as const;
