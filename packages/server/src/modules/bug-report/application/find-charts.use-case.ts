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

export class FindChartsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportRepository: BugReportRepository,
    private readonly bugReportStatService: BugReportStatService,
  ) {}

  async execute(input: FindChartsInputDtoType, userId: string): Promise<FindChartsOutputDtoType> {
    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: input.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projectIds = await this.resolveProjectIds(input);
    if (projectIds.length === 0) {
      return this.bugReportStatService.buildZeroCharts(input.periodDays);
    }

    const windows = this.bugReportStatService.getChartPeriodWindows(input.periodDays);

    const [createdByDay, resolvedByDay, severityCounts] = await Promise.all([
      this.bugReportRepository.countCreatedByDay(projectIds, windows.queryFrom, windows.queryTo),
      this.bugReportRepository.countResolvedByDay(projectIds, windows.queryFrom, windows.queryTo),
      this.bugReportRepository.countCreatedBySeverity(projectIds, windows.queryFrom, windows.queryTo),
    ]);

    return this.bugReportStatService.buildChartsFromAggregates({
      dayStarts: windows.dayStarts,
      createdByDay,
      resolvedByDay,
      severityCounts,
    });
  }

  private async resolveProjectIds(input: FindChartsInputDtoType): Promise<string[]> {
    if (input.projectId) {
      const project = await this.projectPort.findById(input.projectId);
      if (!project || project.organizationId !== input.organizationId) {
        throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
      }
      return [project.id];
    }

    const projects = await this.projectPort.findManyByOrganizationId({ organizationId: input.organizationId });
    return projects.map((project) => project.id);
  }
}
