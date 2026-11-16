import { GetOverviewStatsUseCase } from "@workspace/server/modules/bug-report/application/get-overview-stats.use-case";
import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const projectId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const createdAt = new Date("2026-10-03T09:00:00.000Z");

const membership = {
  id: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId,
  organizationId,
  role: UserRole.USER,
  createdAt: createdAt.toISOString(),
};

const bugReport = new BugReport({
  id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  projectId,
  shortId: "SNB-1",
  assignedTo: null,
  status: BugReportStatus.NEW,
  boardOrder: 1024,
  severity: BugReportSeverity.HIGH,
  title: "Checkout broken",
  description: "Checkout broken",
  stepsToReproduce: null,
  reporterEmail: null,
  reporterIp: null,
  url: null,
  userAgent: null,
  browser: null,
  os: null,
  device: null,
  viewportWidth: null,
  viewportHeight: null,
  screenshotKey: null,
  replayKey: null,
  hasReplay: false,
  consoleLogs: null,
  networkLogs: null,
  customContext: null,
  createdAt,
  updatedAt: createdAt,
  resolvedAt: null,
});

describe("GetOverviewStatsUseCase", () => {
  it("returns status and severity counts for accessible projects", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn().mockResolvedValue([projectId]),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([{ id: projectId, organizationId }]),
      findById: vi.fn(),
    };
    const bugReportRepository = {
      findManyByProjectIds: vi.fn().mockResolvedValue([bugReport]),
    };
    const useCase = new GetOverviewStatsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute({}, userId, organizationId);

    expect(result.byStatus.find((row) => row.label === BugReportStatus.NEW)?.count).toBe(1);
    expect(result.bySeverity.find((row) => row.label === BugReportSeverity.HIGH)?.count).toBe(1);
  });

  it("rejects stats for a project the member cannot access", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn().mockResolvedValue([]),
    };
    const projectPort = {
      findById: vi.fn().mockResolvedValue({ id: projectId, organizationId }),
    };
    const bugReportRepository = { findManyByProjectIds: vi.fn() };
    const useCase = new GetOverviewStatsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute({ projectId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(bugReportRepository.findManyByProjectIds).not.toHaveBeenCalled();
  });

  it("rejects stats for a project outside the member's organization", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn(),
    };
    const projectPort = {
      findById: vi.fn().mockResolvedValue({ id: projectId, organizationId: "9a8c69a1-1ab1-45a8-8497-eae1e506d9d4" }),
    };
    const bugReportRepository = { findManyByProjectIds: vi.fn() };
    const useCase = new GetOverviewStatsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute({ projectId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(bugReportRepository.findManyByProjectIds).not.toHaveBeenCalled();
  });
});
