import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { narrowProjectIds } from "@workspace/server/shared/orpc/mcp/mcp-project-scope.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import type {
  GetOverviewStatsInputDtoType,
  GetOverviewStatsOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/get-overview-stats.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export class GetOverviewStatsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportRepository: BugReportRepository,
  ) {}

  async execute(
    input: GetOverviewStatsInputDtoType,
    userId: string,
    organizationId: string | null,
    mcpProjectIds?: string[] | null,
  ): Promise<GetOverviewStatsOutputDtoType> {
    const resolvedOrganizationId = input.organizationId ?? organizationId;
    if (!resolvedOrganizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: resolvedOrganizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projectIds = narrowProjectIds(await this.resolveProjectIds(input, membership), mcpProjectIds);
    const allStatuses = Object.values(BugReportStatus);

    if (projectIds.length === 0) {
      return {
        byStatus: allStatuses.map((status) => ({ label: status, count: 0 })),
        bySeverity: Object.values(BugReportSeverity).map((severity) => ({ label: severity, count: 0 })),
      };
    }

    const bugReports = await this.bugReportRepository.findManyByProjectIds(projectIds);

    const statusCounts = new Map<BugReportStatus, number>();
    const severityCounts = new Map<BugReportSeverity, number>();
    for (const status of allStatuses) statusCounts.set(status, 0);
    for (const severity of Object.values(BugReportSeverity)) severityCounts.set(severity, 0);

    for (const bugReport of bugReports) {
      statusCounts.set(bugReport.status, (statusCounts.get(bugReport.status) ?? 0) + 1);
      severityCounts.set(bugReport.severity, (severityCounts.get(bugReport.severity) ?? 0) + 1);
    }

    return {
      byStatus: allStatuses.map((status) => ({ label: status, count: statusCounts.get(status) ?? 0 })),
      bySeverity: Object.values(BugReportSeverity).map((severity) => ({
        label: severity,
        count: severityCounts.get(severity) ?? 0,
      })),
    };
  }

  private async resolveProjectIds(
    input: GetOverviewStatsInputDtoType,
    membership: MembershipModelType,
  ): Promise<string[]> {
    if (input.projectId) {
      const project = await this.projectPort.findById(input.projectId);
      if (!project || project.organizationId !== membership.organizationId) {
        throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
      }
      const allowedProjectIds = await this.membershipPort.filterProjectIds(membership, [project.id]);
      if (allowedProjectIds.length === 0) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
      return allowedProjectIds;
    }

    const projects = await this.projectPort.findManyByOrganizationId({ organizationId: membership.organizationId });
    return await this.membershipPort.filterProjectIds(
      membership,
      projects.map((project) => project.id),
    );
  }
}
