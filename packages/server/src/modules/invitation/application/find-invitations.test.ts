import { FindInvitationsUseCase } from "@workspace/server/modules/invitation/application/find-invitations.use-case";
import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { createHash } from "crypto";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const createdAt = new Date("2026-11-15T09:00:00.000Z");
const expiresAt = new Date("2026-11-22T09:00:00.000Z");

function pendingInvitation(): Invitation {
  return new Invitation({
    id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
    organizationId,
    email: "teammate@example.com",
    tokenHash: createHash("sha256").update("token").digest("hex"),
    tokenVersion: 1,
    invitedByUserId: userId,
    expiresAt,
    acceptedAt: null,
    revokedAt: null,
    createdAt,
  });
}

describe("FindInvitationsUseCase", () => {
  it("returns pending invitations for an administrator", async () => {
    const invitation = pendingInvitation();
    const invitationRepository = {
      findManyPendingByOrganizationId: vi.fn().mockResolvedValue([invitation]),
    };
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const useCase = new FindInvitationsUseCase(
      invitationRepository as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
    );

    const result = await useCase.execute(userId, organizationId);

    expect(invitationRepository.findManyPendingByOrganizationId).toHaveBeenCalledWith(organizationId);
    expect(result).toEqual([
      {
        id: invitation.id,
        email: invitation.email,
        expiresAt: expiresAt.toISOString(),
        createdAt: createdAt.toISOString(),
        revokedAt: null,
      },
    ]);
  });

  it("rejects callers who are not administrators", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.USER }),
    };
    const useCase = new FindInvitationsUseCase(
      { findManyPendingByOrganizationId: vi.fn() } as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
    );

    await expect(useCase.execute(userId, organizationId)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ADMIN_REQUIRED,
    });
  });

  it("rejects callers without an active organization", async () => {
    const useCase = new FindInvitationsUseCase(
      { findManyPendingByOrganizationId: vi.fn() } as unknown as InvitationRepository,
      { findByUserAndOrganization: vi.fn() } as unknown as MembershipPort,
    );

    await expect(useCase.execute(userId, null)).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });
  });
});