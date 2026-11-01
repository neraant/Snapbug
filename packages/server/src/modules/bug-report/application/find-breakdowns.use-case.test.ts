import { FindBreakdownsUseCase } from "@workspace/server/modules/bug-report/application/find-breakdowns.use-case";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { BugReportStatService } from "@workspace/server/modules/bug-report/service/bug-report-stat.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const otherOrganizationId = "9a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

const input = { periodDays: 7 as const };

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
    countCreatedByStatus: vi.fn().mockResolvedValue([]),
    countCreatedByUrl: vi.fn().mockResolvedValue([]),
    countCreatedByBrowser: vi.fn().mockResolvedValue([]),
    countCreatedByOs: vi.fn().mockResolvedValue([]),
    countCreatedByDevice: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

describe("FindBreakdownsUseCase", () => {
  it("returns zero breakdowns when the organization has no projects", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([]), findById: vi.fn() };
    const bugReportRepository = createRepositoryMock();
    const useCase = new FindBreakdownsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      new BugReportStatService(),
    );

    const result = await useCase.execute(input, userId, organizationId);

    expect(result.status).toEqual([
      { status: BugReportStatus.NEW, count: 0 },
      { status: BugReportStatus.IN_PROGRESS, count: 0 },
      { status: BugReportStatus.RESOLVED, count: 0 },
      { status: BugReportStatus.CLOSED, count: 0 },
    ]);
    expect(result.pages).toEqual([]);
    expect(bugReportRepository.countCreatedByStatus).not.toHaveBeenCalled();
  });

  it("throws when the project does not belong to the organization", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn(),
      findById: vi.fn().mockResolvedValue({ ...project, organizationId: otherOrganizationId }),
    };
    const bugReportRepository = createRepositoryMock();
    const useCase = new FindBreakdownsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      new BugReportStatService(),
    );

    await expect(useCase.execute({ ...input, projectId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(bugReportRepository.countCreatedByStatus).not.toHaveBeenCalled();
  });

  it("merges page URLs into host+path labels and drops invalid URLs", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([project]), findById: vi.fn() };
    const bugReportRepository = createRepositoryMock({
      countCreatedByUrl: vi.fn().mockResolvedValue([
        { value: "https://Store.ACME.test/checkout/", count: 2 },
        { value: "https://store.acme.test/checkout?promo=1", count: 1 },
        { value: "", count: 4 },
        { value: "not-a-url", count: 3 },
      ]),
    });
    const useCase = new FindBreakdownsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      new BugReportStatService(),
    );

    const result = await useCase.execute(input, userId, organizationId);

    expect(result.pages).toEqual([{ label: "store.acme.test/checkout", count: 3 }]);
  });

  it("fills missing statuses with zero and counts environment totals beyond the top five", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([project]), findById: vi.fn() };
    const bugReportRepository = createRepositoryMock({
      countCreatedByStatus: vi.fn().mockResolvedValue([{ status: BugReportStatus.NEW, count: 5 }]),
      countCreatedByBrowser: vi.fn().mockResolvedValue([
        { value: "Chrome 129", count: 10 },
        { value: "Firefox 131", count: 8 },
        { value: "Safari 18", count: 6 },
        { value: "Edge 128", count: 4 },
        { value: "Opera 112", count: 2 },
        { value: "Brave 1", count: 1 },
      ]),
    });
    const useCase = new FindBreakdownsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      new BugReportStatService(),
    );

    const result = await useCase.execute(input, userId, organizationId);

    expect(result.status.find((row) => row.status === BugReportStatus.RESOLVED)?.count).toBe(0);
    expect(result.browser.total).toBe(31);
    expect(result.browser.items).toHaveLength(5);
    expect(result.browser.items[0]).toEqual({ label: "Chrome 129", count: 10 });
  });
});
