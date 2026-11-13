import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

export const texts = {
  issue: {
    descriptionTitle: "Issue description",
    emptyDescription: "No description provided.",
  },
  comments: {
    title: "Comments",
    description: "Internal notes for the team. The report author does not see them.",
    empty: "No comments yet.",
    fieldLabel: "Comment",
    submit: "Add comment",
    unknownAuthor: "Teammate",
    submitError: "Could not add the comment.",
  },
  screenshot: {
    title: "Screenshot",
    empty: "No screenshot attached.",
    imageAlt: "Bug report screenshot",
  },
  replay: {
    title: "Session replay",
    empty: "No session replay attached.",
    loadFailed: "Could not load session replay.",
    playSession: "Play session replay",
  },
  diagnostics: {
    title: "Technical diagnostics",
    console: "Console",
    network: "Network",
    customContext: "Custom context",
    emptyConsole: "No console logs captured.",
    emptyNetwork: "No network logs captured.",
    emptyCustomContext: "No custom context provided.",
    ariaLabel: "Diagnostics view",
  },
  sidebar: {
    propertiesTitle: "Ticket properties",
    environmentTitle: "Client environment",
    status: "Status",
    severity: "Severity",
    assignee: "Assignee",
    project: "Project",
    reporter: "Reporter",
    created: "Created",
    updated: "Last updated",
    browser: "Browser",
    os: "OS",
    device: "Device",
    viewport: "Viewport",
    pageUrl: "Page URL",
    unassigned: "Unassigned",
    copyUrl: "Copy URL",
    copiedUrl: "Copied",
  },
  header: {
    statusAriaLabel: "Ticket status",
    severityAriaLabel: "Ticket severity",
  },
  statusLabels: {
    [BugReportStatus.NEW]: "New",
    [BugReportStatus.IN_PROGRESS]: "In progress",
    [BugReportStatus.RESOLVED]: "Resolved",
    [BugReportStatus.CLOSED]: "Closed",
  },
  severityLabels: {
    [BugReportSeverity.CRITICAL]: "Critical",
    [BugReportSeverity.HIGH]: "High",
    [BugReportSeverity.MEDIUM]: "Medium",
    [BugReportSeverity.LOW]: "Low",
  },
  toast: {
    statusUpdated: "Ticket status updated",
    severityUpdated: "Ticket severity updated",
    updateFailed: "Could not update ticket",
  },
} as const;
