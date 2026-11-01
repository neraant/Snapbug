import { FindOrganizationByIdUseCase } from "@workspace/server/modules/organization/application/find-organization-by-id.use-case";
import { Organization } from "@workspace/server/modules/organization/entity/organization.entity";
import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { describe, expect, it, vi } from "vitest";

const organizationId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organization = new Organization({
  id: organizationId,
  name: "Acme",
  reports_retention_days: 30,
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
});

describe("FindOrganizationByIdUseCase", () => {
  it("returns the public organization when it exists", async () => {
    const organizationRepository = { findById: vi.fn().mockResolvedValue(organization) };
    const useCase = new FindOrganizationByIdUseCase(organizationRepository as unknown as OrganizationRepository);

    const result = await useCase.execute(organizationId);

    expect(organizationRepository.findById).toHaveBeenCalledWith(organizationId);
    expect(result).toEqual(OrganizationMapper.toDto(organization));
  });

  it("returns null when the organization does not exist", async () => {
    const organizationRepository = { findById: vi.fn().mockResolvedValue(null) };
    const useCase = new FindOrganizationByIdUseCase(organizationRepository as unknown as OrganizationRepository);

    const result = await useCase.execute(organizationId);

    expect(result).toBeNull();
  });
});
