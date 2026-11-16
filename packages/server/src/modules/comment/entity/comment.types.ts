import type { CommentAuthorSourceType } from "@workspace/validation/modules/comment/consts/comment-author-source.const";

export type CommentPersistedType = {
  id: string;
  bugReportId: string;
  authorUserId: string;
  body: string;
  authorSource: CommentAuthorSourceType;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CreateCommentType = {
  bugReportId: string;
  authorUserId: string;
  body: string;
  authorSource: CommentAuthorSourceType;
};
