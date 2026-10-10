import { User } from "@workspace/server/modules/identity/entity/user.entity";
import type { UserRepository } from "@workspace/server/modules/identity/repository/user.repository";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { CompleteOnboardingUseCase } from "@workspace/server/modules/organization/application/complete-onboarding.use-case";
import type { FindOnboardingUseCase } from "@workspace/server/modules/organization/application/find-onboarding.use-case";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { UserPort } from "@workspace/server/modules/organization/port/user.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const completedAt = new Date("2026-10-05T12:00:00.000Z");
const snapshot = {
  completedAt,
  suggestedOrganizationName: "Alex",
  organizationId,
  organizationName: "Acme",
  projectId: "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  projectName: "Default project",
};

const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const existingUser = new User({
  id: userId,
  name: "Alex",
  email: "alex@company.com",
  passwordHash: "hashed-secret",
  passwordChangedAt: null,
  onboardingCompletedAt: null,
  createdAt: persistedAt,
  updatedAt: persistedAt,
});

function createTransactionalDeps() {
  const organizationRepository = {
    save: vi.fn().mockResolvedValue(undefined),
    withTx: vi.fn(),
  };
  organizationRepository.withTx.mockReturnValue(organizationRepository);

  const membershipRepository = {
    save: vi.fn().mockResolvedValue(undefined),
    findByOrganizationId: vi.fn().mockResolvedValue(null),
    findByUserAndOrganization: vi.fn(
      async (memberUserId: string, memberOrganizationId: string) =>
        new Membership({
          id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
          userId: memberUserId,
          organizationId: memberOrganizationId,
          role: UserRole.ADMIN,
          createdAt: persistedAt,
        }),
    ),
    withTx: vi.fn(),
  };
  membershipRepository.withTx.mockReturnValue(membershipRepository);

  const projectRepository = {
    save: vi.fn().mockResolvedValue(undefined),
    findManyByOrganizationId: vi.fn().mockResolvedValue([]),
    withTx: vi.fn(),
  };
  projectRepository.withTx.mockReturnValue(projectRepository);

  const userRepository = {
    findById: vi.fn().mockResolvedValue(existingUser),
    save: vi.fn().mockResolvedValue(undefined),
    withTx: vi.fn(),
  };
  userRepository.withTx.mockReturnValue(userRepository);

  const withTransactionFn: WithTransactionType = vi.fn(async (callback) => await callback({} as never));

  return {
    organizationRepository,
    membershipRepository,
    projectRepository,
    userRepository,
    withTransactionFn,
  };
}

describe("CompleteOnboardingUseCase", () => {
  it("returns the snapshot without provisioning when onboarding is already complete", async () => {
    const userPort = {
      findOnboardingState: vi.fn().mockResolvedValue({ onboardingCompletedAt: completedAt }),
    };
    const membershipPort = { findByUser: vi.fn() };
    const { organizationRepository, membershipRepository, projectRepository, userRepository, withTransactionFn } =
      createTransactionalDeps();
    const findOnboardingUseCase = { execute: vi.fn().mockResolvedValue(snapshot) };
    const useCase = new CompleteOnboardingUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
      membershipRepository as unknown as MembershipRepository,
      projectRepository as unknown as ProjectRepository,
      userRepository as unknown as UserRepository,
      findOnboardingUseCase as unknown as FindOnboardingUseCase,
      withTransactionFn,
    );

    const result = await useCase.execute({}, userId);

    expect(result).toEqual(snapshot);
    expect(withTransactionFn).not.toHaveBeenCalled();
    expect(organizationRepository.save).not.toHaveBeenCalled();
  });

  it("provisions a workspace and marks onboarding complete inside a transaction", async () => {
    const userPort = {
      findOnboardingState: vi.fn().mockResolvedValue({ onboardingCompletedAt: null }),
    };
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(null) };
    const { organizationRepository, membershipRepository, projectRepository, userRepository, withTransactionFn } =
      createTransactionalDeps();
    const findOnboardingUseCase = {
      execute: vi.fn().mockResolvedValue({ ...snapshot, completedAt: new Date("2026-10-06T09:00:00.000Z") }),
    };
    const useCase = new CompleteOnboardingUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
      membershipRepository as unknown as MembershipRepository,
      projectRepository as unknown as ProjectRepository,
      userRepository as unknown as UserRepository,
      findOnboardingUseCase as unknown as FindOnboardingUseCase,
      withTransactionFn,
    );

    await useCase.execute({ organizationName: "Acme Labs", projectName: "Store" }, userId);

    expect(withTransactionFn).toHaveBeenCalledOnce();
    expect(organizationRepository.save).toHaveBeenCalledOnce();
    const savedOrganization = organizationRepository.save.mock.calls[0]?.[0];
    expect(savedOrganization.name).toBe("Acme Labs");
    expect(membershipRepository.save).toHaveBeenCalledOnce();
    expect(projectRepository.save).toHaveBeenCalledOnce();
    const savedProject = projectRepository.save.mock.calls[0]?.[0];
    expect(savedProject.name).toBe("Store");
    expect(userRepository.save).toHaveBeenCalledOnce();
    expect(findOnboardingUseCase.execute).toHaveBeenCalledWith(userId);
  });

  it("creates a project when the user already has an organization", async () => {
    const userPort = {
      findOnboardingState: vi.fn().mockResolvedValue({ onboardingCompletedAt: null }),
    };
    const membershipPort = { findByUser: vi.fn().mockResolvedValue({ organizationId }) };
    const { organizationRepository, membershipRepository, projectRepository, userRepository, withTransactionFn } =
      createTransactionalDeps();
    const findOnboardingUseCase = { execute: vi.fn().mockResolvedValue(snapshot) };
    const useCase = new CompleteOnboardingUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      organizationRepository as unknown as OrganizationRepository,
      membershipRepository as unknown as MembershipRepository,
      projectRepository as unknown as ProjectRepository,
      userRepository as unknown as UserRepository,
      findOnboardingUseCase as unknown as FindOnboardingUseCase,
      withTransactionFn,
    );

    await useCase.execute({ projectName: "Checkout" }, userId);

    expect(withTransactionFn).toHaveBeenCalledOnce();
    expect(organizationRepository.save).not.toHaveBeenCalled();
    expect(projectRepository.save).toHaveBeenCalledOnce();
    const savedProject = projectRepository.save.mock.calls[0]?.[0];
    expect(savedProject.name).toBe("Checkout");
    expect(userRepository.save).toHaveBeenCalledOnce();
  });
});
