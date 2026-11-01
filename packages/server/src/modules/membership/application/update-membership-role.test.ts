import { UpdateMembershipRoleUseCase } from "@workspace/server/modules/membership/application/update-membership-role.use-case";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const currentUserId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const otherUserId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const currentMembership = new Membership({
  id: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId: currentUserId,
  organizationId,
  role: UserRole.ADMIN,
  createdAt: new Date(),
});
const otherMembership = new Membership({
  id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId: otherUserId,
  organizationId,
  role: UserRole.USER,
  createdAt: new Date(),
});

function setup(memberships = [currentMembership, otherMembership]) {
  const membershipRepository = {
    findByUserAndOrganization: vi.fn().mockResolvedValue(currentMembership),
    findManyByOrganizationId: vi.fn().mockResolvedValue(memberships),
    save: vi.fn(),
  };
  return {
    membershipRepository,
    useCase: new UpdateMembershipRoleUseCase(membershipRepository as unknown as MembershipRepository),
  };
}

describe("UpdateMembershipRoleUseCase", () => {
  it("changes another member's role", async () => {
    const { useCase, membershipRepository } = setup();

    const result = await useCase.execute(
      { membershipId: otherMembership.id, role: UserRole.ADMIN },
      currentUserId,
      organizationId,
    );

    expect(membershipRepository.save).toHaveBeenCalledOnce();
    expect(result).toEqual(MembershipMapper.toDto(otherMembership.changeRole(UserRole.ADMIN)));
  });

  it("does not allow changing your own role", async () => {
    const { useCase, membershipRepository } = setup();

    await expect(
      useCase.execute({ membershipId: currentMembership.id, role: UserRole.USER }, currentUserId, organizationId),
    ).rejects.toMatchObject({ errorCode: ERROR_CODES.CANNOT_CHANGE_OWN_ROLE });

    expect(membershipRepository.save).not.toHaveBeenCalled();
  });

  it("keeps at least one admin", async () => {
    const soleAdmin = new Membership({ ...otherMembership.toObject(), role: UserRole.ADMIN });
    const memberCaller = new Membership({ ...currentMembership.toObject(), role: UserRole.USER });
    const { useCase, membershipRepository } = setup([memberCaller, soleAdmin]);
    membershipRepository.findByUserAndOrganization.mockResolvedValue(memberCaller);

    await expect(
      useCase.execute({ membershipId: soleAdmin.id, role: UserRole.USER }, currentUserId, organizationId),
    ).rejects.toMatchObject({ errorCode: ERROR_CODES.LAST_ADMIN_REQUIRED });

    expect(membershipRepository.save).not.toHaveBeenCalled();
  });
});
