import { FindTeamMembersUseCase } from "@workspace/server/modules/membership/application/find-team-members.use-case";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import type { UserPort } from "@workspace/server/modules/membership/port/user.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
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
const user = {
  id: userId,
  name: "Alice",
  email: "alice@example.com",
  onboardingCompletedAt: null,
};

describe("FindTeamMembersUseCase", () => {
  it("returns public team member details for the organization", async () => {
    const membershipRepository = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(membership),
      findManyByOrganizationId: vi.fn().mockResolvedValue([membership]),
    };
    const userPort = { findManyByIds: vi.fn().mockResolvedValue([user]) };
    const useCase = new FindTeamMembersUseCase(
      membershipRepository as unknown as MembershipRepository,
      userPort as unknown as UserPort,
    );

    const result = await useCase.execute(userId, organizationId);

    expect(membershipRepository.findManyByOrganizationId).toHaveBeenCalledWith(organizationId);
    expect(userPort.findManyByIds).toHaveBeenCalledWith([userId]);
    expect(result).toEqual([
      {
        id: membership.id,
        userId,
        name: "Alice",
        email: "alice@example.com",
        role: UserRole.ADMIN,
        createdAt: "2026-10-03T09:00:00.000Z",
      },
    ]);
  });

  it("rejects users without an organization before loading the team", async () => {
    const membershipRepository = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
      findManyByOrganizationId: vi.fn(),
    };
    const userPort = { findManyByIds: vi.fn() };
    const useCase = new FindTeamMembersUseCase(
      membershipRepository as unknown as MembershipRepository,
      userPort as unknown as UserPort,
    );

    await expect(useCase.execute(userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(membershipRepository.findManyByOrganizationId).not.toHaveBeenCalled();
    expect(userPort.findManyByIds).not.toHaveBeenCalled();
  });
});
