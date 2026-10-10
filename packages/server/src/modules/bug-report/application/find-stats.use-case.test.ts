import { FindStatsUseCase } from "@workspace/server/modules/bug-report/application/find-stats.use-case";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { BugReportStatService } from "@workspace/server/modules/bug-report/service/bug-report-stat.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportStatId } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-id.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

const input = { organizationId };

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

function createRepositoryMock(overrides: Partial<BugReportRepository> = {}) {
  return {
    countCreatedBetween: vi.fn().mockResolvedValue(0),
    countCreatedByDay: vi.fn().mockResolvedValue([]),
    countOpen: vi.fn().mockResolvedValue(0),
    countOpenCriticalHigh: vi.fn().mockResolvedValue(0),
    medianResolveDurationMsBetween: vi.fn().mockResolvedValue(0),
    medianResolveDurationMsByDay: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

describe("FindStatsUseCase", () => {
  it("throws when the user is not a member", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(null) };
    const projectPort = { findManyByOrganizationId: vi.fn(), findById: vi.fn() };
    const bugReportRepository = createRepositoryMock();
    const useCase = new FindStatsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      new BugReportStatService(),
    );

    await expect(useCase.execute(input, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(projectPort.findManyByOrganizationId).not.toHaveBeenCalled();
    expect(bugReportRepository.countCreatedBetween).not.toHaveBeenCalled();
  });

  it("returns zeroed stats when the organization has no projects", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([]), findById: vi.fn() };
    const bugReportRepository = createRepositoryMock();
    const useCase = new FindStatsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      new BugReportStatService(),
    );

    const result = await useCase.execute(input, userId);

    expect(result.items).toHaveLength(4);
    expect(result.items.map((item) => item.id)).toEqual([
      BugReportStatId.NEW_REPORT,
      BugReportStatId.OPEN_ISSUE,
      BugReportStatId.CRITICAL_HIGH_OPEN,
      BugReportStatId.MEDIAN_TIME_TO_RESOLVE,
    ]);
    expect(result.items.every((item) => item.sparkline.length === 7)).toBe(true);
    expect(bugReportRepository.countCreatedBetween).not.toHaveBeenCalled();
  });

  it("returns new report stats from repository aggregates", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([project]), findById: vi.fn() };
    const bugReportRepository = createRepositoryMock({
      countCreatedBetween: vi.fn().mockResolvedValueOnce(5).mockResolvedValueOnce(2),
      countOpen: vi.fn().mockResolvedValue(4),
      countOpenCriticalHigh: vi.fn().mockResolvedValue(1),
    });
    const useCase = new FindStatsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      new BugReportStatService(),
    );

    const result = await useCase.execute(input, userId);

    const newReport = result.items.find((item) => item.id === BugReportStatId.NEW_REPORT);
    expect(newReport).toEqual({
      id: BugReportStatId.NEW_REPORT,
      value: "5",
      changePercent: 150,
      sparkline: expect.any(Array),
    });
    expect(newReport?.sparkline).toHaveLength(7);
  });

  it("returns neutral deltas for open-issue cards until audit log exists", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([project]), findById: vi.fn() };
    const bugReportRepository = createRepositoryMock({
      countOpen: vi.fn().mockResolvedValue(9),
      countOpenCriticalHigh: vi.fn().mockResolvedValue(3),
    });
    const useCase = new FindStatsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      new BugReportStatService(),
    );

    const result = await useCase.execute(input, userId);

    const openIssue = result.items.find((item) => item.id === BugReportStatId.OPEN_ISSUE);
    const criticalHigh = result.items.find((item) => item.id === BugReportStatId.CRITICAL_HIGH_OPEN);

    expect(openIssue?.changePercent).toBe(0);
    expect(openIssue?.sparkline).toEqual(Array.from({ length: 7 }, () => ({ value: 9 })));
    expect(criticalHigh?.changePercent).toBe(0);
    expect(criticalHigh?.sparkline).toEqual(Array.from({ length: 7 }, () => ({ value: 3 })));
  });
});
