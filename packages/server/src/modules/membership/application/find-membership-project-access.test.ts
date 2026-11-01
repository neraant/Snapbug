import { FindMembershipProjectAccessUseCase } from "@workspace/server/modules/membership/application/find-membership-project-access.use-case";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { ProjectAccess } from "@workspace/server/modules/membership/entity/project-access.entity";
import type { ProjectPort } from "@workspace/server/modules/membership/port/project.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const currentUserId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const createdAt = new Date("2026-10-03T09:00:00.000Z");
const storeProjectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const marketingProjectId = "5a8c69a1-1ab1-45a8-8497-eae1e506d9d4";

const currentMembership = new Membership({
  id: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId: currentUserId,
  organizationId,
  role: UserRole.ADMIN,
  createdAt,
});
const member = new Membership({
  id: "6a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  organizationId,
  role: UserRole.USER,
  createdAt,
});
const adminMember = new Membership({
  id: "7a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId: "8a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  organizationId,
  role: UserRole.ADMIN,
  createdAt,
});
const projects = [
  {
    id: storeProjectId,
    name: "Acme Store",
    color: "#F97316" as const,
    organizationId,
    createdAt: createdAt.toISOString(),
  },
  {
    id: marketingProjectId,
    name: "Acme Marketing",
    color: "#3B82F6" as const,
    organizationId,
    createdAt: createdAt.toISOString(),
  },
];

function setup(memberships = [currentMembership, member]) {
  const membershipRepository = {
    findByUserAndOrganization: vi.fn().mockResolvedValue(currentMembership),
    findManyByOrganizationId: vi.fn().mockResolvedValue(memberships),
  };
  const projectAccessRepository = {
    findManyByMembershipId: vi.fn().mockResolvedValue([
      new ProjectAccess({
        id: "9a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
        membershipId: member.id,
        projectId: storeProjectId,
        createdAt,
      }),
    ]),
  };
  const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue(projects) };
  return {
    membershipRepository,
    projectAccessRepository,
    projectPort,
    useCase: new FindMembershipProjectAccessUseCase(
      membershipRepository as unknown as MembershipRepository,
      projectAccessRepository as unknown as ProjectAccessRepository,
      projectPort as unknown as ProjectPort,
    ),
  };
}

describe("FindMembershipProjectAccessUseCase", () => {
  it("lists every project as allowed and locked for an admin", async () => {
    const { useCase, projectAccessRepository } = setup([currentMembership, adminMember]);

    const result = await useCase.execute({ membershipId: adminMember.id }, currentUserId, organizationId);

    expect(projectAccessRepository.findManyByMembershipId).not.toHaveBeenCalled();
    expect(result.locked).toBe(true);
    expect(result.projects.map((project) => project.allowed)).toEqual([true, true]);
  });

  it("lists the member allow-list", async () => {
    const { useCase, projectAccessRepository } = setup();

    const result = await useCase.execute({ membershipId: member.id }, currentUserId, organizationId);

    expect(projectAccessRepository.findManyByMembershipId).toHaveBeenCalledWith(member.id);
    expect(result.locked).toBe(false);
    expect(result.projects).toEqual([
      { id: storeProjectId, name: "Acme Store", color: "#F97316", allowed: true },
      { id: marketingProjectId, name: "Acme Marketing", color: "#3B82F6", allowed: false },
    ]);
  });

  it("throws when the membership is outside the active organization", async () => {
    const { useCase, projectPort } = setup();

    await expect(
      useCase.execute({ membershipId: "aa8c69a1-1ab1-45a8-8497-eae1e506d9d4" }, currentUserId, organizationId),
    ).rejects.toMatchObject({ errorCode: ERROR_CODES.MEMBERSHIP_NOT_FOUND });

    expect(projectPort.findManyByOrganizationId).not.toHaveBeenCalled();
  });
});
