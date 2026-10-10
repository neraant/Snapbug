import { FindOnboardingUseCase } from "@workspace/server/modules/organization/application/find-onboarding.use-case";
import { Organization } from "@workspace/server/modules/organization/entity/organization.entity";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/organization/port/project.port";
import type { UserPort } from "@workspace/server/modules/organization/port/user.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const completedAt = new Date("2026-10-05T12:00:00.000Z");
const suggestedOrganizationName = "Alex";

const membership = {
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  userId,
  organizationId,
  role: UserRole.ADMIN,
  createdAt: "2026-10-03T09:00:00.000Z",
};

const organization = new Organization({
  id: organizationId,
  name: "Acme",
  reports_retention_days: 90,
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
});

describe("FindOnboardingUseCase", () => {
  it("returns an empty workspace when the user has no membership", async () => {
    const userPort = {
      findOnboardingState: vi.fn().mockResolvedValue({
        onboardingCompletedAt: null,
        suggestedOrganizationName,
      }),
    };
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(null) };
    const organizationRepository = { findById: vi.fn() };
    const projectPort = { findManyByOrganizationId: vi.fn() };
    const useCase = new FindOnboardingUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
      projectPort as unknown as ProjectPort,
    );

    const result = await useCase.execute(userId);

    expect(result).toEqual({
      completedAt: null,
      suggestedOrganizationName,
      organizationId: null,
      organizationName: null,
      projectId: null,
      projectName: null,
    });
    expect(organizationRepository.findById).not.toHaveBeenCalled();
    expect(projectPort.findManyByOrganizationId).not.toHaveBeenCalled();
  });

  it("returns the organization with null project fields when there is no project", async () => {
    const userPort = {
      findOnboardingState: vi.fn().mockResolvedValue({
        onboardingCompletedAt: completedAt,
        suggestedOrganizationName,
      }),
    };
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(membership) };
    const organizationRepository = { findById: vi.fn().mockResolvedValue(organization) };
    const projectPort = { findManyByOrganizationId: vi.fn().mockResolvedValue([]) };
    const useCase = new FindOnboardingUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
      projectPort as unknown as ProjectPort,
    );

    const result = await useCase.execute(userId);

    expect(result).toEqual({
      completedAt,
      suggestedOrganizationName,
      organizationId,
      organizationName: "Acme",
      projectId: null,
      projectName: null,
    });
  });

  it("returns the oldest project when the organization has several", async () => {
    const userPort = {
      findOnboardingState: vi.fn().mockResolvedValue({
        onboardingCompletedAt: null,
        suggestedOrganizationName,
      }),
    };
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(membership) };
    const organizationRepository = { findById: vi.fn().mockResolvedValue(organization) };
    const projectPort = {
      findManyByOrganizationId: vi.fn().mockResolvedValue([
        {
          id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d2",
          name: "Newer",
          organizationId,
          createdAt: "2026-10-04T09:00:00.000Z",
        },
        {
          id: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
          name: "Oldest",
          organizationId,
          createdAt: "2026-10-03T09:00:00.000Z",
        },
      ]),
    };
    const useCase = new FindOnboardingUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
      projectPort as unknown as ProjectPort,
    );

    const result = await useCase.execute(userId);

    expect(result).toEqual({
      completedAt: null,
      suggestedOrganizationName,
      organizationId,
      organizationName: "Acme",
      projectId: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      projectName: "Oldest",
    });
  });
});
