import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { commentTable } from "@workspace/database/schema/comment.const";
import type { Comment } from "@workspace/server/modules/comment/entity/comment.entity";
import { CommentMapper } from "@workspace/server/modules/comment/entity/comment.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { eq } from "drizzle-orm";

export class CommentRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): CommentRepository {
    return new CommentRepository(tx);
  }

  async findById(id: string): Promise<Comment | null> {
    const [row] = await this.db.select().from(commentTable).where(eq(commentTable.id, id));
    return row ? CommentMapper.fromPersistence(row) : null;
  }

  async findManyByBugReportId(bugReportId: string): Promise<Comment[]> {
    const rows = await this.db.query.commentTable.findMany({
      where: { bugReportId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((row) => CommentMapper.fromPersistence(row));
  }

  async save(comment: Comment): Promise<void> {
    try {
      await this.db.insert(commentTable).values(CommentMapper.toPersistence(comment));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
