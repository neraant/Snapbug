import type { CommentRepository } from "@workspace/server/modules/comment/repository/comment.repository";
import type { NotificationCommentPort } from "@workspace/server/modules/notification/port/comment.port";

export class NotificationCommentAdapter implements NotificationCommentPort {
  constructor(private readonly commentRepository: CommentRepository) {}

  async findAuthorUserIdsByBugReportId(bugReportId: string): Promise<string[]> {
    const comments = await this.commentRepository.findManyByBugReportId(bugReportId);
    return [...new Set(comments.map((comment) => comment.authorUserId))];
  }
}