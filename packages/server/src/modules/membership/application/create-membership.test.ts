import { CreateMembershipUseCase } from "@workspace/server/modules/membership/application/create-membership.use-case";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";

describe("CreateMembershipUseCase", () => {
  it("creates an admin membership when the user is not already in the organization", async () => {
    const membershipRepository = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new CreateMembershipUseCase(membershipRepository as unknown as MembershipRepository);

    const result = await useCase.execute({ organizationId }, userId);

    expect(membershipRepository.save).toHaveBeenCalledOnce();
    const saved = membershipRepository.save.mock.calls[0]?.[0];
    expect(result).toEqual(MembershipMapper.toDto(saved));
    expect(saved.userId).toBe(userId);
    expect(saved.role).toBe(UserRole.ADMIN);
  });

  it("throws when this user is already in the organization", async () => {
    const existing = new Membership({
      id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      userId,
      organizationId,
      role: UserRole.ADMIN,
      createdAt: new Date("2026-10-03T09:00:00.000Z"),
    });
    const membershipRepository = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(existing),
      save: vi.fn(),
    };
    const useCase = new CreateMembershipUseCase(membershipRepository as unknown as MembershipRepository);

    await expect(useCase.execute({ organizationId }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.MEMBERSHIP_ALREADY_EXISTS,
    });

    expect(membershipRepository.save).not.toHaveBeenCalled();
  });
});
