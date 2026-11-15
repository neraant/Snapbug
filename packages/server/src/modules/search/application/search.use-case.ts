import type { BugReportPort } from "@workspace/server/modules/search/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/search/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/search/port/project.port";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { SearchInputDtoType, SearchOutputDtoType } from "@workspace/validation/modules/search/dto/search.schema";

const searchResultLimit = 10;

export class SearchUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportPort: BugReportPort,
  ) {}

  async execute(
    input: SearchInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<SearchOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projects = await this.projectPort.findManyByOrganizationId({ organizationId: membership.organizationId });
    const allowedProjectIds = new Set(
      await this.membershipPort.filterProjectIds(
        membership,
        projects.map((project) => project.id),
      ),
    );
    const allowedProjects = projects.filter((project) => allowedProjectIds.has(project.id));
    if (allowedProjects.length === 0) {
      return { projects: [], tickets: [] };
    }

    const normalizedQuery = input.query.trim().toLowerCase();
    const matchedProjects = allowedProjects
      .filter((project) => project.name.toLowerCase().includes(normalizedQuery))
      .slice(0, searchResultLimit)
      .map((project) => ({
        id: project.id,
        name: project.name,
        color: project.color,
      }));

    const projectNameById = new Map(allowedProjects.map((project) => [project.id, project.name]));
    const bugReports = await this.bugReportPort.findManyForSearch(
      [...allowedProjectIds],
      input.query,
      searchResultLimit,
    );

    const tickets = bugReports.map((bugReport) => ({
      id: bugReport.id,
      shortId: bugReport.shortId,
      title: bugReport.title,
      projectId: bugReport.projectId,
      projectName: projectNameById.get(bugReport.projectId) ?? "",
    }));

    return { projects: matchedProjects, tickets };
  }
}