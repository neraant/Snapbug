import type { CommentAdapter } from "@workspace/server/modules/comment/adapter/comment.adapter";
import type { NotificationCommentPort } from "@workspace/server/modules/notification/port/comment.port";

export class NotificationCommentAdapter implements NotificationCommentPort {
  constructor(private readonly commentAdapter: CommentAdapter) {}

  async findAuthorUserIdsByBugReportId(bugReportId: string): Promise<string[]> {
    return await this.commentAdapter.findAuthorUserIdsByBugReportId(bugReportId);
  }
}
