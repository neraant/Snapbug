import { RemoveMembershipUseCase } from "@workspace/server/modules/membership/application/remove-membership.use-case";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { MembershipService } from "@workspace/server/modules/membership/service/membership.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const currentUserId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const currentMembership = new Membership({
  id: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId: currentUserId,
  organizationId,
  role: UserRole.ADMIN,
  createdAt: new Date(),
});
const otherMembership = new Membership({
  id: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  organizationId,
  role: UserRole.USER,
  createdAt: new Date(),
});

function setup(memberships = [currentMembership, otherMembership]) {
  const membershipRepository = {
    findByUserAndOrganization: vi.fn().mockResolvedValue(currentMembership),
    findManyByOrganizationId: vi.fn().mockResolvedValue(memberships),
  };
  const deleteWithAudit = vi.fn();
  return {
    membershipRepository,
    deleteWithAudit,
    useCase: new RemoveMembershipUseCase(
      membershipRepository as unknown as MembershipRepository,
      { withActor: vi.fn().mockReturnValue({ deleteWithAudit }) } as unknown as MembershipService,
    ),
  };
}

describe("RemoveMembershipUseCase", () => {
  it("removes another member", async () => {
    const { useCase, deleteWithAudit } = setup();

    const result = await useCase.execute({ membershipId: otherMembership.id }, currentUserId, organizationId);

    expect(deleteWithAudit).toHaveBeenCalledWith(otherMembership, "Remove membership");
    expect(result).toEqual(MembershipMapper.toDto(otherMembership));
  });

  it("does not allow removing yourself", async () => {
    const { useCase, deleteWithAudit } = setup();

    await expect(
      useCase.execute({ membershipId: currentMembership.id }, currentUserId, organizationId),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.CANNOT_REMOVE_SELF,
    });

    expect(deleteWithAudit).not.toHaveBeenCalled();
  });

  it("keeps at least one admin", async () => {
    const soleAdmin = new Membership({ ...otherMembership.toObject(), role: UserRole.ADMIN });
    const memberCaller = new Membership({ ...currentMembership.toObject(), role: UserRole.USER });
    const { useCase, membershipRepository, deleteWithAudit } = setup([memberCaller, soleAdmin]);
    membershipRepository.findByUserAndOrganization.mockResolvedValue(memberCaller);

    await expect(useCase.execute({ membershipId: soleAdmin.id }, currentUserId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.LAST_ADMIN_REQUIRED,
    });

    expect(deleteWithAudit).not.toHaveBeenCalled();
  });
});
