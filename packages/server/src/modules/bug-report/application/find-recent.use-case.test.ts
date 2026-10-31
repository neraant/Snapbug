import { FindRecentUseCase } from "@workspace/server/modules/bug-report/application/find-recent.use-case";
import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
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
const otherProjectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d2";
const otherOrganizationId = "9a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const createdAt = new Date("2026-10-10T11:00:00.000Z");

const membership = {
  id: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: UserRole.USER,
  createdAt: "2026-10-03T09:00:00.000Z",
};

const project = {
  id: projectId,
  name: "Acme Store",
  organizationId,
  createdAt: "2026-10-03T09:00:00.000Z",
};

const otherProject = {
  id: otherProjectId,
  name: "Acme Marketing",
  organizationId,
  createdAt: "2026-10-03T09:00:00.000Z",
};

const assignee = {
  id: assigneeId,
  name: "Alice",
  email: "alice@example.com",
  onboardingCompletedAt: null,
};

function createBugReport(index: number, status: BugReportStatus) {
  return new BugReport({
    id: `6a8c69a1-1ab1-45a8-8497-eae1e506d9${index.toString(16).padStart(2, "0")}`,
    projectId,
    shortId: `SNB-${index}`,
    assignedTo: index % 2 === 0 ? assigneeId : null,
    status,
    boardOrder: index * 1024,
    severity: BugReportSeverity.HIGH,
    title: `Issue ${index}`,
    description: "Something broke.",
    stepsToReproduce: null,
    reporterEmail: null,
    url: "https://store.acme.test/checkout",
    userAgent: null,
    browser: index % 2 === 0 ? "Chrome 129" : null,
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
}

describe("FindRecentUseCase", () => {
  it("returns the eight newest reports of any status", async () => {
    const statuses = [
      BugReportStatus.NEW,
      BugReportStatus.IN_PROGRESS,
      BugReportStatus.RESOLVED,
      BugReportStatus.CLOSED,
      BugReportStatus.NEW,
      BugReportStatus.RESOLVED,
      BugReportStatus.CLOSED,
      BugReportStatus.IN_PROGRESS,
      BugReportStatus.NEW,
    ];
    const bugReports = statuses.map((status, index) => createBugReport(index + 1, status));
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(membership) };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([project]), findById: vi.fn() };
    const userPort = { findManyByIds: vi.fn().mockResolvedValue([assignee]) };
    const bugReportRepository = { findRecentByProjectIds: vi.fn().mockResolvedValue(bugReports) };
    const useCase = new FindRecentUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute({}, userId);

    expect(bugReportRepository.findRecentByProjectIds).toHaveBeenCalledWith([projectId], 8);
    expect(result).toHaveLength(8);
    expect(result.map((item) => item.id)).toEqual(bugReports.slice(0, 8).map((bugReport) => bugReport.id));
    expect(result.some((item) => item.severity === BugReportSeverity.HIGH)).toBe(true);
    expect(result[1]).toMatchObject({
      shortId: "SNB-2",
      title: "Issue 2",
      projectName: "Acme Store",
      browser: "Chrome 129",
      createdAt: createdAt.toISOString(),
      assignee: { id: assigneeId, name: "Alice", email: "alice@example.com" },
    });
    expect(result[0]?.assignee).toBeNull();
    expect(result[0]?.browser).toBeNull();
    expect(userPort.findManyByIds).toHaveBeenCalledWith([assigneeId]);
  });

  it("limits the feed to the selected project", async () => {
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(membership) };
    const projectPort = { findById: vi.fn().mockResolvedValue(project), findManyByOrganizationId: vi.fn() };
    const userPort = { findManyByIds: vi.fn() };
    const bugReportRepository = { findRecentByProjectIds: vi.fn().mockResolvedValue([]) };
    const useCase = new FindRecentUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute({ projectId }, userId);

    expect(projectPort.findById).toHaveBeenCalledWith(projectId);
    expect(projectPort.findManyByOrganizationId).not.toHaveBeenCalled();
    expect(bugReportRepository.findRecentByProjectIds).toHaveBeenCalledWith([projectId], 8);
    expect(userPort.findManyByIds).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("reads every project in the organization when no project is selected", async () => {
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(membership) };
    const projectPort = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([project, otherProject]),
      findById: vi.fn(),
    };
    const userPort = { findManyByIds: vi.fn() };
    const bugReportRepository = { findRecentByProjectIds: vi.fn().mockResolvedValue([]) };
    const useCase = new FindRecentUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await useCase.execute({}, userId);

    expect(bugReportRepository.findRecentByProjectIds).toHaveBeenCalledWith([projectId, otherProjectId], 8);
  });

  it("returns an empty list when the organization has no projects", async () => {
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(membership) };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([]), findById: vi.fn() };
    const userPort = { findManyByIds: vi.fn() };
    const bugReportRepository = { findRecentByProjectIds: vi.fn() };
    const useCase = new FindRecentUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute({}, userId);

    expect(result).toEqual([]);
    expect(bugReportRepository.findRecentByProjectIds).not.toHaveBeenCalled();
  });

  it("throws when the project does not belong to the organization", async () => {
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(membership) };
    const projectPort = {
      findById: vi.fn().mockResolvedValue({ ...project, organizationId: otherOrganizationId }),
      findManyByOrganizationId: vi.fn(),
    };
    const userPort = { findManyByIds: vi.fn() };
    const bugReportRepository = { findRecentByProjectIds: vi.fn() };
    const useCase = new FindRecentUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute({ projectId }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(bugReportRepository.findRecentByProjectIds).not.toHaveBeenCalled();
  });
});
