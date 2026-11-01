import { GrantProjectToMembersUseCase } from "@workspace/server/modules/membership/application/grant-project-to-members.use-case";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { ProjectAccess } from "@workspace/server/modules/membership/entity/project-access.entity";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import type { ProjectAccessService } from "@workspace/server/modules/membership/service/project-access.service";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const userId = "9a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const createdAt = new Date("2026-10-03T09:00:00.000Z");

const admin = new Membership({
  id: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId: "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  organizationId,
  role: UserRole.ADMIN,
  createdAt,
});
const member = new Membership({
  id: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  organizationId,
  role: UserRole.USER,
  createdAt,
});

function setup(memberships: Membership[], existing: ProjectAccess[] = []) {
  const membershipRepository = { findManyByOrganizationId: vi.fn().mockResolvedValue(memberships) };
  const projectAccessRepository = { findManyByProjectId: vi.fn().mockResolvedValue(existing) };
  const saveWithAudit = vi.fn();
  const withActor = vi.fn().mockReturnValue({ saveWithAudit });
  const projectAccessService = { withActor };
  const useCase = new GrantProjectToMembersUseCase(
    membershipRepository as unknown as MembershipRepository,
    projectAccessRepository as unknown as ProjectAccessRepository,
    projectAccessService as unknown as ProjectAccessService,
  );

  return { projectAccessRepository, saveWithAudit, withActor, useCase };
}

describe("GrantProjectToMembersUseCase", () => {
  it("grants a new project to every current member", async () => {
    const { useCase, saveWithAudit, withActor } = setup([admin, member]);

    await useCase.execute(organizationId, projectId, userId);

    expect(withActor).toHaveBeenCalledWith({ type: "user", id: userId });
    const saved = saveWithAudit.mock.calls.map((call) => call[0] as ProjectAccess);
    expect(saved.map((projectAccess) => projectAccess.membershipId).sort()).toEqual([admin.id, member.id].sort());
    expect(saved.every((projectAccess) => projectAccess.projectId === projectId)).toBe(true);
    expect(saveWithAudit).toHaveBeenCalledTimes(2);
    expect(saveWithAudit).toHaveBeenCalledWith(expect.any(ProjectAccess), "Grant project access");
  });

  it("does not grant a membership that already has the project", async () => {
    const existing = new ProjectAccess({
      id: "aa8c69a1-1ab1-45a8-8497-eae1e506d9d4",
      membershipId: admin.id,
      projectId,
      createdAt,
    });
    const { useCase, saveWithAudit } = setup([admin, member], [existing]);

    await useCase.execute(organizationId, projectId, userId);

    const saved = saveWithAudit.mock.calls.map((call) => call[0] as ProjectAccess);
    expect(saved.map((projectAccess) => projectAccess.membershipId)).toEqual([member.id]);
  });

  it("does not write when the organization has no members", async () => {
    const { useCase, saveWithAudit, projectAccessRepository } = setup([]);

    await useCase.execute(organizationId, projectId, userId);

    expect(projectAccessRepository.findManyByProjectId).not.toHaveBeenCalled();
    expect(saveWithAudit).not.toHaveBeenCalled();
  });
});
