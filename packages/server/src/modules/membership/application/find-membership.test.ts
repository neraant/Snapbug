import { FindMembershipUseCase } from "@workspace/server/modules/membership/application/find-membership.use-case";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const membership = new Membership({
  id: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId,
  organizationId,
  role: UserRole.ADMIN,
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
});

describe("FindMembershipUseCase", () => {
  it("returns the public membership when it exists", async () => {
    const membershipRepository = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
    };
    const useCase = new FindMembershipUseCase(membershipRepository as unknown as MembershipRepository);

    const result = await useCase.execute({ userId, organizationId });

    expect(membershipRepository.findByUserAndOrganization).toHaveBeenCalledWith(userId, organizationId);
    expect(result).toEqual(MembershipMapper.toDto(membership));
  });

  it("returns null when the membership does not exist", async () => {
    const membershipRepository = { findByUserAndOrganization: vi.fn().mockResolvedValue(null) };
    const useCase = new FindMembershipUseCase(membershipRepository as unknown as MembershipRepository);

    const result = await useCase.execute({ userId, organizationId });

    expect(result).toBeNull();
  });
});
