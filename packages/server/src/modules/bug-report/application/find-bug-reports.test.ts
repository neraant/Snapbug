import { FindBugReportsUseCase } from "@workspace/server/modules/bug-report/application/find-bug-reports.use-case";
import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
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

const membership = {
  id: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: UserRole.USER,
  createdAt: "2026-10-03T09:00:00.000Z",
};

const project = {
  id: projectId,
  name: "Store",
  organizationId,
  createdAt: "2026-10-03T09:00:00.000Z",
};

const bugReport = new BugReport({
  id: "6a8c69a1-1ab1-45a8-8497-eae1e506d901",
  projectId,
  assignedTo: null,
  status: BugReportStatus.NEW,
  severity: BugReportSeverity.MEDIUM,
  title: "Pay button throws",
  description: "Clicking Pay shows a blank page.",
  stepsToReproduce: null,
  reporterEmail: null,
  url: "https://store.acme.test/checkout",
  userAgent: null,
  browser: null,
  os: null,
  device: null,
  viewportWidth: null,
  viewportHeight: null,
  screenshotKey: "private/screenshot.png",
  hasReplay: false,
  consoleLogs: null,
  networkLogs: null,
  customContext: null,
  createdAt,
  updatedAt: createdAt,
  resolvedAt: null,
});

describe("FindBugReportsUseCase", () => {
  it("returns bug reports for a member", async () => {
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(membership) };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([project]) };
    const bugReportRepository = { findManyByProjectIds: vi.fn().mockResolvedValue([bugReport]) };
    const useCase = new FindBugReportsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute(userId);

    expect(membershipPort.findByUser).toHaveBeenCalledWith(userId);
    expect(projectPort.findManyByOrganizationId).toHaveBeenCalledWith({ organizationId });
    expect(bugReportRepository.findManyByProjectIds).toHaveBeenCalledWith([projectId]);
    expect(result).toEqual([BugReportMapper.toDto(bugReport)]);
    expect(result[0]).not.toHaveProperty("screenshotKey");
  });

  it("returns an empty list when the organization has no projects", async () => {
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(membership) };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([]) };
    const bugReportRepository = { findManyByProjectIds: vi.fn() };
    const useCase = new FindBugReportsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute(userId);

    expect(result).toEqual([]);
    expect(bugReportRepository.findManyByProjectIds).not.toHaveBeenCalled();
  });

  it("throws when the user is not a member", async () => {
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(null) };
    const projectPort = { findManyByOrganizationId: vi.fn() };
    const bugReportRepository = { findManyByProjectIds: vi.fn() };
    const useCase = new FindBugReportsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute(userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(projectPort.findManyByOrganizationId).not.toHaveBeenCalled();
    expect(bugReportRepository.findManyByProjectIds).not.toHaveBeenCalled();
  });
});
