import { Comment } from "@workspace/server/modules/comment/entity/comment.entity";
import type { CreateCommentType } from "@workspace/server/modules/comment/entity/comment.types";
import { randomUUID } from "crypto";

export abstract class CommentFactory {
  static create(comment: CreateCommentType): Comment {
    return new Comment({
      id: randomUUID(),
      bugReportId: comment.bugReportId,
      authorUserId: comment.authorUserId,
      body: comment.body,
      createdAt: new Date(),
    });
  }
}
