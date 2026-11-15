export type BugReportPort = {
  deleteProjectTicketsAndFiles: (projectId: string) => Promise<void>;
};
