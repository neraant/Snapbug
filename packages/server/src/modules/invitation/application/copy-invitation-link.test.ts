import { CopyInvitationLinkUseCase } from "@workspace/server/modules/invitation/application/copy-invitation-link.use-case";
import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { createHash } from "crypto";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const invitationId = "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const token = "versioned-token";

function versionedInvitation(): Invitation {
  return new Invitation({
    id: invitationId,
    organizationId,
    email: "teammate@example.com",
    tokenHash: createHash("sha256").update(token).digest("hex"),
    tokenVersion: 1,
    invitedByUserId: userId,
    expiresAt: new Date("2099-11-22T09:00:00.000Z"),
    acceptedAt: null,
    revokedAt: null,
    createdAt: new Date("2026-11-15T09:00:00.000Z"),
  });
}

function invitationService() {
  return {
    buildInvitationToken: vi.fn(() => token),
    hashToken: (value: string) => createHash("sha256").update(value).digest("hex"),
    inviteUrl: vi.fn((value: string) => `http://localhost:3000/sign-up?invitation=${value}`),
  };
}

describe("CopyInvitationLinkUseCase", () => {
  it("returns the current invite URL for a versioned token", async () => {
    const invitation = versionedInvitation();
    const invitationRepository = { findById: vi.fn().mockResolvedValue(invitation) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const invitations = invitationService();
    const useCase = new CopyInvitationLinkUseCase(
      invitationRepository as unknown as InvitationRepository,
      invitations as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
    );

    const result = await useCase.execute({ invitationId }, userId, organizationId);

    expect(result.inviteUrl).toBe(`http://localhost:3000/sign-up?invitation=${token}`);
  });

  it("rejects legacy invitations whose hash does not match a versioned token", async () => {
    const invitation = new Invitation({
      ...versionedInvitation().toObject(),
      tokenHash: createHash("sha256").update("legacy-uuid-token").digest("hex"),
    });
    const invitationRepository = { findById: vi.fn().mockResolvedValue(invitation) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const useCase = new CopyInvitationLinkUseCase(
      invitationRepository as unknown as InvitationRepository,
      invitationService() as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
    );

    await expect(useCase.execute({ invitationId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_INVITATION_TOKEN,
    });
  });

  it("rejects revoked invitations", async () => {
    const invitation = versionedInvitation().revoke();
    const invitationRepository = { findById: vi.fn().mockResolvedValue(invitation) };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const useCase = new CopyInvitationLinkUseCase(
      invitationRepository as unknown as InvitationRepository,
      invitationService() as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
    );

    await expect(useCase.execute({ invitationId }, userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_INVITATION_TOKEN,
    });
  });
});