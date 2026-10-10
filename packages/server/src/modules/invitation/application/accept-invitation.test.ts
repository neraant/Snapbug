import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import { AcceptInvitationUseCase } from "@workspace/server/modules/invitation/application/accept-invitation.use-case";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const token = "550e8400-e29b-41d4-a716-446655440000";
const persistedAt = new Date("2026-10-03T09:00:00.000Z");

const pendingInvitation = new Invitation({
  id: "3a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
  organizationId,
  email: "invitee@company.com",
  token,
  invitedByUserId: "9a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  expiresAt: new Date(Date.now() + 60_000),
  acceptedAt: null,
  createdAt: persistedAt,
});

function createTransactionalDeps() {
  const membershipRepository = {
    save: vi.fn().mockResolvedValue(undefined),
    withTx: vi.fn(),
  };
  membershipRepository.withTx.mockReturnValue(membershipRepository);

  const invitationRepository = {
    findByToken: vi.fn().mockResolvedValue(pendingInvitation),
    save: vi.fn().mockResolvedValue(undefined),
    withTx: vi.fn(),
  };
  invitationRepository.withTx.mockReturnValue(invitationRepository);

  const withTransactionFn: WithTransactionType = vi.fn(async (callback) => await callback({} as never));

  return { membershipRepository, invitationRepository, withTransactionFn };
}

describe("AcceptInvitationUseCase", () => {
  it("throws when the invitation token is invalid", async () => {
    const invitationRepository = { findByToken: vi.fn().mockResolvedValue(null) };
    const useCase = new AcceptInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      { findByUser: vi.fn() } as unknown as MembershipPort,
      { save: vi.fn(), withTx: vi.fn() } as unknown as MembershipRepository,
      vi.fn() as WithTransactionType,
    );

    await expect(useCase.execute({ token }, userId, "invitee@company.com")).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_INVITATION_TOKEN,
    });
  });

  it("throws when the signed-in email does not match the invitation", async () => {
    const { membershipRepository, invitationRepository, withTransactionFn } = createTransactionalDeps();
    const useCase = new AcceptInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      { findByUser: vi.fn().mockResolvedValue(null) } as unknown as MembershipPort,
      membershipRepository as unknown as MembershipRepository,
      withTransactionFn,
    );

    await expect(useCase.execute({ token }, userId, "other@company.com")).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVITATION_EMAIL_MISMATCH,
    });

    expect(withTransactionFn).not.toHaveBeenCalled();
  });

  it("throws when the user already belongs to an organization", async () => {
    const { membershipRepository, invitationRepository, withTransactionFn } = createTransactionalDeps();
    const membershipPort = {
      findByUser: vi.fn().mockResolvedValue(
        new Membership({
          id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d1",
          userId,
          organizationId,
          role: UserRole.ADMIN,
          createdAt: persistedAt,
        }),
      ),
    };
    const useCase = new AcceptInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
      membershipRepository as unknown as MembershipRepository,
      withTransactionFn,
    );

    await expect(useCase.execute({ token }, userId, "invitee@company.com")).rejects.toMatchObject({
      errorCode: ERROR_CODES.USER_ALREADY_HAS_ORGANIZATION,
    });

    expect(withTransactionFn).not.toHaveBeenCalled();
  });

  it("creates a user membership and marks the invitation accepted", async () => {
    const { membershipRepository, invitationRepository, withTransactionFn } = createTransactionalDeps();
    const membershipPort = { findByUser: vi.fn().mockResolvedValue(null) };
    const useCase = new AcceptInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
      membershipRepository as unknown as MembershipRepository,
      withTransactionFn,
    );

    const result = await useCase.execute({ token }, userId, "invitee@company.com");

    expect(withTransactionFn).toHaveBeenCalledOnce();
    expect(membershipRepository.save).toHaveBeenCalledOnce();
    const savedMembership = membershipRepository.save.mock.calls[0]?.[0];
    expect(savedMembership.userId).toBe(userId);
    expect(savedMembership.organizationId).toBe(organizationId);
    expect(savedMembership.role).toBe(UserRole.USER);
    expect(invitationRepository.save).toHaveBeenCalledOnce();
    const savedInvitation = invitationRepository.save.mock.calls[0]?.[0];
    expect(savedInvitation.acceptedAt).not.toBeNull();
    expect(result.role).toBe(UserRole.USER);
    expect(result.organizationId).toBe(organizationId);
    expect(result.userId).toBe(userId);
  });
});
