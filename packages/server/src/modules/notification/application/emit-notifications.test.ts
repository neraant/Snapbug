import { EmitNotificationsUseCase } from "@workspace/server/modules/notification/application/emit-notifications.use-case";
import { NotificationFactory } from "@workspace/server/modules/notification/entity/notification.factory";
import type { NotificationCommentPort } from "@workspace/server/modules/notification/port/comment.port";
import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";
import type { NotificationUserPort } from "@workspace/server/modules/notification/port/user.port";
import type { NotificationRepository } from "@workspace/server/modules/notification/repository/notification.repository";
import { NotificationService } from "@workspace/server/modules/notification/service/notification.service";
import type { NotificationEmailDispatchService } from "@workspace/server/modules/notification/service/notification-email-dispatch.service";
import type { NotificationPreferenceService } from "@workspace/server/modules/notification/service/notification-preference.service";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const projectId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const actorUserId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const assigneeUserId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const adminUserId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const memberId = "11111111-1111-4111-8111-111111111111";
const participantUserId = "22222222-2222-4222-8222-222222222222";
const ticketId = "ffffffff-ffff-4fff-8fff-ffffffffffff";
const tokenOwnerId = "33333333-3333-4333-8333-333333333333";
const inviterUserId = "44444444-4444-4444-8444-444444444444";
const invitationId = "55555555-5555-4555-8555-555555555555";

function createHarness(deliverBatch = vi.fn().mockResolvedValue(undefined)) {
  const notificationService = {
    deliverBatch,
    withTx: vi.fn(),
    emitSafely: vi.fn(async (work: () => Promise<void>, context: { type: string }) => {
      try {
        await work();
      } catch {
        console.error("[notification] emission failed", { type: context.type });
      }
    }),
  } as unknown as NotificationService;
  notificationService.withTx = vi.fn().mockReturnValue(notificationService);

  const membershipPort: NotificationMembershipPort = {
    findManyByOrganizationId: vi.fn().mockResolvedValue([
      { id: memberId, userId: assigneeUserId, organizationId, role: UserRole.USER },
      { id: "admin-membership", userId: adminUserId, organizationId, role: UserRole.ADMIN },
      { id: "participant-membership", userId: participantUserId, organizationId, role: UserRole.USER },
    ]),
    filterProjectIds: vi.fn(async (_membership, projectIds: string[]) => projectIds),
  };

  const commentPort: NotificationCommentPort = {
    findAuthorUserIdsByBugReportId: vi.fn().mockResolvedValue([participantUserId]),
  };

  const userPort: NotificationUserPort = {
    findManyByIds: vi.fn().mockResolvedValue([]),
  };

  const useCase = new EmitNotificationsUseCase(
    membershipPort,
    { findById: vi.fn(), findManyByOrganizationId: vi.fn() },
    { findById: vi.fn() },
    commentPort,
    userPort,
    notificationService,
  );

  return { useCase, deliverBatch, membershipPort, commentPort, userPort, notificationService };
}

