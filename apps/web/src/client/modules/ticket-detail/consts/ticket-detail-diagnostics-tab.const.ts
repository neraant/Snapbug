export const ticketDetailDiagnosticsTabs = {
  console: "console",
  network: "network",
  customContext: "customContext",
} as const;

export type TicketDetailDiagnosticsTab = (typeof ticketDetailDiagnosticsTabs)[keyof typeof ticketDetailDiagnosticsTabs];
