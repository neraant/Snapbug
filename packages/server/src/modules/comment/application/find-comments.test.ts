import { FindCommentsUseCase } from "@workspace/server/modules/comment/application/find-comments.use-case";
import { Comment } from "@workspace/server/modules/comment/entity/comment.entity";
import { CommentMapper } from "@workspace/server/modules/comment/entity/comment.mapper";
import type { BugReportPort } from "@workspace/server/modules/comment/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/comment/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/comment/port/project.port";
import type { UserPort } from "@workspace/server/modules/comment/port/user.port";
import type { CommentRepository } from "@workspace/server/modules/comment/repository/comment.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const bugReportId = "6a8c69a1-1ab1-45a8-8497-eae1e506d901";
const createdAt = new Date("2026-10-03T10:00:00.000Z");

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

const comment = new Comment({
  id: "8a8c69a1-1ab1-45a8-8497-eae1e506d901",
  bugReportId,
  authorUserId: userId,
  body: "The price is missing.",
  createdAt,
});

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

describe("FindCommentsUseCase", () => {
  it("returns internal comments to a teammate", async () => {
    const bugReportPort = { findById: vi.fn().mockResolvedValue(bugReport("sam@shopper.test")) };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    };
    const userPort = { findManyByIds: vi.fn().mockResolvedValue([teammate]) };
    const commentRepository = { findManyByBugReportId: vi.fn().mockResolvedValue([comment]) };
    const useCase = new FindCommentsUseCase(
      bugReportPort as unknown as BugReportPort,
      projectPort as unknown as ProjectPort,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      commentRepository as unknown as CommentRepository,
    );

    const result = await useCase.execute({ bugReportId }, userId);

    expect(result).toEqual([CommentMapper.toDto(comment, teammate)]);
  });

  it("hides internal comments from the report author", async () => {
    const bugReportPort = { findById: vi.fn().mockResolvedValue(bugReport("sam@shopper.test")) };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn(async (_membership: unknown, projectIds: string[]) => projectIds),
    };
    const userPort = { findManyByIds: vi.fn().mockResolvedValue([reporter]) };
    const commentRepository = { findManyByBugReportId: vi.fn() };
    const useCase = new FindCommentsUseCase(
      bugReportPort as unknown as BugReportPort,
      projectPort as unknown as ProjectPort,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      commentRepository as unknown as CommentRepository,
    );

    const result = await useCase.execute({ bugReportId }, userId);

    expect(result).toEqual([]);
    expect(commentRepository.findManyByBugReportId).not.toHaveBeenCalled();
  });

  it("does not return comments for a ticket the member cannot access", async () => {
    const bugReportPort = { findById: vi.fn().mockResolvedValue(bugReport(null)) };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      filterProjectIds: vi.fn().mockResolvedValue([]),
    };
    const userPort = { findManyByIds: vi.fn() };
    const commentRepository = { findManyByBugReportId: vi.fn() };
    const useCase = new FindCommentsUseCase(
      bugReportPort as unknown as BugReportPort,
      projectPort as unknown as ProjectPort,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      commentRepository as unknown as CommentRepository,
    );

    await expect(useCase.execute({ bugReportId }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.BUG_REPORT_NOT_FOUND,
    });

    expect(commentRepository.findManyByBugReportId).not.toHaveBeenCalled();
  });
});
