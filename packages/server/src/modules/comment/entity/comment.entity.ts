import type { CommentPersistedType } from "@workspace/server/modules/comment/entity/comment.types";

export class Comment {
  readonly id: CommentPersistedType["id"];
  readonly bugReportId: CommentPersistedType["bugReportId"];
  readonly authorUserId: CommentPersistedType["authorUserId"];
  readonly body: CommentPersistedType["body"];
  readonly authorSource: CommentPersistedType["authorSource"];
  readonly createdAt: CommentPersistedType["createdAt"];
  readonly updatedAt: CommentPersistedType["updatedAt"];

  constructor(comment: CommentPersistedType) {
    this.id = comment.id;
    this.bugReportId = comment.bugReportId;
    this.authorUserId = comment.authorUserId;
    this.body = comment.body;
    this.authorSource = comment.authorSource;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
  }

  toObject(): CommentPersistedType {
    return {
      id: this.id,
      bugReportId: this.bugReportId,
      authorUserId: this.authorUserId,
      body: this.body,
      authorSource: this.authorSource,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  updateBody(body: string): Comment {
    if (body === this.body) {
      return this;
    }

    return new Comment({
      ...this.toObject(),
      body,
      updatedAt: new Date(),
    });
  }
}
