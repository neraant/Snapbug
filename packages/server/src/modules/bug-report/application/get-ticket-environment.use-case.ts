import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { assertMcpProjectAllowed } from "@workspace/server/shared/orpc/mcp/mcp-project-scope.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  GetTicketEnvironmentInputDtoType,
  GetTicketEnvironmentOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/get-ticket-environment.schema";

export class GetTicketEnvironmentUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly bugReportRepository: BugReportRepository,
  ) {}

  async execute(
    input: GetTicketEnvironmentInputDtoType,
    userId: string,
    mcpProjectIds?: string[] | null,
  ): Promise<GetTicketEnvironmentOutputDtoType> {
    const ticket = await this.findAccessibleTicket(input.shortId, userId, mcpProjectIds);
    return {
      shortId: ticket.shortId,
      url: ticket.url,
      userAgent: ticket.userAgent,
      browser: ticket.browser,
      os: ticket.os,
      device: ticket.device,
      viewportWidth: ticket.viewportWidth,
      viewportHeight: ticket.viewportHeight,
    };
  }

  private async findAccessibleTicket(shortId: string, userId: string, mcpProjectIds?: string[] | null) {
    const candidates = await this.bugReportRepository.findManyByShortId(shortId);
    for (const candidate of candidates) {
      const membership = await this.membershipPort.findByUserAndOrganization({
        userId,
        organizationId: candidate.organizationId,
      });
      if (!membership) continue;
      const allowedProjectIds = await this.membershipPort.filterProjectIds(membership, [candidate.bugReport.projectId]);
      if (allowedProjectIds.length === 0) continue;
      try {
        assertMcpProjectAllowed(candidate.bugReport.projectId, mcpProjectIds);
      } catch {
        continue;
      }
      return candidate.bugReport;
    }
    throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);
  }
}