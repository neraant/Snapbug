import { AcceptInvitationUseCase } from "@workspace/server/modules/invitation/application/accept-invitation.use-case";
import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/invitation/port/project.port";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { createHash } from "crypto";
import { describe, expect, it, vi } from "vitest";

function hashToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const token = "b".repeat(64);
const projectId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const pendingInvitation = new Invitation({
  id: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  organizationId,
  email: "invitee@company.com",
  tokenHash: hashToken(token),
  tokenVersion: 1,
  invitedByUserId: "9a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  role: UserRole.USER,
  projectIds: [projectId],
  expiresAt: new Date(Date.now() + 60_000),
  acceptedAt: null,
  revokedAt: null,
  createdAt: persistedAt,
});

const storedProjectAccessReleasedAt = new Date("2026-11-16T11:29:39.000Z");

function createTransactionalDeps() {
  const membershipPort = {
    findByUserAndOrganization: vi.fn().mockResolvedValue(null),
    createInvited: vi.fn().mockResolvedValue({
      id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      userId,
      organizationId,
      role: UserRole.USER,
      createdAt: persistedAt.toISOString(),
    }),
    grantProjects: vi.fn(),
    withTx: vi.fn(),
  };
  membershipPort.withTx.mockReturnValue(membershipPort);

  const projectPort = {
    findManyByOrganizationId: vi.fn().mockResolvedValue([
      {
        id: projectId,
        name: "Acme Store",
        color: "#F97316",
        organizationId,
        createdAt: persistedAt.toISOString(),
      },
    ]),
    withTx: vi.fn(),
  };
  projectPort.withTx.mockReturnValue(projectPort);

  const invitationRepository = {
    findByToken: vi.fn().mockResolvedValue(pendingInvitation),
    save: vi.fn().mockResolvedValue(undefined),
    withTx: vi.fn(),
  };
  invitationRepository.withTx.mockReturnValue(invitationRepository);

  const saveWithAudit = vi.fn().mockResolvedValue(undefined);
  const invitationService = {
    saveWithAudit,
    hashToken,
    withTx: vi.fn(),
    withActor: vi.fn(),
  };
  const transactionalInvitation = {
    saveWithAudit,
    withActor: vi.fn().mockReturnValue({ saveWithAudit }),
  };
  invitationService.withTx.mockReturnValue(transactionalInvitation);

  const withTransactionFn: WithTransactionType = vi.fn(async (callback) => await callback({} as never));

  const userPort = {
    markOnboardingComplete: vi.fn().mockResolvedValue(undefined),
  };

  return { membershipPort, projectPort, invitationRepository, invitationService, withTransactionFn, userPort };
}

