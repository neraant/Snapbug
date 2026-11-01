import { FindOrganizationsUseCase } from "@workspace/server/modules/organization/application/find-organizations.use-case";
import { Organization } from "@workspace/server/modules/organization/entity/organization.entity";
import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const olderOrganizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const newerOrganizationId = "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

describe("FindOrganizationsUseCase", () => {
  it("returns each organization the user belongs to, keeping membership order", async () => {
    const memberships = [
      {
        id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d2",
        userId,
        organizationId: newerOrganizationId,
        role: UserRole.USER,
        createdAt: "2026-10-04T09:00:00.000Z",
      },
      {
        id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
        userId,
        organizationId: olderOrganizationId,
        role: UserRole.ADMIN,
        createdAt: "2026-10-03T09:00:00.000Z",
      },
    ];
    const organizations = [
      new Organization({
        id: olderOrganizationId,
        name: "Acme",
        reports_retention_days: 90,
        createdAt: new Date("2026-10-03T09:00:00.000Z"),
      }),
      new Organization({
        id: newerOrganizationId,
        name: "Beta",
        reports_retention_days: 90,
        createdAt: new Date("2026-10-04T09:00:00.000Z"),
      }),
    ];
    const membershipPort = { findManyByUser: vi.fn().mockResolvedValue(memberships) };
    const organizationRepository = { findManyByIds: vi.fn().mockResolvedValue(organizations) };
    const useCase = new FindOrganizationsUseCase(
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
    );

    const result = await useCase.execute(userId);

    expect(membershipPort.findManyByUser).toHaveBeenCalledWith(userId);
    expect(organizationRepository.findManyByIds).toHaveBeenCalledWith([newerOrganizationId, olderOrganizationId]);
    expect(result).toEqual(OrganizationMapper.toFindOrganizationsOutput(memberships, organizations));
  });

  it("returns an empty list when the user has no memberships", async () => {
    const membershipPort = { findManyByUser: vi.fn().mockResolvedValue([]) };
    const organizationRepository = { findManyByIds: vi.fn() };
    const useCase = new FindOrganizationsUseCase(
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
    );

    const result = await useCase.execute(userId);

    expect(result).toEqual([]);
    expect(organizationRepository.findManyByIds).not.toHaveBeenCalled();
  });
});
