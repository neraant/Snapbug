import { UTCDate } from "@date-fns/utc";
import { FindChartsUseCase } from "@workspace/server/modules/bug-report/application/find-charts.use-case";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { BugReportStatService } from "@workspace/server/modules/bug-report/service/bug-report-stat.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const otherOrganizationId = "9a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

const reference = new UTCDate("2026-10-11T15:00:00.000Z");

const input = { organizationId, periodDays: 7 as const };

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
    countCreatedByDay: vi.fn().mockResolvedValue([]),
    countResolvedByDay: vi.fn().mockResolvedValue([]),
    countCreatedBySeverity: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

function createStatService() {
  const service = new BugReportStatService();
  const getChartPeriodWindows = service.getChartPeriodWindows.bind(service);
  const buildZeroCharts = service.buildZeroCharts.bind(service);
  vi.spyOn(service, "getChartPeriodWindows").mockImplementation((periodDays) =>
    getChartPeriodWindows(periodDays, reference),
  );
  vi.spyOn(service, "buildZeroCharts").mockImplementation((periodDays) => buildZeroCharts(periodDays, reference));
  return service;
}

describe("FindChartsUseCase", () => {
  it("returns a zero-filled series when the organization has no projects", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([]), findById: vi.fn() };
    const bugReportRepository = createRepositoryMock();
    const useCase = new FindChartsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      createStatService(),
    );

    const result = await useCase.execute(input, userId);

    expect(result.points).toHaveLength(7);
    expect(result.points.every((point) => point.created === 0 && point.resolved === 0)).toBe(true);
    expect(result.severity).toEqual([
      { severity: BugReportSeverity.LOW, count: 0 },
      { severity: BugReportSeverity.MEDIUM, count: 0 },
      { severity: BugReportSeverity.HIGH, count: 0 },
      { severity: BugReportSeverity.CRITICAL, count: 0 },
    ]);
    expect(bugReportRepository.countCreatedByDay).not.toHaveBeenCalled();
  });

  it("maps repository rows onto UTC days and severities", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([project]), findById: vi.fn() };
    const bugReportRepository = createRepositoryMock({
      countCreatedByDay: vi.fn().mockResolvedValue([
        { day: "2026-10-10T00:00:00.000Z", value: 3 },
        { day: "2026-10-11T00:00:00.000Z", value: 2 },
      ]),
      countResolvedByDay: vi.fn().mockResolvedValue([{ day: "2026-10-11T00:00:00.000Z", value: 1 }]),
      countCreatedBySeverity: vi.fn().mockResolvedValue([
        { severity: BugReportSeverity.HIGH, count: 4 },
        { severity: BugReportSeverity.CRITICAL, count: 1 },
      ]),
    });
    const useCase = new FindChartsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      createStatService(),
    );

    const result = await useCase.execute(input, userId);

    const oct10 = result.points.find((point) => point.day === "2026-10-10");
    const oct11 = result.points.find((point) => point.day === "2026-10-11");

    expect(oct10).toEqual({ day: "2026-10-10", created: 3, resolved: 0 });
    expect(oct11).toEqual({ day: "2026-10-11", created: 2, resolved: 1 });
    expect(result.severity.find((row) => row.severity === BugReportSeverity.HIGH)?.count).toBe(4);
    expect(result.severity.find((row) => row.severity === BugReportSeverity.MEDIUM)?.count).toBe(0);
  });

  it("throws when the project does not belong to the organization", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn().mockResolvedValue({ ...project, organizationId: otherOrganizationId }),
    };
    const bugReportRepository = createRepositoryMock();
    const useCase = new FindChartsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      createStatService(),
    );

    await expect(useCase.execute({ ...input, projectId }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(bugReportRepository.countCreatedByDay).not.toHaveBeenCalled();
  });
});
