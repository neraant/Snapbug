import { CommentMapper } from "@workspace/server/modules/comment/entity/comment.mapper";
import type { BugReportPort } from "@workspace/server/modules/comment/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/comment/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/comment/port/project.port";
import type { UserPort } from "@workspace/server/modules/comment/port/user.port";
import type { CommentRepository } from "@workspace/server/modules/comment/repository/comment.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { assertMcpProjectAllowed } from "@workspace/server/shared/orpc/mcp/mcp-project-scope.util";
import type { BugReportModelType } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import type {
  FindCommentsInputDtoType,
  FindCommentsOutputDtoType,
} from "@workspace/validation/modules/comment/dto/find-comments.schema";

export class FindCommentsUseCase {
  constructor(
    private readonly bugReportPort: BugReportPort,
    private readonly projectPort: ProjectPort,
    private readonly membershipPort: MembershipPort,
    private readonly userPort: UserPort,
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(
    input: FindCommentsInputDtoType,
    userId: string,
    mcpProjectIds?: string[] | null,
  ): Promise<FindCommentsOutputDtoType> {
    const bugReport = await this.loadTicket(input.bugReportId, userId, mcpProjectIds);

    const comments = await this.commentRepository.findManyByBugReportId(bugReport.id);
    if (comments.length === 0) return [];

    const authors = await this.userPort.findManyByIds(comments.map((comment) => comment.authorUserId));
    const authorsById = new Map(authors.map((author) => [author.id, author]));

    return comments.map((comment) => CommentMapper.toDto(comment, authorsById.get(comment.authorUserId) ?? null));
  }

  private async loadTicket(
    bugReportId: string,
    userId: string,
    mcpProjectIds?: string[] | null,
  ): Promise<BugReportModelType> {
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

    return bugReport;
  }
}
