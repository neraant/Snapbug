import type { CommentPersistedType } from "@workspace/server/modules/comment/entity/comment.types";

export class Comment {
  readonly id: CommentPersistedType["id"];
  readonly bugReportId: CommentPersistedType["bugReportId"];
  readonly authorUserId: CommentPersistedType["authorUserId"];
  readonly body: CommentPersistedType["body"];
  readonly createdAt: CommentPersistedType["createdAt"];

  constructor(comment: CommentPersistedType) {
    this.id = comment.id;
    this.bugReportId = comment.bugReportId;
    this.authorUserId = comment.authorUserId;
    this.body = comment.body;
    this.createdAt = comment.createdAt;
  }

  toObject(): CommentPersistedType {
    return {
      id: this.id,
      bugReportId: this.bugReportId,
      authorUserId: this.authorUserId,
      body: this.body,
      createdAt: this.createdAt,
    };
  }
}
