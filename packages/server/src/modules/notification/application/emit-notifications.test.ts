import { EmitNotificationsUseCase } from "@workspace/server/modules/notification/application/emit-notifications.use-case";
import type { NotificationCommentPort } from "@workspace/server/modules/notification/port/comment.port";
import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";
import type { NotificationUserPort } from "@workspace/server/modules/notification/port/user.port";
import type { NotificationService } from "@workspace/server/modules/notification/service/notification.service";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const projectId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const actorUserId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const assigneeUserId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const adminUserId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const memberId = "11111111-1111-4111-8111-111111111111";

function createHarness(deliverBatch = vi.fn().mockResolvedValue(undefined)) {
  const notificationService = {
    deliverBatch,
    withTx: vi.fn(),
  } as unknown as NotificationService;
  notificationService.withTx = vi.fn().mockReturnValue(notificationService);

  const membershipPort: NotificationMembershipPort = {
    findManyByOrganizationId: vi.fn().mockResolvedValue([
      { id: memberId, userId: assigneeUserId, organizationId, role: UserRole.USER },
      { id: "admin-membership", userId: adminUserId, organizationId, role: UserRole.ADMIN },
    ]),
    filterProjectIds: vi.fn(async (_membership, projectIds: string[]) => projectIds),
  };

  const commentPort: NotificationCommentPort = {
    findAuthorUserIdsByBugReportId: vi.fn().mockResolvedValue([]),
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

  return { useCase, deliverBatch, membershipPort, commentPort };
}

describe("EmitNotificationsUseCase", () => {
  it("does not notify the actor on ticket assignment", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.ticketAssigned({
      organizationId,
      actorUserId,
      projectId,
      ticketId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      assigneeUserId: actorUserId,
      payload: { ticketShortId: "SB-1", ticketTitle: "Bug" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([]);
  });

  it("notifies the assignee for ticket assignment", async () => {
    const { useCase, deliverBatch } = createHarness();

    await useCase.ticketAssigned({
      organizationId,
      actorUserId,
      projectId,
      ticketId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
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
      ticketId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
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

  it("drops recipients without project access", async () => {
    const deliverBatch = vi.fn().mockResolvedValue(undefined);
    const { useCase, membershipPort } = createHarness(deliverBatch);
    membershipPort.filterProjectIds = vi.fn().mockResolvedValue([]);

    await useCase.ticketAssigned({
      organizationId,
      actorUserId,
      projectId,
      ticketId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      assigneeUserId,
      payload: { ticketShortId: "SB-3", ticketTitle: "Bug" },
    });

    expect(deliverBatch).toHaveBeenCalledWith([]);
  });
});
