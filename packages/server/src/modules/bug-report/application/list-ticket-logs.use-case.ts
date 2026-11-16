import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { assertMcpProjectAllowed } from "@workspace/server/shared/orpc/mcp/mcp-project-scope.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  ListTicketLogsInputDtoType,
  ListTicketLogsOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/list-ticket-logs.schema";

const logLineLimit = 25;

export class ListTicketLogsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly bugReportRepository: BugReportRepository,
  ) {}

  async execute(
    input: ListTicketLogsInputDtoType,
    userId: string,
    mcpProjectIds?: string[] | null,
  ): Promise<ListTicketLogsOutputDtoType> {
    const ticket = await this.findAccessibleTicket(input.shortId, userId, mcpProjectIds);
    const consoleLogs = Array.isArray(ticket.consoleLogs) ? ticket.consoleLogs : [];
    const networkLogs = Array.isArray(ticket.networkLogs) ? ticket.networkLogs : [];

    const console = consoleLogs.slice(0, logLineLimit).flatMap((entry) => {
      const parsed = parseRecord(entry);
      if (!parsed) return [];
      return [
        {
          level: stringOrNull(parsed.level),
          message: stringOrNull(parsed.message) ?? JSON.stringify(parsed).slice(0, 500),
          timestamp: stringOrNull(parsed.timestamp),
        },
      ];
    });

    const network = networkLogs.slice(0, logLineLimit).flatMap((entry) => {
      const parsed = parseRecord(entry);
      if (!parsed) return [];
      return [
        {
          method: stringOrNull(parsed.method),
          url: stringOrNull(parsed.url) ?? "(unknown)",
          status: numberOrNull(parsed.status),
        },
      ];
    });

    return {
      shortId: ticket.shortId,
      console,
      network,
      truncated: consoleLogs.length > logLineLimit || networkLogs.length > logLineLimit,
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

function parseRecord(value: unknown): Record<string, unknown> | null {
  if (value == null || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}