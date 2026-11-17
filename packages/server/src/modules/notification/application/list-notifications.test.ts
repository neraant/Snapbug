import { ListNotificationsUseCase } from "@workspace/server/modules/notification/application/list-notifications.use-case";
import { NotificationFactory } from "@workspace/server/modules/notification/entity/notification.factory";
import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";
import type { NotificationRepository } from "@workspace/server/modules/notification/repository/notification.repository";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const userId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const otherUserId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const projectId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const membershipId = "11111111-1111-4111-8111-111111111111";

describe("ListNotificationsUseCase", () => {
  it("returns only notifications for the caller", async () => {
    const notification = NotificationFactory.create({
      organizationId,
      recipientUserId: userId,
      type: "ticket.created",
      actorUserId: null,
      objectType: "bug-report",
      objectId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      projectId,
      payload: { ticketShortId: "SB-1" },
    });

    const membershipPort: NotificationMembershipPort = {
      findManyByOrganizationId: vi
        .fn()
        .mockResolvedValue([{ id: membershipId, userId, organizationId, role: UserRole.USER }]),
      filterProjectIds: vi.fn().mockResolvedValue([projectId]),
    };

    const notificationRepository = {
      findPage: vi.fn().mockResolvedValue([notification]),
    } as unknown as NotificationRepository;

    const useCase = new ListNotificationsUseCase(membershipPort, notificationRepository);
    const result = await useCase.execute(userId, organizationId, {});

    expect(notificationRepository.findPage).toHaveBeenCalledWith(
      expect.objectContaining({ recipientUserId: userId, organizationId }),
    );
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.recipientUserId).toBe(userId);
  });

  it("marks ticket notifications inaccessible when project access is lost", async () => {
    const notification = NotificationFactory.create({
      organizationId,
      recipientUserId: userId,
      type: "ticket.created",
      actorUserId: null,
      objectType: "bug-report",
      objectId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      projectId,
      payload: {},
    });

    const membershipPort: NotificationMembershipPort = {
      findManyByOrganizationId: vi
        .fn()
        .mockResolvedValue([{ id: membershipId, userId, organizationId, role: UserRole.USER }]),
      filterProjectIds: vi.fn().mockResolvedValue([]),
    };

    const notificationRepository = {
      findPage: vi.fn().mockResolvedValue([notification]),
    } as unknown as NotificationRepository;

    const useCase = new ListNotificationsUseCase(membershipPort, notificationRepository);
    const result = await useCase.execute(userId, organizationId, {});

    expect(result.items[0]?.accessible).toBe(false);
  });

  it("rejects a caller outside the organization", async () => {
    const membershipPort: NotificationMembershipPort = {
      findManyByOrganizationId: vi
        .fn()
        .mockResolvedValue([{ id: membershipId, userId: otherUserId, organizationId, role: UserRole.USER }]),
      filterProjectIds: vi.fn(),
    };
    const notificationRepository = { findPage: vi.fn() } as unknown as NotificationRepository;
    const useCase = new ListNotificationsUseCase(membershipPort, notificationRepository);

    await expect(useCase.execute(userId, organizationId, {})).rejects.toMatchObject({
      errorCode: ERROR_CODES.ORGANIZATION_NOT_FOUND,
    });
  });
});
