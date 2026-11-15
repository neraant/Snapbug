import { UpdateCommentUseCase } from "@workspace/server/modules/comment/application/update-comment.use-case";
import { Comment } from "@workspace/server/modules/comment/entity/comment.entity";
import type { BugReportPort } from "@workspace/server/modules/comment/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/comment/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/comment/port/project.port";
import type { UserPort } from "@workspace/server/modules/comment/port/user.port";
import type { CommentRepository } from "@workspace/server/modules/comment/repository/comment.repository";
import type { CommentService } from "@workspace/server/modules/comment/service/comment.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const otherUserId = "1b9d70b2-2bc2-56b9-9508-fbf2f617e0e5";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const bugReportId = "6a8c69a1-1ab1-45a8-8497-eae1e506d901";
const commentId = "7b9e80c3-3cd3-67ca-a619-fcf3f728f0f6";

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

function existingComment(authorUserId: string) {
  return new Comment({
    id: commentId,
    bugReportId,
    authorUserId,
    body: "The price is missing.",
    createdAt: new Date("2026-10-03T10:00:00.000Z"),
  });
}

function createCommentService() {
  const saveWithAudit = vi.fn().mockResolvedValue(undefined);
  const withActor = vi.fn().mockReturnValue({ saveWithAudit });
  const commentService = {
    withTx: vi.fn().mockReturnValue({ withActor }),
  };

  return { saveWithAudit, withActor, commentService };
}

describe("UpdateCommentUseCase", () => {
  it("updates an internal comment and audits it", async () => {
    const comment = existingComment(userId);
    const commentRepository = { findById: vi.fn().mockResolvedValue(comment) };
    const bugReportPort = { findById: vi.fn().mockResolvedValue(bugReport("sam@shopper.test")) };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    };
    const userPort = { findManyByIds: vi.fn().mockResolvedValue([teammate]) };
    const { saveWithAudit, withActor, commentService } = createCommentService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new UpdateCommentUseCase(
      bugReportPort as unknown as BugReportPort,
      projectPort as unknown as ProjectPort,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      commentRepository as unknown as CommentRepository,
      commentService as unknown as CommentService,
      withTransaction,
    );

    const result = await useCase.execute({ id: commentId, body: "Fixed in checkout." }, userId, {
      type: "user",
      id: userId,
    });

    expect(result.body).toBe("Fixed in checkout.");
    expect(withActor).toHaveBeenCalledWith({ type: "user", id: userId });
    expect(saveWithAudit).toHaveBeenCalledWith(
      expect.objectContaining({ body: "Fixed in checkout.", authorUserId: userId }),
      projectId,
      "Update comment",
    );
  });

  it("does not update another member's comment", async () => {
    const comment = existingComment(otherUserId);
    const commentRepository = { findById: vi.fn().mockResolvedValue(comment) };
    const bugReportPort = { findById: vi.fn().mockResolvedValue(bugReport("sam@shopper.test")) };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    };
    const userPort = { findManyByIds: vi.fn().mockResolvedValue([teammate]) };
    const { saveWithAudit, commentService } = createCommentService();
    const withTransaction = vi.fn();
    const useCase = new UpdateCommentUseCase(
      bugReportPort as unknown as BugReportPort,
      projectPort as unknown as ProjectPort,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      commentRepository as unknown as CommentRepository,
      commentService as unknown as CommentService,
      withTransaction,
    );

    await expect(
      useCase.execute({ id: commentId, body: "Trying to edit." }, userId, { type: "user", id: userId }),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.CANNOT_MANAGE_COMMENT,
    });

    expect(withTransaction).not.toHaveBeenCalled();
    expect(saveWithAudit).not.toHaveBeenCalled();
  });
});
