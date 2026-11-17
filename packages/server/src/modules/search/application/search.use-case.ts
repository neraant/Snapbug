import type { BugReportPort } from "@workspace/server/modules/search/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/search/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/search/port/project.port";
import { isMcpProjectAllowed } from "@workspace/server/shared/orpc/mcp/mcp-project-scope.util";
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
    mcpProjectIds?: string[] | null,
  ): Promise<SearchOutputDtoType> {
    const resolvedOrganizationId = input.organizationId ?? organizationId;
    if (!resolvedOrganizationId) {
      const memberships = await this.membershipPort.findManyByUser(userId);
      if (memberships.length === 0) return { projects: [], tickets: [] };
      return await this.searchOrganization(input, userId, memberships[0]!.organizationId, mcpProjectIds);
    }

    return await this.searchOrganization(input, userId, resolvedOrganizationId, mcpProjectIds);
  }

  private async searchOrganization(
    input: SearchInputDtoType,
    userId: string,
    organizationId: string,
    mcpProjectIds?: string[] | null,
  ): Promise<SearchOutputDtoType> {
    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projects = await this.projectPort.findManyByOrganizationId({ organizationId: membership.organizationId });
    const allowedProjectIds = new Set(
      await this.membershipPort.filterProjectIds(
        membership,
        projects.map((project) => project.id),
      ),
    );
    const allowedProjects = projects.filter(
      (project) => allowedProjectIds.has(project.id) && isMcpProjectAllowed(project.id, mcpProjectIds),
    );
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
        slug: project.slug,
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
      status: bugReport.status,
      severity: bugReport.severity,
    }));

    return { projects: matchedProjects, tickets };
  }
}