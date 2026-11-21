import { CommentMapper } from "@workspace/server/modules/comment/entity/comment.mapper";
import type { BugReportPort } from "@workspace/server/modules/comment/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/comment/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/comment/port/project.port";
import type { UserPort } from "@workspace/server/modules/comment/port/user.port";
import type { CommentRepository } from "@workspace/server/modules/comment/repository/comment.repository";
import type { CommentService } from "@workspace/server/modules/comment/service/comment.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import type {
  UpdateCommentInputDtoType,
  UpdateCommentOutputDtoType,
} from "@workspace/validation/modules/comment/dto/update-comment.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class UpdateCommentUseCase {
  constructor(
    private readonly bugReportPort: BugReportPort,
    private readonly projectPort: ProjectPort,
    private readonly membershipPort: MembershipPort,
    private readonly userPort: UserPort,
    private readonly commentRepository: CommentRepository,
    private readonly commentService: CommentService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: UpdateCommentInputDtoType,
    userId: string,
    actor: AuditActor,
  ): Promise<UpdateCommentOutputDtoType> {
    const comment = await this.commentRepository.findById(input.id);
    if (!comment) {
      throw new NotFoundError(ERROR_CODES.COMMENT_NOT_FOUND);
    }

    const ticket = await this.loadTicket(comment.bugReportId, userId);

    if (isReportAuthor(ticket.caller.email, ticket.bugReport.reporterEmail)) {
      throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);
    }

    if (comment.authorUserId !== userId) {
      throw new ForbiddenError(ERROR_CODES.CANNOT_MANAGE_COMMENT, "You can only edit your own comment.");
    }

    const updatedComment = comment.updateBody(input.body);

    if (updatedComment === comment) {
      return CommentMapper.toDto(comment, ticket.caller);
    }

    await this.withTransaction(async (tx) => {
      await this.commentService
        .withTx(tx)
        .withActor(actor)
        .saveWithAudit(updatedComment, ticket.projectId, "Update comment");
    });

    const author = (await this.userPort.findManyByIds([updatedComment.authorUserId]))[0] ?? null;
    return CommentMapper.toDto(updatedComment, author);
  }

  private async loadTicket(bugReportId: string, userId: string): Promise<AccessibleTicket> {
    const bugReport = await this.bugReportPort.findById(bugReportId);
    if (!bugReport) throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);

    const project = await this.projectPort.findById(bugReport.projectId);
    if (!project) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: project.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const allowedProjectIds = await this.membershipPort.filterProjectIds(membership, [bugReport.projectId]);
    if (allowedProjectIds.length === 0) throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);

    const caller = (await this.userPort.findManyByIds([userId]))[0];
    if (!caller) throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND);

    return { bugReport, projectId: project.id, caller };
  }
}

type AccessibleTicket = {
  bugReport: BugReportModelType;
  projectId: string;
  caller: UserModelType;
};

function isReportAuthor(callerEmail: string, reporterEmail: string | null): boolean {
  if (!reporterEmail) return false;
  return callerEmail.toLowerCase() === reporterEmail.toLowerCase();
}
