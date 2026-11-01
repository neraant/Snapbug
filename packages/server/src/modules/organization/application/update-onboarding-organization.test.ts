import { UpdateOnboardingOrganizationUseCase } from "@workspace/server/modules/organization/application/update-onboarding-organization.use-case";
import { Organization } from "@workspace/server/modules/organization/entity/organization.entity";
import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { UserPort } from "@workspace/server/modules/organization/port/user.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const existingOrganization = new Organization({
  id: organizationId,
  name: "Acme",
  reports_retention_days: 90,
  createdAt: persistedAt,
});

const membership = {
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: UserRole.USER,
  createdAt: persistedAt.toISOString(),
};

describe("UpdateOnboardingOrganizationUseCase", () => {
  it("renames the organization a member joined while onboarding is open", async () => {
    const userPort = {
      findOnboardingState: vi
        .fn()
        .mockResolvedValue({ onboardingCompletedAt: null, suggestedOrganizationName: "Alex" }),
    };
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const organizationRepository = {
      findById: vi.fn().mockResolvedValue(existingOrganization),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new UpdateOnboardingOrganizationUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
    );

    const result = await useCase.execute({ organizationId, name: "Acme Labs" }, userId);

    expect(organizationRepository.save).toHaveBeenCalledOnce();
    const saved = organizationRepository.save.mock.calls[0]?.[0];
    expect(saved.name).toBe("Acme Labs");
    expect(result).toEqual(OrganizationMapper.toDto(saved));
  });

  it("rejects the rename once onboarding is complete without loading the organization", async () => {
    const userPort = {
      findOnboardingState: vi.fn().mockResolvedValue({
        onboardingCompletedAt: new Date("2026-10-05T12:00:00.000Z"),
        suggestedOrganizationName: "Alex",
      }),
    };
    const membershipPort = { findByUserAndOrganization: vi.fn() };
    const organizationRepository = { findById: vi.fn(), save: vi.fn() };
    const useCase = new UpdateOnboardingOrganizationUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
    );

    await expect(useCase.execute({ organizationId, name: "Acme Labs" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ADMIN_REQUIRED,
    });

    expect(membershipPort.findByUserAndOrganization).not.toHaveBeenCalled();
    expect(organizationRepository.findById).not.toHaveBeenCalled();
    expect(organizationRepository.save).not.toHaveBeenCalled();
  });

  it("rejects a user who does not belong to the organization without saving", async () => {
    const userPort = {
      findOnboardingState: vi
        .fn()
        .mockResolvedValue({ onboardingCompletedAt: null, suggestedOrganizationName: "Alex" }),
    };
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(null) };
    const organizationRepository = { findById: vi.fn(), save: vi.fn() };
    const useCase = new UpdateOnboardingOrganizationUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
    );

    await expect(useCase.execute({ organizationId, name: "Acme Labs" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(organizationRepository.findById).not.toHaveBeenCalled();
    expect(organizationRepository.save).not.toHaveBeenCalled();
  });
});
