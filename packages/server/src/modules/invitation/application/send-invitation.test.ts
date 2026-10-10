import type { AuthService } from "@workspace/server/modules/auth/service/auth.service";
import { SendInvitationsUseCase } from "@workspace/server/modules/invitation/application/send-invitation.use-case";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { InvitationRepository } from "@workspace/server/modules/invitation/repository/invitation.repository";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const inviterEmail = "inviter@company.com";

describe("SendInvitationsUseCase", () => {
  it("throws when the inviter is not in the organization", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
    };
    const useCase = new SendInvitationsUseCase(
      { upsertPending: vi.fn() } as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
      { findByEmail: vi.fn() } as unknown as UserPort,
      { generatePasswordResetToken: vi.fn() } as unknown as AuthService,
      { send: vi.fn() } as unknown as EmailService,
    );

    await expect(
      useCase.execute({ organizationId, emails: ["peer@company.com"] }, userId, inviterEmail),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });
  });

  it("dedupes emails and skips the inviter", async () => {
    const token = "550e8400-e29b-41d4-a716-446655440000";
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const userPort = { findByEmail: vi.fn().mockResolvedValue(null) };
    const invitationRepository = { upsertPending: vi.fn().mockResolvedValue(undefined) };
    const authService = { generatePasswordResetToken: vi.fn().mockResolvedValue(token) };
    const emailService = { send: vi.fn().mockResolvedValue(undefined) };
    const useCase = new SendInvitationsUseCase(
      invitationRepository as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      authService as unknown as AuthService,
      emailService as unknown as EmailService,
    );

    await useCase.execute(
      {
        organizationId,
        emails: ["peer@company.com", "PEER@company.com", inviterEmail, "other@company.com"],
      },
      userId,
      inviterEmail,
    );

    expect(invitationRepository.upsertPending).toHaveBeenCalledTimes(2);
    expect(emailService.send).toHaveBeenCalledTimes(2);
    expect(authService.generatePasswordResetToken).toHaveBeenCalledTimes(2);
  });

  it("sends an email for each invitee after skipping existing members", async () => {
    const tokens = [
      "550e8400-e29b-41d4-a716-446655440000",
      "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    ];
    const membershipPort = {
      findByUserAndOrganization: vi.fn(async ({ userId: memberUserId }) => {
        if (memberUserId === "member-user-id") {
          return { role: UserRole.USER };
        }
        return { role: UserRole.ADMIN };
      }),
    };
    const userPort = {
      findByEmail: vi.fn(async (email: string) => {
        if (email === "member@company.com") {
          return { id: "member-user-id", email, name: "Member" };
        }
        return null;
      }),
    };
    const invitationRepository = { upsertPending: vi.fn().mockResolvedValue(undefined) };
    const authService = {
      generatePasswordResetToken: vi
        .fn()
        .mockResolvedValueOnce(tokens[0])
        .mockResolvedValueOnce(tokens[1])
        .mockResolvedValueOnce(tokens[2]),
    };
    const emailService = { send: vi.fn().mockResolvedValue(undefined) };
    const useCase = new SendInvitationsUseCase(
      invitationRepository as unknown as InvitationRepository,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      authService as unknown as AuthService,
      emailService as unknown as EmailService,
    );

    await useCase.execute(
      {
        organizationId,
        emails: ["new@company.com", "member@company.com", "another@company.com"],
      },
      userId,
      inviterEmail,
    );

    expect(invitationRepository.upsertPending).toHaveBeenCalledTimes(2);
    expect(emailService.send).toHaveBeenCalledTimes(2);
    expect(emailService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "new@company.com",
        subject: "You're invited to join a team on Snapbug",
      }),
    );
  });
});