describe("EmitNotificationsUseCase", () => {
  it("does not notify the actor on ticket assignment", async () => {
    const deliverBatch = vi.fn().mockResolvedValue(undefined);
    const { useCase, membershipPort } = createHarness(deliverBatch);
    membershipPort.findManyByOrganizationId = vi.fn().mockResolvedValue([
      { id: "actor-membership", userId: actorUserId, organizationId, role: UserRole.USER },
      { id: memberId, userId: assigneeUserId, organizationId, role: UserRole.USER },
    ]);

    await useCase.ticketAssigned({
      organizationId,
      actorUserId,
      projectId,
      ticketId,
      assigneeUserId: actorUserId,
      payload: { ticketShortId: "SB-1", ticketTitle: "Bug" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([]);
  });

  it("does not notify the actor on ticket creation when they are the default assignee", async () => {
    const deliverBatch = vi.fn().mockResolvedValue(undefined);
    const { useCase, membershipPort } = createHarness(deliverBatch);
    membershipPort.findManyByOrganizationId = vi
      .fn()
      .mockResolvedValue([{ id: "actor-membership", userId: actorUserId, organizationId, role: UserRole.USER }]);

    await useCase.ticketCreated({
      organizationId,
      actorUserId,
      projectId,
      ticketId,
      defaultAssigneeId: actorUserId,
      payload: { ticketShortId: "SB-1b", ticketTitle: "Self assigned" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([]);
  });

  it("swallows recipient lookup failures without rethrowing", async () => {
    const deliverBatch = vi.fn().mockResolvedValue(undefined);
    const { useCase, membershipPort } = createHarness(deliverBatch);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    membershipPort.findManyByOrganizationId = vi.fn().mockRejectedValue(new Error("lookup failed"));

    await expect(
      useCase.ticketAssigned({
        organizationId,
        actorUserId,
        projectId,
        ticketId,
        assigneeUserId,
        payload: { ticketShortId: "SB-1c", ticketTitle: "Bug" },
      }),
    ).resolves.toBeUndefined();

    expect(deliverBatch).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith("[notification] emission failed", { type: "ticket.assigned" });
    errorSpy.mockRestore();
  });

  it("notifies the assignee for ticket assignment", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.ticketAssigned({
      organizationId,
      actorUserId,
      projectId,
      ticketId,
      assigneeUserId,
      payload: { ticketShortId: "SB-1", ticketTitle: "Bug" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([
      expect.objectContaining({
        recipientUserId: assigneeUserId,
        type: "ticket.assigned",
      }),
    ]);
  });

  it("notifies admins when a ticket is created without a default assignee", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.ticketCreated({
      organizationId,
      actorUserId: null,
      projectId,
      ticketId,
      defaultAssigneeId: null,
      payload: { ticketShortId: "SB-2", ticketTitle: "New report" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([
      expect.objectContaining({
        recipientUserId: adminUserId,
        type: "ticket.created",
      }),
    ]);
  });

  it("notifies the default assignee when a ticket is created", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.ticketCreated({
      organizationId,
      actorUserId: null,
      projectId,
      ticketId,
      defaultAssigneeId: assigneeUserId,
      payload: { ticketShortId: "SB-2a", ticketTitle: "New report" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([
      expect.objectContaining({
        recipientUserId: assigneeUserId,
        type: "ticket.created",
      }),
    ]);
    expect(deliverBatch.mock.calls[0]?.[0]).toHaveLength(1);
  });

  it("drops recipients without project access", async () => {
    const deliverBatch = vi.fn().mockResolvedValue(undefined);
    const { useCase, membershipPort } = createHarness(deliverBatch);
    membershipPort.filterProjectIds = vi.fn().mockResolvedValue([]);

    await useCase.ticketAssigned({
      organizationId,
      actorUserId,
      projectId,
      ticketId,
      assigneeUserId,
      payload: { ticketShortId: "SB-3", ticketTitle: "Bug" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([]);
  });

  it("deduplicates duplicate recipient ids", async () => {
    const { useCase, deliverBatch, commentPort } = createHarness();
    commentPort.findAuthorUserIdsByBugReportId = vi.fn().mockResolvedValue([assigneeUserId, assigneeUserId]);

    await useCase.commentCreated({
      organizationId,
      actorUserId,
      projectId,
      ticketId,
      assigneeUserId,
      payload: { ticketShortId: "SB-4", ticketTitle: "Thread" },
    });

    const deliveries = deliverBatch.mock.calls[0]?.[0] as { recipientUserId: string }[];
    expect(deliveries).toHaveLength(1);
    expect(deliveries[0]?.recipientUserId).toBe(assigneeUserId);
  });

  it("notifies assignee and thread participants on new comments, not the author", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.commentCreated({
      organizationId,
      actorUserId,
      projectId,
      ticketId,
      assigneeUserId,
      payload: { ticketShortId: "SB-5", ticketTitle: "Thread" },
    });

    expect(deliverBatch).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ recipientUserId: assigneeUserId, type: "comment.created" }),
        expect.objectContaining({ recipientUserId: participantUserId, type: "comment.created" }),
      ]),
    );
    const deliveries = deliverBatch.mock.calls[0]?.[0] as { recipientUserId: string }[];
    expect(deliveries.some((item) => item.recipientUserId === actorUserId)).toBe(false);
  });

  it("notifies the assignee on ticket status change without the actor", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.ticketStatusChanged({
      organizationId,
      actorUserId,
      projectId,
      ticketId,
      assigneeUserId,
      reporterEmail: null,
      payload: { ticketShortId: "SB-7", ticketTitle: "Status", oldValue: "new", newValue: "in_progress" },
    });

    expect(deliverBatch).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ recipientUserId: assigneeUserId, type: "ticket.status_changed" }),
      ]),
    );
    const deliveries = deliverBatch.mock.calls[0]?.[0] as { recipientUserId: string }[];
    expect(deliveries.some((item) => item.recipientUserId === actorUserId)).toBe(false);
  });

  it("notifies thread participants on ticket status change", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.ticketStatusChanged({
      organizationId,
      actorUserId,
      projectId,
      ticketId,
      assigneeUserId: null,
      reporterEmail: null,
      payload: { ticketShortId: "SB-7a", ticketTitle: "Status", oldValue: "new", newValue: "fixed" },
    });

    expect(deliverBatch).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ recipientUserId: participantUserId, type: "ticket.status_changed" }),
      ]),
    );
  });

  it("notifies the affected member on project access grant without the actor", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.projectAccessGranted({
      organizationId,
      actorUserId: adminUserId,
      membershipId: memberId,
      affectedUserId: assigneeUserId,
      projectId,
      payload: { projectName: "App" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([
      expect.objectContaining({
        recipientUserId: assigneeUserId,
        type: "project.access_granted",
      }),
    ]);
  });

  it("does not notify the actor on project access grant", async () => {
    const deliverBatch = vi.fn().mockResolvedValue(undefined);
    const { useCase } = createHarness(deliverBatch);

    await useCase.projectAccessGranted({
      organizationId,
      actorUserId: assigneeUserId,
      membershipId: memberId,
      affectedUserId: assigneeUserId,
      projectId,
      payload: { projectName: "App" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([]);
  });

  it("notifies the affected member on project access revoke without the actor", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.projectAccessRevoked({
      organizationId,
      actorUserId: adminUserId,
      membershipId: memberId,
      affectedUserId: assigneeUserId,
      projectId,
      payload: { projectName: "App" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([
      expect.objectContaining({
        recipientUserId: assigneeUserId,
        type: "project.access_revoked",
      }),
    ]);
  });

  it("notifies the inviter and admins on invitation accepted without the new member", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.invitationAccepted({
      organizationId,
      actorUserId: assigneeUserId,
      invitationId,
      inviterUserId,
      payload: { memberName: "New member" },
    });

    expect(deliverBatch).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ recipientUserId: inviterUserId, type: "invitation.accepted" }),
        expect.objectContaining({ recipientUserId: adminUserId, type: "invitation.accepted" }),
      ]),
    );
    const deliveries = deliverBatch.mock.calls[0]?.[0] as { recipientUserId: string }[];
    expect(deliveries.some((item) => item.recipientUserId === assigneeUserId)).toBe(false);
  });

  it("notifies members with project access on project archive without the actor", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.projectArchived({
      organizationId,
      actorUserId: adminUserId,
      projectId,
      restored: false,
      payload: { projectName: "App", projectSlug: "app" },
    });

    expect(deliverBatch).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ recipientUserId: assigneeUserId, type: "project.archived" }),
        expect.objectContaining({ recipientUserId: participantUserId, type: "project.archived" }),
      ]),
    );
    const deliveries = deliverBatch.mock.calls[0]?.[0] as { recipientUserId: string }[];
    expect(deliveries.some((item) => item.recipientUserId === adminUserId)).toBe(false);
  });

  it("notifies the affected member on role change without the actor", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.membershipRoleChanged({
      organizationId,
      actorUserId: adminUserId,
      membershipId: memberId,
      affectedUserId: assigneeUserId,
      payload: { oldValue: UserRole.ADMIN, newValue: UserRole.USER },
    });

    expect(deliverBatch).toHaveBeenCalledWith([
      expect.objectContaining({
        recipientUserId: assigneeUserId,
        type: "membership.role_changed",
      }),
    ]);
  });

  it("notifies admins on api key rotation", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.apiKeyRotated({
      organizationId,
      actorUserId: adminUserId,
      projectId,
      apiKeyId: "88888888-8888-4888-8888-888888888888",
      payload: { projectName: "App" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([]);
  });

  it("notifies admins other than the actor on api key rotation", async () => {
    const deliverBatch = vi.fn().mockResolvedValue(undefined);
    const { useCase, membershipPort } = createHarness(deliverBatch);
    membershipPort.findManyByOrganizationId = vi.fn().mockResolvedValue([
      { id: "admin-1", userId: adminUserId, organizationId, role: UserRole.ADMIN },
      { id: "admin-2", userId: actorUserId, organizationId, role: UserRole.ADMIN },
    ]);

    await useCase.apiKeyRotated({
      organizationId,
      actorUserId: adminUserId,
      projectId,
      apiKeyId: "88888888-8888-4888-8888-888888888888",
      payload: { projectName: "App" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([
      expect.objectContaining({
        recipientUserId: actorUserId,
        type: "security.api_key_rotated",
      }),
    ]);
  });

  it("always notifies the token owner for security.token_created", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.tokenCreated({
      organizationId,
      actorUserId: tokenOwnerId,
      tokenId: "99999999-9999-4999-9999-999999999999",
      ownerUserId: tokenOwnerId,
      payload: { tokenName: "CI" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([
      expect.objectContaining({
        recipientUserId: tokenOwnerId,
        type: "security.token_created",
      }),
    ]);
  });

  it("groups comment notifications within the grouping window", async () => {
    const existing = NotificationFactory.create({
      organizationId,
      recipientUserId: assigneeUserId,
      type: "comment.created",
      actorUserId,
      objectType: "bug-report",
      objectId: ticketId,
      projectId,
      payload: { ticketShortId: "SB-6", count: 1 },
      createdAt: new Date(),
    });

    const save = vi.fn().mockResolvedValue(undefined);
    const findGroupable = vi.fn().mockResolvedValue(existing);
    const runIsolated = vi.fn(async (callback: () => Promise<void>) => {
      await callback();
      return true;
    });
    const notificationRepository = {
      save,
      findGroupable,
      runIsolated,
      withTx: vi.fn(),
    } as unknown as NotificationRepository;
    notificationRepository.withTx = vi.fn().mockReturnValue(notificationRepository);

    const notificationPreferenceService = {
      resolveDelivery: vi.fn().mockResolvedValue({ inApp: true, email: false }),
      withTx: vi.fn(),
    } as unknown as NotificationPreferenceService;
    notificationPreferenceService.withTx = vi.fn().mockReturnValue(notificationPreferenceService);

    const notificationEmailDispatchService = {
      deliver: vi.fn().mockResolvedValue(undefined),
    } as unknown as NotificationEmailDispatchService;

    const notificationService = new NotificationService(
      notificationRepository,
      notificationPreferenceService,
      notificationEmailDispatchService,
    );
    const membershipPort: NotificationMembershipPort = {
      findManyByOrganizationId: vi
        .fn()
        .mockResolvedValue([{ id: memberId, userId: assigneeUserId, organizationId, role: UserRole.USER }]),
      filterProjectIds: vi.fn(async (_membership, projectIds: string[]) => projectIds),
    };

    const useCase = new EmitNotificationsUseCase(
      membershipPort,
      { findById: vi.fn(), findManyByOrganizationId: vi.fn() },
      { findById: vi.fn() },
      { findAuthorUserIdsByBugReportId: vi.fn().mockResolvedValue([]) },
      { findManyByIds: vi.fn().mockResolvedValue([]) },
      notificationService,
    );

    await useCase.commentCreated({
      organizationId,
      actorUserId,
      projectId,
      ticketId,
      assigneeUserId,
      payload: { ticketShortId: "SB-6", ticketTitle: "Grouped" },
    });

    expect(findGroupable).toHaveBeenCalled();
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ payload: expect.objectContaining({ count: 2 }) }));
    expect(save).toHaveBeenCalledTimes(1);
  });
});
