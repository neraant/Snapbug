import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type { BugReportStatService } from "@workspace/server/modules/bug-report/service/bug-report-stat.service";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindChartsInputDtoType,
  FindChartsOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/find-charts.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export class FindChartsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportRepository: BugReportRepository,
    private readonly bugReportStatService: BugReportStatService,
  ) {}

  async execute(
    input: FindChartsInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<FindChartsOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projectIds = await this.resolveProjectIds(input, membership);
    if (projectIds.length === 0) {
      return this.bugReportStatService.buildZeroCharts(input.periodDays);
    }

    const windows = this.bugReportStatService.getChartPeriodWindows(input.periodDays);

    const [createdByDay, resolvedByDay, severityCounts, createdByWeekdayHour] = await Promise.all([
      this.bugReportRepository.countCreatedByDay(projectIds, windows.queryFrom, windows.queryTo),
      this.bugReportRepository.countResolvedByDay(projectIds, windows.queryFrom, windows.queryTo),
      this.bugReportRepository.countCreatedBySeverity(projectIds, windows.queryFrom, windows.queryTo),
      this.bugReportRepository.countCreatedByWeekdayHour(projectIds, windows.queryFrom, windows.queryTo),
    ]);

    return this.bugReportStatService.buildChartsFromAggregates({
      dayStarts: windows.dayStarts,
      createdByDay,
      resolvedByDay,
      severityCounts,
      createdByWeekdayHour,
    });
  }

  private async resolveProjectIds(input: FindChartsInputDtoType, membership: MembershipModelType): Promise<string[]> {
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
