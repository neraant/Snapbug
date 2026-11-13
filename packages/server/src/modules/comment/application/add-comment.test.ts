import { AddCommentUseCase } from "@workspace/server/modules/comment/application/add-comment.use-case";
import type { BugReportPort } from "@workspace/server/modules/comment/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/comment/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/comment/port/project.port";
import type { UserPort } from "@workspace/server/modules/comment/port/user.port";
import type { CommentService } from "@workspace/server/modules/comment/service/comment.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const bugReportId = "6a8c69a1-1ab1-45a8-8497-eae1e506d901";

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

const teammate = {
  id: userId,
  name: "Alex Admin",
  email: "admin@example.com",
  onboardingCompletedAt: null,
};

const reporter = {
  id: userId,
  name: "Sam Shopper",
  email: "sam@shopper.test",
  onboardingCompletedAt: null,
};

function bugReport(reporterEmail: string | null) {
  return {
    id: bugReportId,
    projectId,
    shortId: "SNB-1",
    assignedTo: null,
    status: "new",
    boardOrder: 1024,
    severity: "high",
    title: "Pay button throws",
    description: "Clicking Pay shows a blank page.",
    stepsToReproduce: null,
    reporterEmail,
    url: "https://store.acme.test/checkout",
    userAgent: null,
    browser: null,
    os: null,
    device: null,
    viewportWidth: null,
    viewportHeight: null,
    hasReplay: false,
    hasScreenshot: false,
    consoleLogs: null,
    networkLogs: null,
    customContext: null,
    createdAt: "2026-10-03T09:00:00.000Z",
    updatedAt: "2026-10-03T09:00:00.000Z",
    resolvedAt: null,
  };
}

function createCommentService() {
  const saveWithAudit = vi.fn().mockResolvedValue(undefined);
  const withActor = vi.fn().mockReturnValue({ saveWithAudit });
  const commentService = {
    withTx: vi.fn().mockReturnValue({ withActor }),
  };

  return { saveWithAudit, withActor, commentService };
}

describe("AddCommentUseCase", () => {
  it("stores an internal comment and audits it as mcp", async () => {
    const bugReportPort = { findById: vi.fn().mockResolvedValue(bugReport("sam@shopper.test")) };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    };
    const userPort = { findManyByIds: vi.fn().mockResolvedValue([teammate]) };
    const { saveWithAudit, withActor, commentService } = createCommentService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const actor = { type: "mcp" as const, id: userId };
    const useCase = new AddCommentUseCase(
      bugReportPort as unknown as BugReportPort,
      projectPort as unknown as ProjectPort,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      commentService as unknown as CommentService,
      withTransaction,
    );

    const result = await useCase.execute({ bugReportId, body: "The price is missing." }, userId, actor);

    expect(result.body).toBe("The price is missing.");
    expect(result.authorEmail).toBe(teammate.email);
    expect(result.bugReportId).toBe(bugReportId);
    expect(withActor).toHaveBeenCalledWith(actor);
    expect(saveWithAudit).toHaveBeenCalledWith(
      expect.objectContaining({ body: "The price is missing.", authorUserId: userId, bugReportId }),
      projectId,
      "Add comment",
    );
  });

  it("does not store a comment for the report author", async () => {
    const bugReportPort = { findById: vi.fn().mockResolvedValue(bugReport("Sam@Shopper.test")) };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    };
    const userPort = { findManyByIds: vi.fn().mockResolvedValue([reporter]) };
    const { saveWithAudit, commentService } = createCommentService();
    const withTransaction = vi.fn();
    const useCase = new AddCommentUseCase(
      bugReportPort as unknown as BugReportPort,
      projectPort as unknown as ProjectPort,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      commentService as unknown as CommentService,
      withTransaction,
    );

    await expect(
      useCase.execute({ bugReportId, body: "I can see this." }, userId, { type: "user", id: userId }),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.BUG_REPORT_NOT_FOUND,
    });

    expect(withTransaction).not.toHaveBeenCalled();
    expect(saveWithAudit).not.toHaveBeenCalled();
  });

  it("does not store a comment on a ticket the member cannot access", async () => {
    const bugReportPort = { findById: vi.fn().mockResolvedValue(bugReport("sam@shopper.test")) };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn().mockResolvedValue([]),
    };
    const userPort = { findManyByIds: vi.fn() };
    const { saveWithAudit, commentService } = createCommentService();
    const withTransaction = vi.fn();
    const useCase = new AddCommentUseCase(
      bugReportPort as unknown as BugReportPort,
      projectPort as unknown as ProjectPort,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      commentService as unknown as CommentService,
      withTransaction,
    );

    await expect(
      useCase.execute({ bugReportId, body: "Hidden ticket." }, userId, { type: "mcp", id: userId }),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.BUG_REPORT_NOT_FOUND,
    });

    expect(userPort.findManyByIds).not.toHaveBeenCalled();
    expect(withTransaction).not.toHaveBeenCalled();
    expect(saveWithAudit).not.toHaveBeenCalled();
  });
});
