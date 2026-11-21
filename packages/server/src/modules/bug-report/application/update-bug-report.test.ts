import { createNotificationPortMock } from "@workspace/server/modules/notification/application/notification-test.const";
import { UpdateBugReportUseCase } from "@workspace/server/modules/bug-report/application/update-bug-report.use-case";
import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectAccessPort } from "@workspace/server/modules/bug-report/port/project-access.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { UserPort } from "@workspace/server/modules/bug-report/port/user.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type { BugReportService } from "@workspace/server/modules/bug-report/service/bug-report.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const assigneeUserId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const bugReportId = "6a8c69a1-1ab1-45a8-8497-eae1e506d901";
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
  id: bugReportId,
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
  consoleLogs: null,
  networkLogs: null,
  customContext: null,
  createdAt,
  updatedAt: createdAt,
  resolvedAt: null,
});

const actor = { type: "user" as const, id: userId };

function createBugReportService() {
  const saveWithAudit = vi.fn().mockResolvedValue(undefined);
  const normalizeBoardOrder = vi.fn().mockResolvedValue(undefined);
  const bugReportService = {
    withTx: vi.fn().mockReturnValue({
      withActor: vi.fn().mockReturnValue({ saveWithAudit, normalizeBoardOrder }),
    }),
  };

  return { saveWithAudit, normalizeBoardOrder, bugReportService };
}

function createDefaultAccessPorts() {
  return {
    projectAccessPort: { userHasProjectAccess: vi.fn().mockResolvedValue(true) } as unknown as ProjectAccessPort,
    userPort: {
      findManyByIds: vi.fn().mockResolvedValue([{ id: assigneeUserId, name: "Alice", email: "alice@example.com" }]),
    } as unknown as UserPort,
  };
}

