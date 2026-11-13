import { CommentMapper } from "@workspace/server/modules/comment/entity/comment.mapper";
import type { BugReportPort } from "@workspace/server/modules/comment/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/comment/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/comment/port/project.port";
import type { UserPort } from "@workspace/server/modules/comment/port/user.port";
import type { CommentRepository } from "@workspace/server/modules/comment/repository/comment.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import type {
  FindCommentsInputDtoType,
  FindCommentsOutputDtoType,
} from "@workspace/validation/modules/comment/dto/find-comments.schema";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export class FindCommentsUseCase {
  constructor(
    private readonly bugReportPort: BugReportPort,
    private readonly projectPort: ProjectPort,
    private readonly membershipPort: MembershipPort,
    private readonly userPort: UserPort,
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(input: FindCommentsInputDtoType, userId: string): Promise<FindCommentsOutputDtoType> {
    const ticket = await this.loadTicket(input.bugReportId, userId);

    if (isReportAuthor(ticket.caller.email, ticket.bugReport.reporterEmail)) {
      return [];
    }

    const comments = await this.commentRepository.findManyByBugReportId(ticket.bugReport.id);
    if (comments.length === 0) return [];

    const authors = await this.userPort.findManyByIds(comments.map((comment) => comment.authorUserId));
    const authorsById = new Map(authors.map((author) => [author.id, author]));

    return comments.map((comment) => CommentMapper.toDto(comment, authorsById.get(comment.authorUserId) ?? null));
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

    return { bugReport, caller };
  }
}

type AccessibleTicket = {
  bugReport: BugReportModelType;
  caller: UserModelType;
};

function isReportAuthor(callerEmail: string, reporterEmail: string | null): boolean {
  if (!reporterEmail) return false;
  return callerEmail.toLowerCase() === reporterEmail.toLowerCase();
}
