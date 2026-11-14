import { FindInvitationByTokenUseCase } from "@workspace/server/modules/invitation/application/find-invitation-by-token.use-case";
import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { OrganizationPort } from "@workspace/server/modules/invitation/port/organization.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { createHash } from "crypto";
import { describe, expect, it, vi } from "vitest";

function hashToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

const invitationService = { hashToken } as unknown as InvitationService;

const token = "valid-token";
const organizationId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const invitation = new Invitation({
  id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  organizationId,
  email: "alice@example.com",
  tokenHash: hashToken(token),
  invitedByUserId: "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
  expiresAt: new Date("2099-10-03T09:00:00.000Z"),
  acceptedAt: null,
  createdAt: new Date("2026-10-03T09:00:00.000Z"),
});

describe("FindInvitationByTokenUseCase", () => {
  it("returns invitation details for a pending token", async () => {
    const invitationRepository = { findByToken: vi.fn().mockResolvedValue(invitation) };
    const organizationPort = {
      findById: vi.fn().mockResolvedValue({ id: organizationId, name: "Acme" }),
    };
    const useCase = new FindInvitationByTokenUseCase(
      invitationService,
      invitationRepository as unknown as InvitationRepository,
      organizationPort as unknown as OrganizationPort,
    );

    const result = await useCase.execute({ token });

    expect(invitationRepository.findByToken).toHaveBeenCalledWith(hashToken(token));
    expect(organizationPort.findById).toHaveBeenCalledWith(organizationId);
    expect(result).toEqual({ email: "alice@example.com", organizationName: "Acme" });
  });

  it("rejects an invalid token before loading its organization", async () => {
    const invitationRepository = { findByToken: vi.fn().mockResolvedValue(null) };
    const organizationPort = { findById: vi.fn() };
    const useCase = new FindInvitationByTokenUseCase(
      invitationService,
      invitationRepository as unknown as InvitationRepository,
      organizationPort as unknown as OrganizationPort,
    );

    await expect(useCase.execute({ token })).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_INVITATION_TOKEN,
    });

    expect(invitationRepository.findByToken).toHaveBeenCalledWith(hashToken(token));
    expect(organizationPort.findById).not.toHaveBeenCalled();
  });

  it("rejects a token whose organization no longer exists", async () => {
    const invitationRepository = { findByToken: vi.fn().mockResolvedValue(invitation) };
    const organizationPort = { findById: vi.fn().mockResolvedValue(null) };
    const useCase = new FindInvitationByTokenUseCase(
      invitationService,
      invitationRepository as unknown as InvitationRepository,
      organizationPort as unknown as OrganizationPort,
    );

    await expect(useCase.execute({ token })).rejects.toMatchObject({
      errorCode: ERROR_CODES.INVALID_INVITATION_TOKEN,
    });
  });
});
