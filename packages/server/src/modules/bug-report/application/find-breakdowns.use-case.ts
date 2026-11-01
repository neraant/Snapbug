import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type { BugReportStatService } from "@workspace/server/modules/bug-report/service/bug-report-stat.service";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindBreakdownsInputDtoType,
  FindBreakdownsOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/find-breakdowns.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export class FindBreakdownsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportRepository: BugReportRepository,
    private readonly bugReportStatService: BugReportStatService,
  ) {}

  async execute(
    input: FindBreakdownsInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<FindBreakdownsOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projectIds = await this.resolveProjectIds(input, membership);
    if (projectIds.length === 0) {
      return this.bugReportStatService.buildZeroBreakdowns();
    }

    const windows = this.bugReportStatService.getChartPeriodWindows(input.periodDays);

    const [statusCounts, urlCounts, browserCounts, osCounts, deviceCounts] = await Promise.all([
      this.bugReportRepository.countCreatedByStatus(projectIds, windows.queryFrom, windows.queryTo),
      this.bugReportRepository.countCreatedByUrl(projectIds, windows.queryFrom, windows.queryTo),
      this.bugReportRepository.countCreatedByBrowser(projectIds, windows.queryFrom, windows.queryTo),
      this.bugReportRepository.countCreatedByOs(projectIds, windows.queryFrom, windows.queryTo),
      this.bugReportRepository.countCreatedByDevice(projectIds, windows.queryFrom, windows.queryTo),
    ]);

    return this.bugReportStatService.buildBreakdownsFromAggregates({
      statusCounts,
      urlCounts,
      browserCounts,
      osCounts,
      deviceCounts,
    });
  }

  private async resolveProjectIds(
    input: FindBreakdownsInputDtoType,
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
