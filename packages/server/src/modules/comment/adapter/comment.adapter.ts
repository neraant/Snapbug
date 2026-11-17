import type { DbClient } from "@workspace/database";
import { FindCommentAuthorIdsUseCase } from "@workspace/server/modules/comment/application/find-comment-author-ids.use-case";
import type { CommentRepository } from "@workspace/server/modules/comment/repository/comment.repository";

export class CommentAdapter {
  private readonly findCommentAuthorIds: FindCommentAuthorIdsUseCase;

  constructor(private readonly commentRepository: CommentRepository) {
    this.findCommentAuthorIds = new FindCommentAuthorIdsUseCase(commentRepository);
  }

  withTx(tx: DbClient): CommentAdapter {
    return new CommentAdapter(this.commentRepository.withTx(tx));
  }

  async findAuthorUserIdsByBugReportId(bugReportId: string): Promise<string[]> {
    return await this.findCommentAuthorIds.execute(bugReportId);
  }
}
