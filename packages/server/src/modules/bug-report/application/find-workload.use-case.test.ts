import { FindWorkloadUseCase } from "@workspace/server/modules/bug-report/application/find-workload.use-case";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { UserPort } from "@workspace/server/modules/bug-report/port/user.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const aliceId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const bobId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const carolId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const otherOrganizationId = "9a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

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

const members = [aliceId, bobId, carolId].map((memberId, index) => ({
  id: `5a8c69a1-1ab1-45a8-8497-eae1e506d9d${index}`,
  userId: memberId,
  organizationId,
  role: UserRole.USER,
  createdAt: "2026-10-03T09:00:00.000Z",
}));

const users = [
  { id: aliceId, name: "Alice", email: "alice@example.com", onboardingCompletedAt: null },
  { id: bobId, name: "Bob", email: "bob@example.com", onboardingCompletedAt: null },
  { id: carolId, name: null, email: "carol@example.com", onboardingCompletedAt: null },
];

describe("FindWorkloadUseCase", () => {
  it("includes every member at zero plus unassigned when nothing is open", async () => {
    const membershipPort = {
      findByUser: vi.fn().mockResolvedValue(membership),
      findManyByOrganizationId: vi.fn().mockResolvedValue(members),
    };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([]), findById: vi.fn() };
    const userPort = { findManyByIds: vi.fn().mockResolvedValue(users) };
    const bugReportRepository = { countOpenByAssignee: vi.fn() };
    const useCase = new FindWorkloadUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute({}, userId);

    expect(bugReportRepository.countOpenByAssignee).not.toHaveBeenCalled();
    expect(result).toEqual([
      { userId: aliceId, name: "Alice", email: "alice@example.com", openCount: 0 },
      { userId: bobId, name: "Bob", email: "bob@example.com", openCount: 0 },
      { userId: carolId, name: "carol@example.com", email: "carol@example.com", openCount: 0 },
      { userId: null, name: "Unassigned", email: null, openCount: 0 },
    ]);
  });

  it("counts only open assignments and sorts by count then name", async () => {
    const membershipPort = {
      findByUser: vi.fn().mockResolvedValue(membership),
      findManyByOrganizationId: vi.fn().mockResolvedValue(members),
    };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([project]), findById: vi.fn() };
    const userPort = { findManyByIds: vi.fn().mockResolvedValue(users) };
    const bugReportRepository = {
      countOpenByAssignee: vi.fn().mockResolvedValue([
        { assignedTo: bobId, count: 2 },
        { assignedTo: null, count: 2 },
      ]),
    };
    const useCase = new FindWorkloadUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    const result = await useCase.execute({}, userId);

    expect(bugReportRepository.countOpenByAssignee).toHaveBeenCalledWith([projectId]);
    expect(result).toEqual([
      { userId: bobId, name: "Bob", email: "bob@example.com", openCount: 2 },
      { userId: null, name: "Unassigned", email: null, openCount: 2 },
      { userId: aliceId, name: "Alice", email: "alice@example.com", openCount: 0 },
      { userId: carolId, name: "carol@example.com", email: "carol@example.com", openCount: 0 },
    ]);
  });

  it("throws when the project does not belong to the organization", async () => {
    const membershipPort = {
      findByUser: vi.fn().mockResolvedValue(membership),
      findManyByOrganizationId: vi.fn(),
    };
    const projectPort = {
      findById: vi.fn().mockResolvedValue({ ...project, organizationId: otherOrganizationId }),
      findManyByOrganizationId: vi.fn(),
    };
    const userPort = { findManyByIds: vi.fn() };
    const bugReportRepository = { countOpenByAssignee: vi.fn() };
    const useCase = new FindWorkloadUseCase(
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      userPort as unknown as UserPort,
      bugReportRepository as unknown as BugReportRepository,
    );

    await expect(useCase.execute({ projectId }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.PROJECT_NOT_FOUND,
    });

    expect(membershipPort.findManyByOrganizationId).not.toHaveBeenCalled();
    expect(bugReportRepository.countOpenByAssignee).not.toHaveBeenCalled();
  });
});
