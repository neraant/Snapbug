import { SendInvitationsUseCase } from "@workspace/server/modules/invitation/application/send-invitation.use-case";
import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import type { OrganizationPort } from "@workspace/server/modules/invitation/port/organization.port";
import type { UserPort } from "@workspace/server/modules/invitation/port/user.port";
import type { InvitationService } from "@workspace/server/modules/invitation/service/invitation.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { createHash } from "crypto";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

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

let tokenCounter = 0;

function invitationService(saveWithAudit = vi.fn().mockResolvedValue(undefined)) {
  const service = {
    saveWithAudit,
    hashToken,
    buildInvitationToken: vi.fn(() => `c${String(++tokenCounter).padStart(63, "0")}`),
    inviteUrl: vi.fn((token: string) => `http://localhost:3000/invite/${token}`),
    withActor: vi.fn(),
    withTx: vi.fn(),
  };
  service.withActor.mockReturnValue(service);
  service.withTx.mockReturnValue(service);
  return service;
}

function invitationRepositoryMock() {
  return { findByOrganizationAndEmail: vi.fn().mockResolvedValue(null) };
}

function userPortMock(overrides: Record<string, unknown> = {}) {
  return {
    findByEmail: vi.fn().mockResolvedValue(null),
    findById: vi.fn().mockResolvedValue({ id: userId, email: inviterEmail, name: "Inviter" }),
    ...overrides,
  };
}

function organizationPort(found = true): OrganizationPort {
  return { findById: vi.fn().mockResolvedValue(found ? organization : null) };
}

function emailMarkup(react: ReactElement): string {
  return renderToStaticMarkup(react).replaceAll("&#x27;", "'");
}

describe("SendInvitationsUseCase", () => {
  beforeEach(() => {
    tokenCounter = 0;
  });

  it("throws when the inviter is not in the organization", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue(null),
    };
    const useCase = new SendInvitationsUseCase(
      invitationService() as unknown as InvitationService,
      invitationRepositoryMock() as never,
      membershipPort as unknown as MembershipPort,
      userPortMock() as unknown as UserPort,
      organizationPort(),
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
      invitationRepositoryMock() as never,
      membershipPort as unknown as MembershipPort,
      userPortMock() as unknown as UserPort,
      organizationPort(),
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
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const userPort = userPortMock();
    const invitations = invitationService();
    const emailService = { send: vi.fn().mockResolvedValue(undefined) };
    const useCase = new SendInvitationsUseCase(
      invitations as unknown as InvitationService,
      invitationRepositoryMock() as never,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      organizationPort(),
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
    expect(invitations.buildInvitationToken).toHaveBeenCalledTimes(2);
  });

  it("sends an email for each invitee after skipping existing members", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn(async ({ userId: memberUserId }) => {
        if (memberUserId === "member-user-id") {
          return { role: UserRole.USER };
        }
        return { role: UserRole.ADMIN };
      }),
    };
    const userPort = userPortMock({
      findByEmail: vi.fn(async (email: string) => {
        if (email === "member@company.com") {
          return { id: "member-user-id", email, name: "Member" };
        }
        return null;
      }),
    });
    const invitations = invitationService();
    const emailService = { send: vi.fn().mockResolvedValue(undefined) };
    const organizations = organizationPort();
    const useCase = new SendInvitationsUseCase(
      invitations as unknown as InvitationService,
      invitationRepositoryMock() as never,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      organizations,
      emailService as unknown as EmailService,
      withTransaction as unknown as WithTransactionType,
    );

    const summary = await useCase.execute(
      {
        organizationId,
        emails: ["new@company.com", "member@company.com", "another@company.com"],
      },
      userId,
      inviterEmail,
    );

    expect(summary).toEqual({ sent: 2, skipped: 1, skippedAlreadyMember: 1, resent: 0 });
    expect(invitations.saveWithAudit).toHaveBeenCalledTimes(2);
    expect(emailService.send).toHaveBeenCalledTimes(2);
    expect(organizations.findById).toHaveBeenCalledOnce();

    const saved = invitations.saveWithAudit.mock.calls[0]?.[0];
    const firstToken = invitations.buildInvitationToken.mock.results[0]?.value as string;
    expect(saved.tokenHash).toBe(hashToken(firstToken));
    expect(saved.tokenVersion).toBe(1);
    expect(saved.tokenHash).not.toBe(firstToken);

    const sent = emailService.send.mock.calls.find((call) => call[0].to === "new@company.com")?.[0];
    const markup = emailMarkup(sent?.react as ReactElement);
    expect(markup).toContain(`/invite/${firstToken}`);
    expect(markup).toContain("Join Acme");
    expect(markup).toContain("Inviter invited you to join Acme");
    expect(markup).not.toContain("Ada Lovelace");
  });

  it("does not send email when the organization does not exist", async () => {
    const membershipPort = {
      findByUserAndOrganization: vi.fn().mockResolvedValue({ role: UserRole.ADMIN }),
    };
    const emailService = { send: vi.fn() };
    const useCase = new SendInvitationsUseCase(
      invitationService() as unknown as InvitationService,
      invitationRepositoryMock() as never,
      membershipPort as unknown as MembershipPort,
      userPortMock() as unknown as UserPort,
      organizationPort(false),
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
    const membershipPort = {
      findByUserAndOrganization: vi.fn(async ({ userId: memberUserId }: { userId: string }) => {
        if (memberUserId === userId) return { role: UserRole.ADMIN };
        return null;
      }),
    };
    const userPort = userPortMock({
      findByEmail: vi.fn(async (email: string) => {
        if (email === "ada@company.com") {
          return { id: "ada-user-id", email, name: "Ada Lovelace" };
        }
        if (email === "blank@company.com") {
          return { id: "blank-user-id", email, name: "   " };
        }
        return null;
      }),
    });
    const invitations = invitationService();
    const emailService = { send: vi.fn().mockResolvedValue(undefined) };
    const useCase = new SendInvitationsUseCase(
      invitations as unknown as InvitationService,
      invitationRepositoryMock() as never,
      membershipPort as unknown as MembershipPort,
      userPort as unknown as UserPort,
      organizationPort(),
      emailService as unknown as EmailService,
      withTransaction as unknown as WithTransactionType,
    );

    await useCase.execute({ organizationId, emails: ["ada@company.com", "blank@company.com"] }, userId, inviterEmail);

    const named = emailService.send.mock.calls.find((call) => call[0].to === "ada@company.com")?.[0];
    const unnamed = emailService.send.mock.calls.find((call) => call[0].to === "blank@company.com")?.[0];

    expect(emailMarkup(named.react)).toContain("Ada Lovelace, Inviter invited you to join Acme");
    expect(emailMarkup(unnamed.react)).toContain("Inviter invited you to join Acme");
    expect(emailMarkup(unnamed.react)).not.toContain("Ada Lovelace");
  });
});
