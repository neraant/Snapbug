import { MarkReadUseCase } from "@workspace/server/modules/notification/application/mark-read.use-case";
import { NotificationFactory } from "@workspace/server/modules/notification/entity/notification.factory";
import type { NotificationRepository } from "@workspace/server/modules/notification/repository/notification.repository";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { describe, expect, it, vi } from "vitest";

const organizationId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const userId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const otherUserId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

describe("MarkReadUseCase", () => {
  it("does not mark another user's notification", async () => {
    const save = vi.fn();
    const notification = NotificationFactory.create({
      organizationId,
      recipientUserId: otherUserId,
      type: "ticket.created",
      actorUserId: null,
      objectType: "bug-report",
      objectId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      projectId: null,
      payload: {},
    });

    const notificationRepository = {
      findManyByIdsForRecipient: vi.fn().mockResolvedValue([]),
      withTx: vi.fn().mockReturnValue({ save }),
    } as unknown as NotificationRepository;
    const withTransaction = vi.fn(async (callback) => await callback({})) as unknown as WithTransactionType;

    const useCase = new MarkReadUseCase(notificationRepository, withTransaction);
    const result = await useCase.execute({ ids: [notification.id] }, userId, organizationId);

    expect(result.updated).toBe(0);
    expect(save).not.toHaveBeenCalled();
  });

  it("marks the caller notification as read", async () => {
    const save = vi.fn();
    const notification = NotificationFactory.create({
      organizationId,
      recipientUserId: userId,
      type: "ticket.created",
      actorUserId: null,
      objectType: "bug-report",
      objectId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      projectId: null,
      payload: {},
    });

    const notificationRepository = {
      findManyByIdsForRecipient: vi.fn().mockResolvedValue([notification]),
      withTx: vi.fn().mockReturnValue({ save }),
    } as unknown as NotificationRepository;
    const withTransaction = vi.fn(async (callback) => await callback({})) as unknown as WithTransactionType;

    const useCase = new MarkReadUseCase(notificationRepository, withTransaction);
    const result = await useCase.execute({ ids: [notification.id] }, userId, organizationId);

    expect(result.updated).toBe(1);
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ readAt: expect.any(Date) }));
  });
});