describe("UpdateBugReportUseCase", () => {
  it("updates status for a member", async () => {
    const updatedBugReport = bugReport.update({ status: BugReportStatus.IN_PROGRESS });
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = {
      findById: vi.fn().mockResolvedValueOnce(bugReport).mockResolvedValueOnce(updatedBugReport),
    };
    const { saveWithAudit, normalizeBoardOrder, bugReportService } = createBugReportService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const { projectAccessPort, userPort } = createDefaultAccessPorts();
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      projectAccessPort,
      userPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      createNotificationPortMock(),
      withTransaction,
    );

    const result = await useCase.execute({ id: bugReportId, status: BugReportStatus.IN_PROGRESS }, userId, actor);

    expect(result.status).toBe(BugReportStatus.IN_PROGRESS);
    expect(result.resolvedAt).toBeNull();
    expect(saveWithAudit).toHaveBeenCalledWith(
      expect.objectContaining({ status: BugReportStatus.IN_PROGRESS }),
      "Update bug report",
    );
    expect(normalizeBoardOrder).toHaveBeenCalledWith(projectId, BugReportStatus.IN_PROGRESS);
  });

  it("sets resolvedAt when moving to resolved", async () => {
    const updatedBugReport = bugReport.update({ status: BugReportStatus.RESOLVED });
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = {
      findById: vi.fn().mockResolvedValueOnce(bugReport).mockResolvedValueOnce(updatedBugReport),
    };
    const { bugReportService } = createBugReportService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const { projectAccessPort, userPort } = createDefaultAccessPorts();
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      projectAccessPort,
      userPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      createNotificationPortMock(),
      withTransaction,
    );

    const result = await useCase.execute({ id: bugReportId, status: BugReportStatus.RESOLVED }, userId, actor);

    expect(result.status).toBe(BugReportStatus.RESOLVED);
    expect(result.resolvedAt).not.toBeNull();
  });

  it("clears resolvedAt when moving back to new", async () => {
    const resolvedBugReport = new BugReport({
      ...bugReport.toObject(),
      status: BugReportStatus.RESOLVED,
      resolvedAt: new Date("2026-10-04T09:00:00.000Z"),
    });
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const updatedBugReport = resolvedBugReport.update({ status: BugReportStatus.NEW });
    const bugReportRepository = {
      findById: vi.fn().mockResolvedValueOnce(resolvedBugReport).mockResolvedValueOnce(updatedBugReport),
    };
    const { bugReportService } = createBugReportService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const { projectAccessPort, userPort } = createDefaultAccessPorts();
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      projectAccessPort,
      userPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      createNotificationPortMock(),
      withTransaction,
    );

    const result = await useCase.execute({ id: bugReportId, status: BugReportStatus.NEW }, userId, actor);

    expect(result.status).toBe(BugReportStatus.NEW);
    expect(result.resolvedAt).toBeNull();
  });

  it("throws when the bug report is missing", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn(),
    };
    const projectPort = { findById: vi.fn() };
    const bugReportRepository = { findById: vi.fn().mockResolvedValue(null) };
    const bugReportService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const { projectAccessPort, userPort } = createDefaultAccessPorts();
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      projectAccessPort,
      userPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      createNotificationPortMock(),
      withTransaction,
    );

    await expect(
      useCase.execute({ id: bugReportId, status: BugReportStatus.CLOSED }, userId, actor),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.BUG_REPORT_NOT_FOUND,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("does not persist when the patch matches the current state", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = { findById: vi.fn().mockResolvedValue(bugReport) };
    const { saveWithAudit, bugReportService } = createBugReportService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const { projectAccessPort, userPort } = createDefaultAccessPorts();
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      projectAccessPort,
      userPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      createNotificationPortMock(),
      withTransaction,
    );

    const result = await useCase.execute({ id: bugReportId, status: BugReportStatus.NEW }, userId, actor);

    expect(result.status).toBe(BugReportStatus.NEW);
    expect(withTransaction).not.toHaveBeenCalled();
    expect(saveWithAudit).not.toHaveBeenCalled();
  });

  it("throws when the user is not a member", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = { findById: vi.fn().mockResolvedValue(bugReport) };
    const bugReportService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const { projectAccessPort, userPort } = createDefaultAccessPorts();
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      projectAccessPort,
      userPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      createNotificationPortMock(),
      withTransaction,
    );

    await expect(
      useCase.execute({ id: bugReportId, status: BugReportStatus.CLOSED }, userId, actor),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("writes the audit actor as mcp", async () => {
    const updatedBugReport = bugReport.update({ status: BugReportStatus.IN_PROGRESS });
    const withActor = vi.fn().mockReturnValue({
      saveWithAudit: vi.fn().mockResolvedValue(undefined),
      normalizeBoardOrder: vi.fn().mockResolvedValue(undefined),
    });
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = {
      findById: vi.fn().mockResolvedValueOnce(bugReport).mockResolvedValueOnce(updatedBugReport),
    };
    const bugReportService = { withTx: vi.fn().mockReturnValue({ withActor }) };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const { projectAccessPort, userPort } = createDefaultAccessPorts();
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      projectAccessPort,
      userPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      createNotificationPortMock(),
      withTransaction,
    );
    const mcpActor = { type: "mcp" as const, id: userId };

    await useCase.execute({ id: bugReportId, status: BugReportStatus.IN_PROGRESS }, userId, mcpActor);

    expect(withActor).toHaveBeenCalledWith(mcpActor);
  });

  it("does not update a ticket in a project the member cannot access", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn().mockResolvedValue([]),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = { findById: vi.fn().mockResolvedValue(bugReport) };
    const bugReportService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const { projectAccessPort, userPort } = createDefaultAccessPorts();
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      projectAccessPort,
      userPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      createNotificationPortMock(),
      withTransaction,
    );

    await expect(
      useCase.execute({ id: bugReportId, status: BugReportStatus.CLOSED }, userId, actor),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.BUG_REPORT_NOT_FOUND,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("unassigns a ticket", async () => {
    const assignedBugReport = bugReport.update({ assignedTo: assigneeUserId });
    const unassignedBugReport = assignedBugReport.update({ assignedTo: null });
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = {
      findById: vi.fn().mockResolvedValueOnce(assignedBugReport).mockResolvedValueOnce(unassignedBugReport),
    };
    const { saveWithAudit, bugReportService } = createBugReportService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const notificationPort = createNotificationPortMock();
    const { projectAccessPort, userPort } = createDefaultAccessPorts();
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      projectAccessPort,
      userPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      notificationPort,
      withTransaction,
    );

    const result = await useCase.execute({ id: bugReportId, assignedTo: null }, userId, actor);

    expect(result.assignedTo).toBeNull();
    expect(saveWithAudit).toHaveBeenCalled();
    expect(notificationPort.ticketAssigned).not.toHaveBeenCalled();
  });

  it("throws when the assignee does not have project access", async () => {
    const membershipPort = {
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = { findById: vi.fn().mockResolvedValue(bugReport) };
    const bugReportService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const notificationPort = createNotificationPortMock();
    const projectAccessPort = {
      userHasProjectAccess: vi.fn().mockResolvedValue(false),
    } as unknown as ProjectAccessPort;
    const userPort = {
      findManyByIds: vi.fn().mockResolvedValue([{ id: assigneeUserId, name: "Alice", email: "alice@example.com" }]),
    } as unknown as UserPort;
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      projectAccessPort,
      userPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      notificationPort,
      withTransaction,
    );

    await expect(useCase.execute({ id: bugReportId, assignedTo: assigneeUserId }, userId, actor)).rejects.toMatchObject(
      {
        errorCode: ERROR_CODES.INVALID_DEFAULT_ASSIGNEE,
      },
    );

    expect(withTransaction).not.toHaveBeenCalled();
    expect(notificationPort.ticketAssigned).not.toHaveBeenCalled();
  });
});
