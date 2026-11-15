export type AuditBugReportLinkType = {
  id: string;
  shortId: string;
  projectId: string;
};

export type BugReportPort = {
  findManyByIds: (ids: string[]) => Promise<AuditBugReportLinkType[]>;
};
