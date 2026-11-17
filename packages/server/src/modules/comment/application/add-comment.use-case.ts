import { CommentFactory } from "@workspace/server/modules/comment/entity/comment.factory";
import { CommentMapper } from "@workspace/server/modules/comment/entity/comment.mapper";
import type { BugReportPort } from "@workspace/server/modules/comment/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/comment/port/membership.port";
import type { CommentNotificationPort } from "@workspace/server/modules/comment/port/notification.port";
import type { ProjectPort } from "@workspace/server/modules/comment/port/project.port";
import type { UserPort } from "@workspace/server/modules/comment/port/user.port";
import type { CommentService } from "@workspace/server/modules/comment/service/comment.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { assertMcpProjectAllowed } from "@workspace/server/shared/orpc/mcp/mcp-project-scope.util";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import {
  CommentAuthorSource,
  type CommentAuthorSourceType,
} from "@workspace/validation/modules/comment/consts/comment-author-source.const";
import type {
  AddCommentInputDtoType,
  AddCommentOutputDtoType,
} from "@workspace/validation/modules/comment/dto/add-comment.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class AddCommentUseCase {
  constructor(
    private readonly bugReportPort: BugReportPort,
    private readonly projectPort: ProjectPort,
    private readonly membershipPort: MembershipPort,
    private readonly userPort: UserPort,
    private readonly commentService: CommentService,
    private readonly notificationPort: CommentNotificationPort,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: AddCommentInputDtoType,
    userId: string,
    actor: AuditActor,
    mcpProjectIds?: string[] | null,
  ): Promise<AddCommentOutputDtoType> {
    const ticket = await this.loadTicket(input.bugReportId, userId, mcpProjectIds);

    if (isReportAuthor(ticket.caller.email, ticket.bugReport.reporterEmail)) {
      throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);
    }

    const project = await this.projectPort.findById(ticket.projectId);
    if (!project) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    const comment = CommentFactory.create({
      bugReportId: ticket.bugReport.id,
      authorUserId: userId,
      body: input.body,
      authorSource: resolveAuthorSource(actor),
    });

    await this.withTransaction(async (tx) => {
      await this.commentService.withTx(tx).withActor(actor).saveWithAudit(comment, ticket.projectId, "Add comment");
      const actorUserId = actor.type === "user" || actor.type === "mcp" ? actor.id : null;
      await this.notificationPort.withTx(tx).commentCreated({
        organizationId: project.organizationId,
        actorUserId,
        projectId: ticket.projectId,
        ticketId: ticket.bugReport.id,
        assigneeUserId: ticket.bugReport.assignedTo,
        payload: {
          ticketShortId: ticket.bugReport.shortId,
          ticketTitle: ticket.bugReport.title,
          projectName: project.name,
          projectSlug: project.slug,
          actorName: ticket.caller.name ?? undefined,
        },
      });
    });

    return CommentMapper.toDto(comment, ticket.caller);
  }

  private async loadTicket(
    bugReportId: string,
    userId: string,
    mcpProjectIds?: string[] | null,
  ): Promise<AccessibleTicket> {
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

    assertMcpProjectAllowed(bugReport.projectId, mcpProjectIds);

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

function resolveAuthorSource(actor: AuditActor): CommentAuthorSourceType {
  return actor.type === "mcp" ? CommentAuthorSource.MCP : CommentAuthorSource.WEB;
}
