import { FindInvitationByTokenUseCase } from "@workspace/server/modules/invitation/application/find-invitation-by-token.use-case";
import { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { OrganizationPort } from "@workspace/server/modules/invitation/port/organization.port";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { createHash } from "crypto";
import { describe, expect, it, vi } from "vitest";

const token = "a".repeat(64);

function hashToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

const invitationService = { hashToken } as unknown as InvitationService;

const organizationId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const inviterUserId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const sessionUserId = "9a8c69a1-1ab1-45a8-8497-eae1e506d9d4";

function pendingInvitation(overrides: Partial<ConstructorParameters<typeof Invitation>[0]> = {}): Invitation {
  return new Invitation({
    id: "1a8c69a1-1ab1-45a8-8497-eae1e506d9d4",
    organizationId,
    email: "alice@example.com",
    tokenHash: hashToken(token),
    tokenVersion: 1,
    invitedByUserId: inviterUserId,
    expiresAt: new Date("2099-10-03T09:00:00.000Z"),
    acceptedAt: null,
    revokedAt: null,
    createdAt: new Date("2026-10-03T09:00:00.000Z"),
    ...overrides,
  });
}

function createUseCase(
  overrides: {
    invitation?: Invitation | null;
    organization?: { id: string; name: string } | null;
    inviteeUser?: { id: string; email: string; name: string | null } | null;
    inviterUser?: { id: string; email: string; name: string | null };
    membership?: { id: string } | null;
  } = {},
) {
  const invitationRepository = {
    findByToken: vi
      .fn()
      .mockResolvedValue(overrides.invitation !== undefined ? overrides.invitation : pendingInvitation()),
  };
  const organizationPort = {
    findById: vi.fn().mockResolvedValue(overrides.organization ?? { id: organizationId, name: "Acme" }),
  };
  const userPort = {
    findByEmail: vi.fn().mockResolvedValue(overrides.inviteeUser ?? null),
    findById: vi
      .fn()
      .mockResolvedValue(overrides.inviterUser ?? { id: inviterUserId, email: "inviter@example.com", name: "Morgan" }),
  };
  const membershipPort = {
    findByUserAndOrganization: vi.fn().mockResolvedValue(overrides.membership ?? null),
  };

  const useCase = new FindInvitationByTokenUseCase(
    invitationService,
    invitationRepository as unknown as InvitationRepository,
    organizationPort as unknown as OrganizationPort,
    userPort as unknown as UserPort,
    membershipPort as unknown as MembershipPort,
  );

  return { useCase, invitationRepository, userPort, membershipPort };
}

describe("FindInvitationByTokenUseCase", () => {
  it("returns invalid for an unknown token", async () => {
    const { useCase } = createUseCase({ invitation: null });

    const result = await useCase.execute({ token });

    expect(result).toEqual({ status: "invalid" });
  });

  it("returns pending invitation details for a new invitee email", async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({ token });

    expect(result).toMatchObject({
      status: "pending",
      email: "alice@example.com",
      organizationName: "Acme",
      inviterName: "Morgan",
      role: UserRole.USER,
      accountExists: false,
      alreadyMember: false,
    });
  });

  it("flags accountExists for an invitee with a user account", async () => {
    const { useCase } = createUseCase({
      inviteeUser: { id: "user-id", email: "alice@example.com", name: "Alice" },
    });

    const result = await useCase.execute({ token });

    expect(result).toMatchObject({
      status: "pending",
      accountExists: true,
    });
  });

  it("flags alreadyMember for a signed-in user who belongs to the organization", async () => {
    const { useCase } = createUseCase({
      membership: { id: "membership-id" },
    });

    const result = await useCase.execute({ token }, { userId: sessionUserId, userEmail: "alice@example.com" });

    expect(result).toMatchObject({
      status: "pending",
      alreadyMember: true,
    });
  });

  it("returns expired details when the invitation is past its expiry", async () => {
    const { useCase } = createUseCase({
      invitation: pendingInvitation({ expiresAt: new Date("2020-01-01T00:00:00.000Z") }),
    });

    const result = await useCase.execute({ token });

    expect(result).toEqual({
      status: "expired",
      organizationName: "Acme",
      inviterName: "Morgan",
    });
  });

  it("returns revoked for a revoked invitation", async () => {
    const { useCase } = createUseCase({
      invitation: pendingInvitation({ revokedAt: new Date("2026-10-03T09:00:00.000Z") }),
    });

    const result = await useCase.execute({ token });

    expect(result).toEqual({ status: "revoked" });
  });

  it("returns accepted for a consumed invitation", async () => {
    const { useCase } = createUseCase({
      invitation: pendingInvitation({ acceptedAt: new Date("2026-10-03T09:00:00.000Z") }),
    });

    const result = await useCase.execute({ token });

    expect(result).toEqual({ status: "accepted" });
  });
});
