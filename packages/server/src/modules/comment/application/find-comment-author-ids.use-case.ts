import type { CommentRepository } from "@workspace/server/modules/comment/repository/comment.repository";

export class FindCommentAuthorIdsUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(bugReportId: string): Promise<string[]> {
    const comments = await this.commentRepository.findManyByBugReportId(bugReportId);
    return [...new Set(comments.map((comment) => comment.authorUserId))];
  }
}
