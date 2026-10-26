import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

export const texts = {
  title: "Tickets",
  description: "Bug reports with screenshots and session replay from your apps.",
  filter: {
    searchPlaceholder: "Search by title or ID",
    searchAriaLabel: "Search tickets",
    searchClear: "Clear search",
    severity: {
      ariaLabel: "Severity",
      all: "All severities",
    },
    period: {
      ariaLabel: "Period",
      all: "All time",
      last7Days: "Last 7 days",
      last30Days: "Last 30 days",
      last90Days: "Last 90 days",
    },
    clear: "Clear filters",
  },
  column: {
    [BugReportStatus.NEW]: {
      label: "New",
      hint: "Newly submitted bug reports waiting for triage.",
      empty: "No new reports",
    },
    [BugReportStatus.IN_PROGRESS]: {
      label: "In progress",
      hint: "Reports your team is actively working on.",
      empty: "Nothing in progress",
    },
    [BugReportStatus.RESOLVED]: {
      label: "Resolved",
      hint: "Fixed reports pending verification or closure.",
      empty: "No resolved reports",
    },
    [BugReportStatus.CLOSED]: {
      label: "Closed",
      hint: "Completed or archived bug reports.",
      empty: "No closed reports",
    },
    loadMore: "Load more",
  },
  card: {
    unassigned: "Unassigned",
    screenshot: "Screenshot attached",
    replay: "Session replay available",
  },
  severityLabels: {
    [BugReportSeverity.CRITICAL]: "Critical",
    [BugReportSeverity.HIGH]: "High",
    [BugReportSeverity.MEDIUM]: "Medium",
    [BugReportSeverity.LOW]: "Low",
  },
  empty: {
    noReportsTitle: "No bug reports yet",
    noReportsDescription: "Install the SDK and send your first report from the widget.",
    sdkSetupLink: "Go to SDK setup",
    filteredTitle: "No tickets match your filters",
    filteredDescription: "Try adjusting search, severity, or the time range.",
  },
  error: {
    title: "Could not load tickets",
    description: "Check your connection and try again.",
    retry: "Retry",
  },
  toast: {
    statusUpdated: "Ticket status updated",
    undo: "Undo",
    updateFailed: "Could not update ticket status",
  },
} as const;
