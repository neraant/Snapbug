import type { DbClient } from "@workspace/database";
import type { Comment } from "@workspace/server/modules/comment/entity/comment.entity";
import { CommentMapper } from "@workspace/server/modules/comment/entity/comment.mapper";
import type { CommentRepository } from "@workspace/server/modules/comment/repository/comment.repository";
import type { AuditLogService } from "@workspace/server/shared/audit/audit-log.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";

const COMMENT_ENTITY_TYPE = "comment";

export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly auditLogService: AuditLogService,
    private readonly actor: AuditActor | null = null,
  ) {}

  withTx(tx: DbClient): CommentService {
    return new CommentService(this.commentRepository.withTx(tx), this.auditLogService.withTx(tx), this.actor);
  }

  withActor(actor: AuditActor | null): CommentService {
    return new CommentService(this.commentRepository, this.auditLogService, actor);
  }

  async saveWithAudit(comment: Comment, projectId: string, action: string): Promise<void> {
    const previous = await this.commentRepository.findById(comment.id);
    await this.commentRepository.save(comment);

    await this.auditLogService.save({
      action,
      entityType: COMMENT_ENTITY_TYPE,
      entityId: comment.id,
      projectId,
      actor: this.actor,
      oldSnapshot: previous ? CommentMapper.toAudit(previous) : null,
      newSnapshot: CommentMapper.toAudit(comment),
    });
  }
}
