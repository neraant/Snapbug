import { FindOneUseCase } from "@workspace/server/modules/bug-report/application/find-one.use-case";
import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { UserPort } from "@workspace/server/modules/bug-report/port/user.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const assigneeId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
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

const assignee = {
  id: assigneeId,
  name: "Jane Doe",
  email: "jane@example.com",
  onboardingCompletedAt: null,
};

const bugReport = new BugReport({
  id: "6a8c69a1-1ab1-45a8-8497-eae1e506d901",
  projectId,
  shortId: "SNB-1",
  assignedTo: assigneeId,
  status: BugReportStatus.NEW,
  boardOrder: 1024,
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

const otherOrganizationId = "7a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

describe("FindOneUseCase", () => {
  it("returns a bug report with assignee for a member of the ticket organization", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const userPort = { findManyByIds: vi.fn().mockResolvedValue([assignee]) };
    const bugReportRepository = {
      findManyByShortId: vi.fn().mockResolvedValue([{ bugReport, organizationId }]),
    };
    const useCase = new FindOneUseCase(
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute({ shortId: "SNB-1" }, userId, otherOrganizationId);

    expect(bugReportRepository.findManyByShortId).toHaveBeenCalledWith("SNB-1");
    expect(membershipPort.findByUserAndOrganization).toHaveBeenCalledWith({ userId, organizationId });
    expect(result).toEqual(BugReportMapper.toFindOneOutput(bugReport, assignee, organizationId));
  });

  it("throws when the user is not a member of the ticket organization", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
    };
    const userPort = { findManyByIds: vi.fn() };
    const bugReportRepository = {
      findManyByShortId: vi.fn().mockResolvedValue([{ bugReport, organizationId }]),
    };
    const useCase = new FindOneUseCase(
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute({ shortId: "SNB-1" }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.BUG_REPORT_NOT_FOUND,
    });

    expect(userPort.findManyByIds).not.toHaveBeenCalled();
  });

  it("throws when the bug report is missing", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn(),
    };
    const userPort = { findManyByIds: vi.fn() };
    const bugReportRepository = {
      findManyByShortId: vi.fn().mockResolvedValue([]),
    };
    const useCase = new FindOneUseCase(
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute({ shortId: "SNB-99" }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.BUG_REPORT_NOT_FOUND,
    });

    expect(membershipPort.findByUserAndOrganization).not.toHaveBeenCalled();
  });

  it("hides a ticket whose project is outside the allow-list", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn().mockResolvedValue([]),
    };
    const userPort = { findManyByIds: vi.fn() };
    const bugReportRepository = {
      findManyByShortId: vi.fn().mockResolvedValue([{ bugReport, organizationId }]),
    };
    const useCase = new FindOneUseCase(
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute({ shortId: "SNB-1" }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.BUG_REPORT_NOT_FOUND,
    });

    expect(userPort.findManyByIds).not.toHaveBeenCalled();
  });
});
