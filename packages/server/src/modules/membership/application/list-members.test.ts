import { ListMembersUseCase } from "@workspace/server/modules/membership/application/list-members.use-case";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import type { UserPort } from "@workspace/server/modules/membership/port/user.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const memberUserId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";

const callerMembership = new Membership({
  id: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId,
  organizationId,
  role: UserRole.USER,
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
});

const adminCallerMembership = new Membership({
  ...callerMembership.toObject(),
  id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  role: UserRole.ADMIN,
});

const teamMembership = new Membership({
  id: "5a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  userId: memberUserId,
  organizationId,
  role: UserRole.ADMIN,
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
});

describe("ListMembersUseCase", () => {
  it("omits emails for non-admin callers", async () => {
    const membershipRepository = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(callerMembership),
      findManyByOrganizationId: vi.fn().mockResolvedValue([teamMembership]),
    };
    const userPort = {
      findManyByIds: vi.fn().mockResolvedValue([
        {
          id: memberUserId,
          email: "admin@test.io",
          name: "Admin",
          interfaceLanguage: "en",
          onboardingCompletedAt: null,
        },
      ]),
    };
    const useCase = new ListMembersUseCase(
      membershipRepository as unknown as MembershipRepository,
      userPort as unknown as UserPort,
    );

    const result = await useCase.execute({}, userId, organizationId);

    expect(result[0]?.email).toBeUndefined();
    expect(result[0]?.name).toBe("Admin");
  });

  it("includes emails for admin callers", async () => {
    const member = new Membership({
      ...teamMembership.toObject(),
      id: "6a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
      role: UserRole.USER,
    });
    const membershipRepository = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(adminCallerMembership),
      findManyByOrganizationId: vi.fn().mockResolvedValue([member]),
    };
    const userPort = {
      findManyByIds: vi.fn().mockResolvedValue([
        {
          id: memberUserId,
          email: "member@test.io",
          name: "Member",
          interfaceLanguage: "en",
          onboardingCompletedAt: null,
        },
      ]),
    };
    const useCase = new ListMembersUseCase(
      membershipRepository as unknown as MembershipRepository,
      userPort as unknown as UserPort,
    );

    const result = await useCase.execute({}, userId, organizationId);

    expect(result[0]?.email).toBe("member@test.io");
  });

  it("does not list members when the caller is not in the organization", async () => {
    const membershipRepository = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
      findManyByOrganizationId: vi.fn(),
    };
    const userPort = { findManyByIds: vi.fn() };
    const useCase = new ListMembersUseCase(
      membershipRepository as unknown as MembershipRepository,
      userPort as unknown as UserPort,
    );

    await expect(useCase.execute({}, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(membershipRepository.findManyByOrganizationId).not.toHaveBeenCalled();
  });
});
