import { ResendInvitationUseCase } from "@workspace/server/modules/invitation/application/resend-invitation.use-case";
import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { OrganizationPort } from "@workspace/server/modules/invitation/port/organization.port";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { createHash } from "crypto";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const invitationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const createdAt = new Date("2026-11-15T09:00:00.000Z");
const expiresAt = new Date("2026-11-22T09:00:00.000Z");
const newToken = "rotated-token";

function pendingInvitation(): Invitation {
  return new Invitation({
    id: invitationId,
    organizationId,
    email: "teammate@example.com",
    tokenHash: createHash("sha256").update("old-token").digest("hex"),
    tokenVersion: 1,
    invitedByUserId: userId,
    expiresAt,
    acceptedAt: null,
    revokedAt: null,
    createdAt,
  });
}

function invitationService(saveWithAudit = vi.fn().mockResolvedValue(undefined)) {
  return {
    saveWithAudit,
    hashToken: (token: string) => createHash("sha256").update(token).digest("hex"),
    buildInvitationToken: vi.fn(() => newToken),
    inviteUrl: vi.fn((token: string) => `http://localhost:3000/sign-up?invitation=${token}`),
    withActor: vi.fn(),
    withTx: vi.fn(),
  };
}

describe("ResendInvitationUseCase", () => {
  it("rotates the token, clears revocation, and sends email", async () => {
    const invitation = pendingInvitation();
    const invitationRepository = { findById: vi.fn().mockResolvedValue(invitation) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const organizationPort = {
      findById: vi.fn().mockResolvedValue({ id: organizationId, name: "Acme" }),
    };
    const userPort = {
      findByEmail: vi.fn().mockResolvedValue(null),
      findById: vi.fn().mockResolvedValue({ id: userId, email: "admin@example.com", name: "Admin" }),
    };
    const invitations = invitationService();
    invitations.withActor.mockReturnValue({ saveWithAudit: invitations.saveWithAudit });
    invitations.withTx.mockReturnValue(invitations);
    const emailService = { send: vi.fn().mockResolvedValue(undefined) };
    const withTransaction = vi.fn(async (callback) => await callback({}));
    const useCase = new ResendInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      invitations as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
      organizationPort as unknown as OrganizationPort,
      userPort as unknown as UserPort,
      emailService as unknown as EmailService,
      withTransaction as WithTransactionType,
    );

    const result = await useCase.execute({ invitationId }, userId, organizationId);

    expect(invitations.buildInvitationToken).toHaveBeenCalledWith(invitationId, 2);
    expect(invitations.saveWithAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenVersion: 2,
        tokenHash: createHash("sha256").update(newToken).digest("hex"),
        revokedAt: null,
      }),
      "Resend invitation",
    );
    expect(emailService.send).toHaveBeenCalledOnce();
    expect(result.email).toBe("teammate@example.com");
  });

  it("rejects resending an accepted invitation", async () => {
    const invitation = new Invitation({
      ...pendingInvitation().toObject(),
      acceptedAt: new Date(),
    });
    const invitationRepository = { findById: vi.fn().mockResolvedValue(invitation) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const useCase = new ResendInvitationUseCase(
      invitationRepository as unknown as InvitationRepository,
      invitationService() as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
      { findById: vi.fn() } as unknown as OrganizationPort,
      { findByEmail: vi.fn() } as unknown as UserPort,
      { send: vi.fn() } as unknown as EmailService,
      vi.fn() as WithTransactionType,
    );

    await expect(useCase.execute({ invitationId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_INVITATION_TOKEN,
    });
  });
});
