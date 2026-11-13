import { CompleteOnboardingUseCase } from "@workspace/server/modules/organization/application/complete-onboarding.use-case";
import type { FindOnboardingUseCase } from "@workspace/server/modules/organization/application/find-onboarding.use-case";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/organization/port/project.port";
import type { UserPort } from "@workspace/server/modules/organization/port/user.port";
import type { OrganizationService } from "@workspace/server/modules/organization/service/organization.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
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
const tx = { id: "tx" };

describe("CompleteOnboardingUseCase", () => {
  it("returns the snapshot without provisioning when onboarding is already complete", async () => {
    const userPort = {
      findOnboardingState: vi.fn().mockResolvedValue({ onboardingCompletedAt: completedAt }),
      withTx: vi.fn(),
    };
    const membershipPort = { findByUser: vi.fn(), withTx: vi.fn() };
    const findOnboarding = { execute: vi.fn().mockResolvedValue(snapshot) };
    const withTransaction = vi.fn();
    const useCase = new CompleteOnboardingUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      { withTx: vi.fn() } as unknown as OrganizationService,
      { withTx: vi.fn() } as unknown as ProjectPort,
      findOnboarding as unknown as FindOnboardingUseCase,
      withTransaction as unknown as WithTransactionType,
    );

    const result = await useCase.execute({}, userId, organizationId);

    expect(result).toEqual(snapshot);
    expect(withTransaction).not.toHaveBeenCalled();
  });

  it("provisions a workspace and marks onboarding complete inside a transaction", async () => {
    const saveWithAudit = vi.fn().mockResolvedValue(undefined);
    const membershipInTx = { create: vi.fn().mockResolvedValue({}) };
    const projectInTx = { create: vi.fn().mockResolvedValue({}), findManyByOrganizationId: vi.fn() };
    const userInTx = { markOnboardingComplete: vi.fn().mockResolvedValue(undefined) };
    const userPort = {
      findOnboardingState: vi.fn().mockResolvedValue({ onboardingCompletedAt: null }),
      withTx: vi.fn().mockReturnValue(userInTx),
    };
    const membershipPort = {
      findManyByUser: vi.fn().mockResolvedValue([]),
      withTx: vi.fn().mockReturnValue(membershipInTx),
    };
    const projectPort = { withTx: vi.fn().mockReturnValue(projectInTx) };
    const repository = {
      withTx: vi.fn().mockReturnValue({ withActor: vi.fn().mockReturnValue({ saveWithAudit }) }),
    };
    const findOnboarding = {
      execute: vi.fn().mockResolvedValue({ ...snapshot, completedAt: new Date("2026-10-06T09:00:00.000Z") }),
    };
    const withTransaction = vi.fn(async (callback) => await callback(tx));
    const useCase = new CompleteOnboardingUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      repository as unknown as OrganizationService,
      projectPort as unknown as ProjectPort,
      findOnboarding as unknown as FindOnboardingUseCase,
      withTransaction as unknown as WithTransactionType,
    );

    await useCase.execute({ organizationName: "Acme Labs", projectName: "Store" }, userId, null);

    expect(repository.withTx).toHaveBeenCalledWith(tx);
    expect(saveWithAudit).toHaveBeenCalledOnce();
    const savedOrganization = saveWithAudit.mock.calls[0]?.[0];
    expect(savedOrganization.name).toBe("Acme Labs");
    expect(membershipInTx.create).toHaveBeenCalledOnce();
    expect(projectInTx.create).toHaveBeenCalledWith(expect.objectContaining({ name: "Store" }), userId);
    expect(userInTx.markOnboardingComplete).toHaveBeenCalledWith(userId);
    expect(findOnboarding.execute).toHaveBeenCalledWith(userId, savedOrganization.id);
  });

  it("creates a project when the user already has an organization", async () => {
    const saveWithAudit = vi.fn();
    const projectInTx = {
      create: vi.fn().mockResolvedValue({}),
      findManyByOrganizationId: vi.fn().mockResolvedValue([]),
    };
    const userInTx = { markOnboardingComplete: vi.fn().mockResolvedValue(undefined) };
    const userPort = {
      findOnboardingState: vi.fn().mockResolvedValue({ onboardingCompletedAt: null }),
      withTx: vi.fn().mockReturnValue(userInTx),
    };
    const membershipInTx = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId }),
    };
    const membershipPort = {
      withTx: vi.fn().mockReturnValue(membershipInTx),
    };
    const projectPort = { withTx: vi.fn().mockReturnValue(projectInTx) };
    const repository = {
      withTx: vi.fn().mockReturnValue({ withActor: vi.fn().mockReturnValue({ saveWithAudit }) }),
    };
    const findOnboarding = { execute: vi.fn().mockResolvedValue(snapshot) };
    const withTransaction = vi.fn(async (callback) => await callback(tx));
    const useCase = new CompleteOnboardingUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      repository as unknown as OrganizationService,
      projectPort as unknown as ProjectPort,
      findOnboarding as unknown as FindOnboardingUseCase,
      withTransaction as unknown as WithTransactionType,
    );

    await useCase.execute({ projectName: "Checkout" }, userId, organizationId);

    expect(saveWithAudit).not.toHaveBeenCalled();
    expect(projectInTx.create).toHaveBeenCalledWith(
      expect.objectContaining({ organizationId, name: "Checkout" }),
      userId,
    );
    expect(userInTx.markOnboardingComplete).toHaveBeenCalledWith(userId);
  });

  it("marks onboarding complete without creating a workspace when the user already belongs to an organization", async () => {
    const saveWithAudit = vi.fn();
    const membershipInTx = {
      create: vi.fn(),
      findByUserAndOrganization: vi.fn().mockResolvedValue({ organizationId }),
    };
    const projectInTx = {
      create: vi.fn(),
      findManyByOrganizationId: vi.fn().mockResolvedValue([{ id: snapshot.projectId }]),
    };
    const userInTx = { markOnboardingComplete: vi.fn().mockResolvedValue(undefined) };
    const userPort = {
      findOnboardingState: vi.fn().mockResolvedValue({ onboardingCompletedAt: null }),
      withTx: vi.fn().mockReturnValue(userInTx),
    };
    const membershipPort = {
      findManyByUser: vi.fn().mockResolvedValue([{ organizationId }]),
      withTx: vi.fn().mockReturnValue(membershipInTx),
    };
    const projectPort = { withTx: vi.fn().mockReturnValue(projectInTx) };
    const repository = {
      withTx: vi.fn().mockReturnValue({ withActor: vi.fn().mockReturnValue({ saveWithAudit }) }),
    };
    const findOnboarding = { execute: vi.fn().mockResolvedValue(snapshot) };
    const withTransaction = vi.fn(async (callback) => await callback(tx));
    const useCase = new CompleteOnboardingUseCase(
      userPort as unknown as UserPort,
      membershipPort as unknown as MembershipPort,
      repository as unknown as OrganizationService,
      projectPort as unknown as ProjectPort,
      findOnboarding as unknown as FindOnboardingUseCase,
      withTransaction as unknown as WithTransactionType,
    );

    await useCase.execute({ organizationName: "Personal" }, userId, null);

    expect(saveWithAudit).not.toHaveBeenCalled();
    expect(membershipInTx.create).not.toHaveBeenCalled();
    expect(projectInTx.create).not.toHaveBeenCalled();
    expect(userInTx.markOnboardingComplete).toHaveBeenCalledWith(userId);
    expect(findOnboarding.execute).toHaveBeenCalledWith(userId, organizationId);
  });
});
