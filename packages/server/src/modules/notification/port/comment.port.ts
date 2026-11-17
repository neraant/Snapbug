export type NotificationCommentPort = {
  findAuthorUserIdsByBugReportId(bugReportId: string): Promise<string[]>;
};