import type { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { narrowProjectIds } from "@workspace/server/shared/orpc/mcp/mcp-project-scope.util";
import {
  decodeTicketListCursor,
  encodeTicketListCursor,
} from "@workspace/server/shared/orpc/mcp/ticket-list-cursor.util";
import type {
  ListTicketsInputDtoType,
  ListTicketsOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/list-tickets.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

const defaultLimit = 20;
const maxLimit = 50;

export class ListTicketsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportRepository: BugReportRepository,
  ) {}

  async execute(
    input: ListTicketsInputDtoType,
    userId: string,
    mcpProjectIds?: string[] | null,
  ): Promise<ListTicketsOutputDtoType> {
    const memberships = await this.membershipPort.findManyByUser(userId);
    const projectIds = narrowProjectIds(await this.resolveProjectIds(input, memberships), mcpProjectIds);
    if (projectIds.length === 0) return { items: [], nextCursor: null };

    const bugReports = await this.bugReportRepository.findManyByProjectIds(projectIds);
    const filtered = this.applyFilters(bugReports, input);
    const sorted = this.sortForCursor(filtered);
    const limit = Math.min(input.limit ?? defaultLimit, maxLimit);
    const startIndex = this.resolveStartIndex(sorted, input.cursor);
    const page = sorted.slice(startIndex, startIndex + limit + 1);
    const hasMore = page.length > limit;
    const items = page.slice(0, limit).map((bugReport) => this.toListItem(bugReport));
    const last = page[limit - 1];
    const nextCursor = hasMore && last ? encodeTicketListCursor(last.boardOrder, last.createdAt, last.id) : null;

    return { items, nextCursor };
  }

  private async resolveProjectIds(
    input: ListTicketsInputDtoType,
    memberships: MembershipModelType[],
  ): Promise<string[]> {
    if (input.projectId) {
      const project = await this.projectPort.findById(input.projectId);
      if (!project) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

      const membership = memberships.find((item) => item.organizationId === project.organizationId);
      if (!membership) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

      const allowedProjectIds = await this.membershipPort.filterProjectIds(membership, [project.id]);
      if (allowedProjectIds.length === 0) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
      return allowedProjectIds;
    }

    const projectIds = new Set<string>();
    for (const membership of memberships) {
      const projects = await this.projectPort.findManyByOrganizationId({
        organizationId: membership.organizationId,
      });
      const allowedProjectIds = await this.membershipPort.filterProjectIds(
        membership,
        projects.map((project) => project.id),
      );
      for (const projectId of allowedProjectIds) {
        projectIds.add(projectId);
      }
    }

    return [...projectIds];
  }

  private applyFilters(bugReports: BugReport[], input: ListTicketsInputDtoType): BugReport[] {
    return bugReports.filter((bugReport) => {
      if (input.status && bugReport.status !== input.status) return false;
      if (input.severity && bugReport.severity !== input.severity) return false;
      if (input.assigneeId && bugReport.assignedTo !== input.assigneeId) return false;
      if (input.text) {
        const needle = input.text.toLowerCase();
        const haystack = [bugReport.title, bugReport.shortId, bugReport.url, bugReport.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }

  private sortForCursor(bugReports: BugReport[]): BugReport[] {
    return [...bugReports].sort((left, right) => {
      if (left.boardOrder !== right.boardOrder) return left.boardOrder - right.boardOrder;
      const createdAtDiff = right.createdAt.getTime() - left.createdAt.getTime();
      if (createdAtDiff !== 0) return createdAtDiff;
      return left.id.localeCompare(right.id);
    });
  }

  private resolveStartIndex(bugReports: BugReport[], cursor?: string): number {
    if (!cursor) return 0;
    const decoded = decodeTicketListCursor(cursor);
    if (!decoded) return 0;

    const index = bugReports.findIndex(
      (bugReport) =>
        bugReport.boardOrder > decoded.boardOrder ||
        (bugReport.boardOrder === decoded.boardOrder && bugReport.createdAt.getTime() < decoded.createdAtMs) ||
        (bugReport.boardOrder === decoded.boardOrder &&
          bugReport.createdAt.getTime() === decoded.createdAtMs &&
          bugReport.id > decoded.id),
    );
    return index === -1 ? bugReports.length : index;
  }

  private toListItem(bugReport: BugReport): ListTicketsOutputDtoType["items"][number] {
    const dto = BugReportMapper.toDto(bugReport);
    const { consoleLogs: _consoleLogs, networkLogs: _networkLogs, ...rest } = dto;
    return rest;
  }
}
