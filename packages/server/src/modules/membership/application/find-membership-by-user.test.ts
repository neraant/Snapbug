import { FindMembershipByUserUseCase } from "@workspace/server/modules/membership/application/find-membership-by-user.use-case";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

describe("FindMembershipByUserUseCase", () => {
  it("returns the membership for the active organization", async () => {
    const membership = new Membership({
      id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      userId,
      organizationId,
      role: UserRole.ADMIN,
      createdAt: new Date("2026-10-03T09:00:00.000Z"),
    });
    const membershipRepository = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const useCase = new FindMembershipByUserUseCase(membershipRepository as unknown as MembershipRepository);

    const result = await useCase.execute(userId, organizationId);

    expect(membershipRepository.findByUserAndOrganization).toHaveBeenCalledWith(userId, organizationId);
    expect(result).toEqual(MembershipMapper.toDto(membership));
  });

  it("returns null when there is no active organization", async () => {
    const membershipRepository = {
      findByUserAndOrganization: vi.fn(),
    };
    const useCase = new FindMembershipByUserUseCase(membershipRepository as unknown as MembershipRepository);

    const result = await useCase.execute(userId, null);

    expect(result).toBeNull();
    expect(membershipRepository.findByUserAndOrganization).not.toHaveBeenCalled();
  });
});
