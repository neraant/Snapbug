import { FindProjectMembersUseCase } from "@workspace/server/modules/membership/application/find-project-members.use-case";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { ProjectAccess } from "@workspace/server/modules/membership/entity/project-access.entity";
import type { ProjectPort } from "@workspace/server/modules/membership/port/project.port";
import type { UserPort } from "@workspace/server/modules/membership/port/user.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const adminUserId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const memberUserId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d2";
const strangerUserId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d3";
const createdAt = new Date("2026-10-03T09:00:00.000Z");

const admin = new Membership({
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId: adminUserId,
  organizationId,
  role: UserRole.ADMIN,
  createdAt,
});
const member = new Membership({
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d2",
  userId: memberUserId,
  organizationId,
  role: UserRole.USER,
  createdAt,
});
const stranger = new Membership({
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d3",
  userId: strangerUserId,
  organizationId,
  role: UserRole.USER,
  createdAt,
});

const project = {
  id: projectId,
  name: "Store",
  color: "#F97316" as const,
  organizationId,
  createdAt: createdAt.toISOString(),
};

describe("FindProjectMembersUseCase", () => {
  it("returns admins and members who have access to the project", async () => {
    const membershipRepository = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(admin),
      findManyByOrganizationId: vi.fn().mockResolvedValue([admin, member, stranger]),
    };
    const projectAccessRepository = {
      findManyByProjectId: vi.fn().mockResolvedValue([
        new ProjectAccess({
          id: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
          membershipId: member.id,
          projectId,
          createdAt,
        }),
      ]),
    };
    const projectPort = { findById: vi.fn().mockResolvedValue(project) };
    const userPort = {
      findManyByIds: vi.fn().mockResolvedValue([
        { id: adminUserId, name: "Ada", email: "ada@example.com", onboardingCompletedAt: null },
        { id: memberUserId, name: "Bea", email: "bea@example.com", onboardingCompletedAt: null },
      ]),
    };
    const useCase = new FindProjectMembersUseCase(
      membershipRepository as unknown as MembershipRepository,
      projectAccessRepository as unknown as ProjectAccessRepository,
      projectPort as unknown as ProjectPort,
      userPort as unknown as UserPort,
    );

    const result = await useCase.execute({ projectId }, adminUserId, organizationId);

    expect(result.map((person) => person.userId)).toEqual([adminUserId, memberUserId]);
    expect(userPort.findManyByIds).toHaveBeenCalledWith([adminUserId, memberUserId]);
    expect(userPort.findManyByIds.mock.calls[0]?.[0]).not.toContain(strangerUserId);
  });
});
