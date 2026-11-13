export type CommentPersistedType = {
  id: string;
  bugReportId: string;
  authorUserId: string;
  body: string;
  createdAt: Date;
};

export type CreateCommentType = {
  bugReportId: string;
  authorUserId: string;
  body: string;
};
