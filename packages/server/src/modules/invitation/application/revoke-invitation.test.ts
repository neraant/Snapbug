import { RevokeInvitationUseCase } from "@workspace/server/modules/invitation/application/revoke-invitation.use-case";
import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { createHash } from "crypto";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const invitationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const createdAt = new Date("2026-11-15T09:00:00.000Z");
const expiresAt = new Date("2026-11-22T09:00:00.000Z");
const revokedAt = new Date("2026-11-16T09:00:00.000Z");

function pendingInvitation(): Invitation {
  return new Invitation({
    id: invitationId,
    organizationId,
    email: "teammate@example.com",
    tokenHash: createHash("sha256").update("token").digest("hex"),
    tokenVersion: 1,
    invitedByUserId: userId,
    role: UserRole.USER,
    projectIds: [],
    expiresAt,
    acceptedAt: null,
    revokedAt: null,
    createdAt,
  });
}

function transactionalService(saveWithAudit = vi.fn().mockResolvedValue(undefined)) {
  const service = {
    saveWithAudit,
    withActor: vi.fn(),
    withTx: vi.fn(),
  };
  const withActor = { saveWithAudit };
  service.withActor.mockReturnValue(withActor);
  service.withTx.mockReturnValue(service);
  return { service, saveWithAudit };
}

describe("RevokeInvitationUseCase", () => {
  it("revokes a pending invitation", async () => {
    const invitation = pendingInvitation();
    const invitationRepository = { findById: vi.fn().mockResolvedValue(invitation) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const { service, saveWithAudit } = transactionalService();
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new RevokeInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      service as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
      withTransaction as WithTransactionType,
    );

    const result = await useCase.execute({ invitationId }, userId, organizationId);

    expect(saveWithAudit).toHaveBeenCalledWith(
      expect.objectContaining({ id: invitationId, revokedAt: expect.any(Date) }),
      "Revoke invitation",
    );
    expect(result.revokedAt).not.toBeNull();
  });

  it("returns the invitation when it is already revoked", async () => {
    const invitation = pendingInvitation().revoke(revokedAt);
    const invitationRepository = { findById: vi.fn().mockResolvedValue(invitation) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const { service, saveWithAudit } = transactionalService();
    const useCase = new RevokeInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      service as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
      vi.fn() as WithTransactionType,
    );

    const result = await useCase.execute({ invitationId }, userId, organizationId);

    expect(saveWithAudit).not.toHaveBeenCalled();
    expect(result.revokedAt).toBe(revokedAt.toISOString());
  });

  it("rejects unknown invitations", async () => {
    const invitationRepository = { findById: vi.fn().mockResolvedValue(null) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const useCase = new RevokeInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      { withTx: vi.fn(), withActor: vi.fn() } as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
      vi.fn() as WithTransactionType,
    );

    await expect(useCase.execute({ invitationId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVITATION_NOT_FOUND,
    });
  });
});
