import { ReplaceMembershipProjectAccessUseCase } from "@workspace/server/modules/membership/application/replace-membership-project-access.use-case";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { ProjectAccess } from "@workspace/server/modules/membership/entity/project-access.entity";
import type { ProjectPort } from "@workspace/server/modules/membership/port/project.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import type { ProjectAccessService } from "@workspace/server/modules/membership/service/project-access.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const currentUserId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const createdAt = new Date("2026-10-03T09:00:00.000Z");
const storeProjectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const foreignProjectId = "5a8c69a1-1ab1-45a8-8497-eae1e506d9d4";

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
];

function setup(existing: ProjectAccess[] = [], memberships = [currentMembership, member, adminMember]) {
  const membershipRepository = {
    findByUserAndOrganization: vi.fn().mockResolvedValue(currentMembership),
    findManyByOrganizationId: vi.fn().mockResolvedValue(memberships),
  };
  const projectAccessRepository = { findManyByMembershipId: vi.fn().mockResolvedValue(existing) };
  const saveWithAudit = vi.fn();
  const deleteWithAudit = vi.fn();
  const withActor = vi.fn().mockReturnValue({ saveWithAudit, deleteWithAudit });
  const withTx = vi.fn().mockReturnValue({ withActor });
  const projectAccessService = { withTx };
  const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue(projects) };
  const withTransaction = vi.fn(async (callback: (tx: unknown) => Promise<void>) => await callback({}));
  return {
    projectAccessRepository,
    projectPort,
    withTransaction,
    saveWithAudit,
    deleteWithAudit,
    withTx,
    withActor,
    useCase: new ReplaceMembershipProjectAccessUseCase(
      membershipRepository as unknown as MembershipRepository,
      projectAccessRepository as unknown as ProjectAccessRepository,
      projectPort as unknown as ProjectPort,
      projectAccessService as unknown as ProjectAccessService,
      withTransaction as WithTransactionType,
    ),
  };
}

describe("ReplaceMembershipProjectAccessUseCase", () => {
  it("saves the member allow-list", async () => {
    const removed = new ProjectAccess({
      id: "aa8c69a1-1ab1-45a8-8497-eae1e506d9d4",
      membershipId: member.id,
      projectId: foreignProjectId,
      createdAt,
    });
    const { useCase, saveWithAudit, deleteWithAudit, withTx, withActor } = setup([removed]);

    const result = await useCase.execute(
      { membershipId: member.id, projectIds: [storeProjectId, storeProjectId] },
      currentUserId,
      organizationId,
    );

    expect(withTx).toHaveBeenCalledOnce();
    expect(withActor).toHaveBeenCalledWith({ type: "user", id: currentUserId });
    expect(deleteWithAudit).toHaveBeenCalledWith(removed, "Remove project access");
    const saved = saveWithAudit.mock.calls.map((call) => call[0] as ProjectAccess);
    expect(saved.map((projectAccess) => projectAccess.projectId)).toEqual([storeProjectId]);
    expect(saved.every((projectAccess) => projectAccess.membershipId === member.id)).toBe(true);
    expect(saveWithAudit).toHaveBeenCalledWith(expect.any(ProjectAccess), "Grant project access");
    expect(result.projects).toEqual([{ id: storeProjectId, name: "Acme Store", color: "#F97316", allowed: true }]);
    expect(result.locked).toBe(false);
  });

  it("rejects a project from outside the active organization", async () => {
    const { useCase, saveWithAudit, deleteWithAudit, withTransaction } = setup();

    await expect(
      useCase.execute({ membershipId: member.id, projectIds: [foreignProjectId] }, currentUserId, organizationId),
    ).rejects.toMatchObject({ errorCode: ERROR_CODES.PROJECT_NOT_FOUND });

    expect(withTransaction).not.toHaveBeenCalled();
    expect(saveWithAudit).not.toHaveBeenCalled();
    expect(deleteWithAudit).not.toHaveBeenCalled();
  });

  it("does not persist a restriction for an admin", async () => {
    const { useCase, saveWithAudit, deleteWithAudit, projectPort } = setup();

    await expect(
      useCase.execute({ membershipId: adminMember.id, projectIds: [] }, currentUserId, organizationId),
    ).rejects.toMatchObject({ errorCode: ERROR_CODES.CANNOT_RESTRICT_ADMIN });

    expect(projectPort.findManyByOrganizationId).not.toHaveBeenCalled();
    expect(saveWithAudit).not.toHaveBeenCalled();
    expect(deleteWithAudit).not.toHaveBeenCalled();
  });

  it("does not allow changing your own project access", async () => {
    const { useCase, saveWithAudit, deleteWithAudit } = setup();

    await expect(
      useCase.execute(
        { membershipId: currentMembership.id, projectIds: [storeProjectId] },
        currentUserId,
        organizationId,
      ),
    ).rejects.toMatchObject({ errorCode: ERROR_CODES.CANNOT_CHANGE_OWN_PROJECT_ACCESS });

    expect(saveWithAudit).not.toHaveBeenCalled();
    expect(deleteWithAudit).not.toHaveBeenCalled();
  });
});
