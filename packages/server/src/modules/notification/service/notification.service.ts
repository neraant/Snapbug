import type { DbClient } from "@workspace/database";
import { NotificationFactory } from "@workspace/server/modules/notification/entity/notification.factory";
import type { NotificationRepository } from "@workspace/server/modules/notification/repository/notification.repository";
import type { NotificationEmailDispatchService } from "@workspace/server/modules/notification/service/notification-email-dispatch.service";
import type { NotificationPreferenceService } from "@workspace/server/modules/notification/service/notification-preference.service";
import type { NotificationObjectType } from "@workspace/validation/modules/notification/consts/notification-object-type.const";
import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

const GROUPING_WINDOW_MS = 10 * 60 * 1000;
const GROUPABLE_TYPES = new Set<NotificationType>(["comment.created", "ticket.status_changed"]);

export type DeliverNotificationInput = {
  organizationId: string;
  recipientUserId: string;
  type: NotificationType;
  actorUserId: string | null;
  objectType: NotificationObjectType;
  objectId: string;
  projectId: string | null;
  payload: NotificationPayloadType;
};

export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationPreferenceService: NotificationPreferenceService,
    private readonly notificationEmailDispatchService: NotificationEmailDispatchService,
  ) {}

  withTx(tx: DbClient): NotificationService {
    return new NotificationService(
      this.notificationRepository.withTx(tx),
      this.notificationPreferenceService.withTx(tx),
      this.notificationEmailDispatchService,
    );
  }

  async emitSafely(work: () => Promise<void>, context: { type: string }): Promise<void> {
    const ok = await this.notificationRepository.runIsolated(work);
    if (!ok) {
      console.error("[notification] emission failed", { type: context.type });
    }
  }

  async deliverToRecipient(input: DeliverNotificationInput): Promise<void> {
    const resolution = await this.notificationPreferenceService.resolveDelivery({
      userId: input.recipientUserId,
      organizationId: input.organizationId,
      type: input.type,
      projectId: input.projectId,
    });

    const delivered = await this.notificationRepository.runIsolated(async () => {
      if (!resolution.inApp) {
        return;
      }

      if (GROUPABLE_TYPES.has(input.type)) {
        const since = new Date(Date.now() - GROUPING_WINDOW_MS);
        const existing = await this.notificationRepository.findGroupable({
          recipientUserId: input.recipientUserId,
          type: input.type,
          objectType: input.objectType,
          objectId: input.objectId,
          since,
        });

        if (existing) {
          const count = (existing.payload.count ?? 1) + 1;
          const bumped = existing.bumpGrouped(
            {
              ...input.payload,
              count,
            },
            new Date(),
          );
          await this.notificationRepository.save(bumped);
          return;
        }
      }

      const notification = NotificationFactory.create({
        organizationId: input.organizationId,
        recipientUserId: input.recipientUserId,
        type: input.type,
        actorUserId: input.actorUserId,
        objectType: input.objectType,
        objectId: input.objectId,
        projectId: input.projectId,
        payload: input.payload,
      });

      await this.notificationRepository.save(notification);
    });

    if (!delivered) {
      console.error("[notification] delivery failed", {
        type: input.type,
        recipientUserId: input.recipientUserId,
        objectType: input.objectType,
        objectId: input.objectId,
      });
    }

    if (resolution.email) {
      const emailInput = {
        userId: input.recipientUserId,
        organizationId: input.organizationId,
        type: input.type,
        actorUserId: input.actorUserId,
        objectType: input.objectType,
        objectId: input.objectId,
        projectId: input.projectId,
        payload: input.payload,
      };
      setImmediate(() => {
        void this.notificationEmailDispatchService.deliver(emailInput).catch((error) => {
          console.error("[notification-email] dispatch failed", error);
        });
      });
    }
  }

  async deliverBatch(inputs: DeliverNotificationInput[]): Promise<void> {
    for (const input of inputs) {
      await this.deliverToRecipient(input);
    }
  }
}
