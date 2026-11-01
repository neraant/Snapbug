import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type { BugReportStatService } from "@workspace/server/modules/bug-report/service/bug-report-stat.service";
import type { AuditLogRepository } from "@workspace/server/shared/audit/audit-log.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindStatsInputDtoType,
  FindStatsOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/find-stats.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export class FindStatsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportRepository: BugReportRepository,
    private readonly bugReportStatService: BugReportStatService,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(
    input: FindStatsInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<FindStatsOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projectIds = await this.resolveProjectIds(input, membership);
    if (projectIds.length === 0) {
      return BugReportMapper.toFindStatsOutput(this.bugReportStatService.buildZeroItems());
    }

    const windows = this.bugReportStatService.getComparisonWindows(input.periodDays);

    const replayInstants = [...windows.sparklineDayStarts, windows.currentPeriodStart];

    const [
      newReportsCurrent,
      newReportsPrevious,
      newReportsByDay,
      openCount,
      criticalHighOpenCount,
      medianCurrentMs,
      medianPreviousMs,
      medianByDay,
      replayMetrics,
    ] = await Promise.all([
      this.bugReportRepository.countCreatedBetween(projectIds, windows.currentPeriodStart, windows.now),
      this.bugReportRepository.countCreatedBetween(projectIds, windows.previousPeriodStart, windows.currentPeriodStart),
      this.bugReportRepository.countCreatedByDay(projectIds, windows.sparklineFrom, windows.sparklineTo),
      this.bugReportRepository.countOpen(projectIds),
      this.bugReportRepository.countOpenCriticalHigh(projectIds),
      this.bugReportRepository.medianResolveDurationMsBetween(projectIds, windows.currentPeriodStart, windows.now),
      this.bugReportRepository.medianResolveDurationMsBetween(
        projectIds,
        windows.previousPeriodStart,
        windows.currentPeriodStart,
      ),
      this.bugReportRepository.medianResolveDurationMsByDay(projectIds, windows.sparklineFrom, windows.sparklineTo),
      this.auditLogRepository.replayOpenBugReportMetrics(projectIds, replayInstants),
    ]);

    const openMetricsByDay = replayMetrics.slice(0, windows.sparklineDayStarts.length);
    const openAtPeriodStart = replayMetrics[replayMetrics.length - 1]?.open ?? 0;
    const criticalHighAtPeriodStart = replayMetrics[replayMetrics.length - 1]?.criticalHigh ?? 0;

    return BugReportMapper.toFindStatsOutput(
      this.bugReportStatService.buildItemsFromAggregates({
        windows,
        newReportsCurrent,
        newReportsPrevious,
        newReportsByDay,
        openCount,
        criticalHighOpenCount,
        openAtPeriodStart,
        criticalHighAtPeriodStart,
        openMetricsByDay,
        medianCurrentMs,
        medianPreviousMs,
        medianByDay,
      }),
    );
  }

  private async resolveProjectIds(input: FindStatsInputDtoType, membership: MembershipModelType): Promise<string[]> {
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
