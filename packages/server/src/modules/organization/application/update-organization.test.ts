import { UpdateOrganizationUseCase } from "@workspace/server/modules/organization/application/update-organization.use-case";
import { Organization } from "@workspace/server/modules/organization/entity/organization.entity";
import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { describe, expect, it, vi } from "vitest";

const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const existingOrganization = new Organization({
  id: organizationId,
  name: "",
  reports_retention_days: 90,
  createdAt: persistedAt,
});

const membership = {
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: "admin" as const,
  createdAt: persistedAt.toISOString(),
};

describe("UpdateOrganizationUseCase", () => {
  it("updates the organization and returns a public dto", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const organizationRepository = {
      findById: vi.fn().mockResolvedValue(existingOrganization),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new UpdateOrganizationUseCase(
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
    );

    const result = await useCase.execute({ organizationId, name: "Acme" }, userId);

    expect(membershipPort.findByUserAndOrganization).toHaveBeenCalledWith({ userId, organizationId });
    expect(organizationRepository.save).toHaveBeenCalledOnce();
    const saved = organizationRepository.save.mock.calls[0]?.[0];
    expect(result).toEqual(OrganizationMapper.toDto(saved));
    expect(saved.name).toBe("Acme");
  });

  it("throws when the user is not a member", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(null) };
    const organizationRepository = { findById: vi.fn(), save: vi.fn() };
    const useCase = new UpdateOrganizationUseCase(
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
    );

    await expect(useCase.execute({ organizationId, name: "Acme" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(organizationRepository.save).not.toHaveBeenCalled();
  });

  it("throws when the organization is missing", async () => {
    const membershipPort = { findByUserAndOrganization: vi.fn().mockResolvedValue(membership) };
    const organizationRepository = { findById: vi.fn().mockResolvedValue(null), save: vi.fn() };
    const useCase = new UpdateOrganizationUseCase(
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
    );

    await expect(useCase.execute({ organizationId, name: "Acme" }, userId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(organizationRepository.save).not.toHaveBeenCalled();
  });
});
