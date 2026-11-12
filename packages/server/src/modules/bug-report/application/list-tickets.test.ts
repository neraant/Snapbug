import { ListTicketsUseCase } from "@workspace/server/modules/bug-report/application/list-tickets.use-case";
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
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const hiddenProjectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d2";
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

const hiddenProject = {
  id: hiddenProjectId,
  name: "Hidden",
  organizationId,
  createdAt: "2026-10-03T09:00:00.000Z",
};

function createBugReport(id: string, reportProjectId: string) {
  return new BugReport({
    id,
    projectId: reportProjectId,
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
    replayKey: "replays/secret.json",
    hasReplay: true,
    consoleLogs: null,
    networkLogs: null,
    customContext: null,
    createdAt,
    updatedAt: createdAt,
    resolvedAt: null,
  });
}

describe("ListTicketsUseCase", () => {
  it("lists tickets only for projects the member can access and does not return a replay", async () => {
    const visible = createBugReport("6a8c69a1-1ab1-45a8-8497-eae1e506d901", projectId);
    const membershipPort = {
      findManyByUser: vi.fn().mockResolvedValue([membership]),
      filterProjectIds: vi.fn().mockResolvedValue([projectId]),
    };
    const projectPort = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([project, hiddenProject]),
      findById: vi.fn(),
    };
    const bugReportRepository = { findManyByProjectIds: vi.fn().mockResolvedValue([visible]) };
    const useCase = new ListTicketsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute({}, userId);

    expect(bugReportRepository.findManyByProjectIds).toHaveBeenCalledWith([projectId]);
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Pay button throws");
    expect(result[0]?.hasReplay).toBe(true);
    expect(result[0]).not.toHaveProperty("replay");
    expect(result[0]).not.toHaveProperty("replayKey");
  });

  it("does not list a project the member cannot access", async () => {
    const membershipPort = {
      findManyByUser: vi.fn().mockResolvedValue([membership]),
      filterProjectIds: vi.fn().mockResolvedValue([]),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(hiddenProject) };
    const bugReportRepository = { findManyByProjectIds: vi.fn() };
    const useCase = new ListTicketsUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute({ projectId: hiddenProjectId }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(bugReportRepository.findManyByProjectIds).not.toHaveBeenCalled();
  });
});
