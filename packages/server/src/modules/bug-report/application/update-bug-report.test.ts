import { UpdateBugReportUseCase } from "@workspace/server/modules/bug-report/application/update-bug-report.use-case";
import { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type { BugReportService } from "@workspace/server/modules/bug-report/service/bug-report.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
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

describe("UpdateBugReportUseCase", () => {
  it("updates status for a member", async () => {
    const updatedBugReport = bugReport.update({ status: BugReportStatus.IN_PROGRESS });
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = {
      findById: vi.fn().mockResolvedValueOnce(bugReport).mockResolvedValueOnce(updatedBugReport),
    };
    const { saveWithAudit, normalizeBoardOrder, bugReportService } = createBugReportService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
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
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = {
      findById: vi.fn().mockResolvedValueOnce(bugReport).mockResolvedValueOnce(updatedBugReport),
    };
    const { bugReportService } = createBugReportService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
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
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const updatedBugReport = resolvedBugReport.update({ status: BugReportStatus.NEW });
    const bugReportRepository = {
      findById: vi.fn().mockResolvedValueOnce(resolvedBugReport).mockResolvedValueOnce(updatedBugReport),
    };
    const { bugReportService } = createBugReportService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      withTransaction,
    );

    const result = await useCase.execute({ id: bugReportId, status: BugReportStatus.NEW }, userId, actor);

    expect(result.status).toBe(BugReportStatus.NEW);
    expect(result.resolvedAt).toBeNull();
  });

  it("throws when the bug report is missing", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn() };
    const projectPort = { findById: vi.fn() };
    const bugReportRepository = { findById: vi.fn().mockResolvedValue(null) };
    const bugReportService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
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
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = { findById: vi.fn().mockResolvedValue(bugReport) };
    const { saveWithAudit, bugReportService } = createBugReportService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      withTransaction,
    );

    const result = await useCase.execute({ id: bugReportId, status: BugReportStatus.NEW }, userId, actor);

    expect(result.status).toBe(BugReportStatus.NEW);
    expect(withTransaction).not.toHaveBeenCalled();
    expect(saveWithAudit).not.toHaveBeenCalled();
  });

  it("throws when the user is not a member", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(null) };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const bugReportRepository = { findById: vi.fn().mockResolvedValue(bugReport) };
    const bugReportService = { withTx: vi.fn() };
    const withTransaction = vi.fn();
    const useCase = new UpdateBugReportUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
      bugReportService as unknown as BugReportService,
      withTransaction,
    );

    await expect(
      useCase.execute({ id: bugReportId, status: BugReportStatus.CLOSED }, userId, actor),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(withTransaction).not.toHaveBeenCalled();
  });
});
