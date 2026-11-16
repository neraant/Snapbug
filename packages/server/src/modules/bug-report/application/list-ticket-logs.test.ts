import { ListTicketLogsUseCase } from "@workspace/server/modules/bug-report/application/list-ticket-logs.use-case";
import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const createdAt = new Date("2026-10-03T09:00:00.000Z");

const bugReport = new BugReport({
  id: "6a8c69a1-1ab1-45a8-8497-eae1e506d901",
  projectId,
  shortId: "SNB-1",
  assignedTo: null,
  status: BugReportStatus.NEW,
  boardOrder: 1024,
  severity: BugReportSeverity.MEDIUM,
  title: "Pay button throws",
  description: "Clicking Pay shows a blank page.",
  stepsToReproduce: null,
  reporterEmail: null,
  reporterIp: null,
  url: "https://store.acme.test/checkout",
  userAgent: null,
  browser: null,
  os: null,
  device: null,
  viewportWidth: null,
  viewportHeight: null,
  screenshotKey: null,
  replayKey: null,
  hasReplay: false,
  consoleLogs: [{ level: "error", message: "boom", timestamp: "2026-01-01T00:00:00.000Z" }],
  networkLogs: [{ method: "GET", url: "https://api.test", status: 500 }],
  customContext: null,
  createdAt,
  updatedAt: createdAt,
  resolvedAt: null,
});

describe("ListTicketLogsUseCase", () => {
  it("returns bounded logs for an accessible ticket", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId, role: UserRole.USER }),
      filterProjectIds: vi.fn().mockResolvedValue([projectId]),
    };
    const bugReportRepository = {
      findManyByShortId: vi.fn().mockResolvedValue([{ bugReport, organizationId }]),
    };
    const useCase = new ListTicketLogsUseCase(
      membershipPort as unknown as MembershipPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute({ shortId: "SNB-1" }, userId);

    expect(result.console).toHaveLength(1);
    expect(result.network).toHaveLength(1);
    expect(result.truncated).toBe(false);
  });

  it("does not return logs for a ticket the member cannot access", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
      filterProjectIds: vi.fn(),
    };
    const bugReportRepository = {
      findManyByShortId: vi.fn().mockResolvedValue([{ bugReport, organizationId }]),
    };
    const useCase = new ListTicketLogsUseCase(
      membershipPort as unknown as MembershipPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute({ shortId: "SNB-1" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.BUG_REPORT_NOT_FOUND,
    });
  });
});