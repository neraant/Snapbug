import { SendInvitationsUseCase } from "@workspace/server/modules/invitation/application/send-invitation.use-case";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { OrganizationPort } from "@workspace/server/modules/invitation/port/organization.port";
import type { TokenPort } from "@workspace/server/modules/invitation/port/token.port";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const userId = "0a8c69a1-1ab1-45a8-8497-eae1e506d9d4";
const organizationId = "2a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const inviterEmail = "inviter@company.com";

const organization = {
  id: organizationId,
  name: "Acme",
  reports_retention_days: 30,
  createdAt: "2026-10-03T09:00:00.000Z",
};

const withTransaction = vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => await callback({}));

function invitationService(saveWithAudit = vi.fn().mockResolvedValue(undefined)) {
  const service = {
    saveWithAudit,
    withActor: vi.fn(),
    withTx: vi.fn(),
  };
  service.withActor.mockReturnValue(service);
  service.withTx.mockReturnValue(service);
  return service;
}

function organizationPort(found = true): OrganizationPort {
  return { findById: vi.fn().mockResolvedValue(found ? organization : null) };
}

function emailMarkup(react: ReactElement): string {
  return renderToStaticMarkup(react).replaceAll("&#x27;", "'");
}

describe("SendInvitationsUseCase", () => {
  it("throws when the inviter is not in the organization", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
    };
    const useCase = new SendInvitationsUseCase(
      invitationService() as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
      { findByEmail: vi.fn() } as unknown as UserPort,
      organizationPort(),
      { generatePasswordResetToken: vi.fn() } as unknown as TokenPort,
      { send: vi.fn() } as unknown as EmailService,
      withTransaction as unknown as WithTransactionType,
    );

    await expect(
      useCase.execute({ organizationId, emails: ["peer@company.com"] }, userId, inviterEmail),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });
  });

  it("does not send an invitation when the inviter is not an administrator", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.USER }),
    };
    const invitations = invitationService();
    const emailService = { send: vi.fn() };
    const useCase = new SendInvitationsUseCase(
      invitations as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
      { findByEmail: vi.fn() } as unknown as UserPort,
      organizationPort(),
      { generatePasswordResetToken: vi.fn() } as unknown as TokenPort,
      emailService as unknown as EmailService,
      withTransaction as unknown as WithTransactionType,
    );

    await expect(
      useCase.execute({ organizationId, emails: ["peer@company.com"] }, userId, inviterEmail),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.ADMIN_REQUIRED,
    });

    expect(invitations.saveWithAudit).not.toHaveBeenCalled();
    expect(emailService.send).not.toHaveBeenCalled();
  });

  it("dedupes emails and skips the inviter", async () => {
    const token = "550e8400-e29b-41d4-a716-446655440000";
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const userPort = { findByEmail: vi.fn().mockResolvedValue(null) };
    const invitations = invitationService();
    const authService = { generatePasswordResetToken: vi.fn().mockResolvedValue(token) };
    const emailService = { send: vi.fn().mockResolvedValue(undefined) };
    const useCase = new SendInvitationsUseCase(
      invitations as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      organizationPort(),
      authService as unknown as TokenPort,
      emailService as unknown as EmailService,
      withTransaction as unknown as WithTransactionType,
    );

    await useCase.execute(
      {
        organizationId,
        emails: ["peer@company.com", "PEER@company.com", inviterEmail, "other@company.com"],
      },
      userId,
      inviterEmail,
    );

    expect(invitations.saveWithAudit).toHaveBeenCalledTimes(2);
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
    const invitations = invitationService();
    const authService = {
      generatePasswordResetToken: vi
        .fn()
        .mockResolvedValueOnce(tokens[0])
        .mockResolvedValueOnce(tokens[1])
        .mockResolvedValueOnce(tokens[2]),
    };
    const emailService = { send: vi.fn().mockResolvedValue(undefined) };
    const organizations = organizationPort();
    const useCase = new SendInvitationsUseCase(
      invitations as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      organizations,
      authService as unknown as TokenPort,
      emailService as unknown as EmailService,
      withTransaction as unknown as WithTransactionType,
    );

    await useCase.execute(
      {
        organizationId,
        emails: ["new@company.com", "member@company.com", "another@company.com"],
      },
      userId,
      inviterEmail,
    );

    expect(invitations.saveWithAudit).toHaveBeenCalledTimes(2);
    expect(emailService.send).toHaveBeenCalledTimes(2);
    expect(organizations.findById).toHaveBeenCalledOnce();
    expect(emailService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "new@company.com",
        subject: "You're invited to join Acme on Snapbug",
      }),
    );

    const sent = emailService.send.mock.calls.find((call) => call[0].to === "new@company.com")?.[0];
    const markup = emailMarkup(sent?.react as ReactElement);
    expect(markup).toContain("Join Acme");
    expect(markup).toContain("You're invited to join Acme");
    expect(markup).not.toContain("Ada Lovelace");
  });

  it("does not send email when the organization does not exist", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const emailService = { send: vi.fn() };
    const useCase = new SendInvitationsUseCase(
      invitationService() as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
      { findByEmail: vi.fn() } as unknown as UserPort,
      organizationPort(false),
      { generatePasswordResetToken: vi.fn() } as unknown as TokenPort,
      emailService as unknown as EmailService,
      withTransaction as unknown as WithTransactionType,
    );

    await expect(
      useCase.execute({ organizationId, emails: ["peer@company.com"] }, userId, inviterEmail),
    ).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });

    expect(emailService.send).not.toHaveBeenCalled();
  });

  it("includes the invitee name when that user already has one", async () => {
    const token = "550e8400-e29b-41d4-a716-446655440000";
    const membershipPort = {
      findByUserAndOrganization: vi.fn(async ({ userId: memberUserId }: { userId: string }) => {
        if (memberUserId === userId) return { role: UserRole.ADMIN };
        return null;
      }),
    };
    const userPort = {
      findByEmail: vi.fn(async (email: string) => {
        if (email === "ada@company.com") {
          return { id: "ada-user-id", email, name: "Ada Lovelace" };
        }
        if (email === "blank@company.com") {
          return { id: "blank-user-id", email, name: "   " };
        }
        return null;
      }),
    };
    const invitations = invitationService();
    const authService = {
      generatePasswordResetToken: vi
        .fn()
        .mockResolvedValueOnce(token)
        .mockResolvedValueOnce("6ba7b810-9dad-11d1-80b4-00c04fd430c8"),
    };
    const emailService = { send: vi.fn().mockResolvedValue(undefined) };
    const useCase = new SendInvitationsUseCase(
      invitations as unknown as InvitationService,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      organizationPort(),
      authService as unknown as TokenPort,
      emailService as unknown as EmailService,
      withTransaction as unknown as WithTransactionType,
    );

    await useCase.execute({ organizationId, emails: ["ada@company.com", "blank@company.com"] }, userId, inviterEmail);

    const named = emailService.send.mock.calls.find((call) => call[0].to === "ada@company.com")?.[0];
    const unnamed = emailService.send.mock.calls.find((call) => call[0].to === "blank@company.com")?.[0];

    expect(emailMarkup(named.react)).toContain("Ada Lovelace, you're invited to join Acme");
    expect(emailMarkup(unnamed.react)).toContain("You're invited to join Acme");
    expect(emailMarkup(unnamed.react)).not.toContain("Ada Lovelace");
  });
});
