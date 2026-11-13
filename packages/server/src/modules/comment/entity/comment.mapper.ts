import { Comment } from "@workspace/server/modules/comment/entity/comment.entity";
import type { CommentPersistedType } from "@workspace/server/modules/comment/entity/comment.types";
import type { CommentModelType } from "@workspace/validation/modules/comment/dto/comment.model";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export abstract class CommentMapper {
  static fromPersistence(row: CommentPersistedType): Comment {
    return new Comment(row);
  }

  static toPersistence(comment: Comment): CommentPersistedType {
    return comment.toObject();
  }

  static toAudit(comment: Comment) {
    const row = comment.toObject();
    return {
      bugReportId: row.bugReportId,
      authorUserId: row.authorUserId,
      body: row.body,
    };
  }

  static toDto(comment: Comment, author: UserModelType | null): CommentModelType {
    const row = comment.toObject();
    return {
      id: row.id,
      bugReportId: row.bugReportId,
      authorUserId: row.authorUserId,
      authorName: author?.name ?? null,
      authorEmail: author?.email ?? null,
      body: row.body,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