describe("AcceptInvitationUseCase", () => {
  it("throws when the invitation token is invalid", async () => {
    const invitationRepository = { findByToken: vi.fn().mockResolvedValue(null) };
    const useCase = new AcceptInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      { findByUserAndOrganization: vi.fn() } as unknown as MembershipPort,
      { findManyByOrganizationId: vi.fn(), withTx: vi.fn() } as unknown as ProjectPort,
      vi.fn() as WithTransactionType,
      { hashToken, withTx: vi.fn(), withActor: vi.fn() } as unknown as InvitationService,
      { markOnboardingComplete: vi.fn() } as unknown as UserPort,
    );

    await expect(useCase.execute({ token }, userId, "invitee@company.com")).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_INVITATION_TOKEN,
    });
  });

  it("throws when the signed-in email does not match the invitation", async () => {
    const { membershipPort, projectPort, invitationRepository, invitationService, withTransactionFn, userPort } =
      createTransactionalDeps();
    const useCase = new AcceptInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      withTransactionFn,
      invitationService as unknown as InvitationService,
      userPort as unknown as UserPort,
    );

    await expect(useCase.execute({ token }, userId, "other@company.com")).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVITATION_EMAIL_MISMATCH,
    });

    expect(withTransactionFn).not.toHaveBeenCalled();
  });

  it("returns the existing membership when the user is already a member", async () => {
    const existingMembership = {
      id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      userId,
      organizationId,
      role: UserRole.ADMIN,
      createdAt: persistedAt.toISOString(),
    };
    const { membershipPort, projectPort, invitationRepository, invitationService, withTransactionFn, userPort } =
      createTransactionalDeps();
    membershipPort.findByUserAndOrganization.mockResolvedValue(existingMembership);
    const useCase = new AcceptInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      withTransactionFn,
      invitationService as unknown as InvitationService,
      userPort as unknown as UserPort,
    );

    const result = await useCase.execute({ token }, userId, "invitee@company.com");

    expect(result).toEqual(existingMembership);
    expect(membershipPort.createInvited).not.toHaveBeenCalled();
    expect(invitationService.saveWithAudit).toHaveBeenCalledOnce();
  });

  it("creates a user membership and marks the invitation accepted", async () => {
    const { membershipPort, projectPort, invitationRepository, invitationService, withTransactionFn, userPort } =
      createTransactionalDeps();
    const useCase = new AcceptInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      withTransactionFn,
      invitationService as unknown as InvitationService,
      userPort as unknown as UserPort,
    );

    const result = await useCase.execute({ token }, userId, "invitee@company.com");

    expect(userPort.markOnboardingComplete).toHaveBeenCalledWith(userId);
    expect(invitationRepository.findByToken).toHaveBeenCalledWith(hashToken(token));
    expect(withTransactionFn).toHaveBeenCalledOnce();
    expect(membershipPort.createInvited).toHaveBeenCalledWith(organizationId, userId, UserRole.USER);
    expect(membershipPort.grantProjects).toHaveBeenCalledWith(
      "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      [projectId],
      userId,
    );
    expect(invitationService.saveWithAudit).toHaveBeenCalledOnce();
    expect(membershipPort.findByUserAndOrganization).toHaveBeenCalledWith({ userId, organizationId });
    expect(result.userId).toBe(userId);
    expect(result.organizationId).toBe(organizationId);
  });

  it("grants no projects when a member invitation stores an empty project list", async () => {
    const invitationWithoutProjects = new Invitation({
      ...pendingInvitation.toObject(),
      projectIds: [],
      createdAt: storedProjectAccessReleasedAt,
    });
    const { membershipPort, projectPort, invitationRepository, invitationService, withTransactionFn, userPort } =
      createTransactionalDeps();
    invitationRepository.findByToken.mockResolvedValue(invitationWithoutProjects);
    const useCase = new AcceptInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      withTransactionFn,
      invitationService as unknown as InvitationService,
      userPort as unknown as UserPort,
    );

    await useCase.execute({ token }, userId, "invitee@company.com");

    expect(membershipPort.grantProjects).toHaveBeenCalledWith("1a8c69a1-1ab1-45a8-8497-eae1e506d9d1", [], userId);
  });

  it("grants every organization project for a legacy pending invite with an empty project list", async () => {
    const legacyInvitation = new Invitation({
      ...pendingInvitation.toObject(),
      projectIds: [],
      createdAt: new Date(storedProjectAccessReleasedAt.getTime() - 1),
    });
    const { membershipPort, projectPort, invitationRepository, invitationService, withTransactionFn, userPort } =
      createTransactionalDeps();
    invitationRepository.findByToken.mockResolvedValue(legacyInvitation);
    const useCase = new AcceptInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      withTransactionFn,
      invitationService as unknown as InvitationService,
      userPort as unknown as UserPort,
    );

    await useCase.execute({ token }, userId, "invitee@company.com");

    expect(membershipPort.grantProjects).toHaveBeenCalledWith(
      "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
      [projectId],
      userId,
    );
  });

  it("accepts an invitation when the user already belongs to another organization", async () => {
    const { membershipPort, projectPort, invitationRepository, invitationService, withTransactionFn, userPort } =
      createTransactionalDeps();
    const useCase = new AcceptInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
      projectPort as unknown as ProjectPort,
      withTransactionFn,
      invitationService as unknown as InvitationService,
      userPort as unknown as UserPort,
    );

    const result = await useCase.execute({ token }, userId, "invitee@company.com");

    expect(result.organizationId).toBe(organizationId);
    expect(membershipPort.createInvited).toHaveBeenCalledWith(organizationId, userId, UserRole.USER);
  });
});
