import { groupDigestByProject } from "@workspace/server/modules/notification/email/group-digest.util";
import { NotificationDigestEmailTemplate } from "@workspace/server/modules/notification/email/notification-digest-email-template";
import {
  notificationEmailLanguage,
  notificationEmailSubject,
} from "@workspace/server/modules/notification/email/notification-email-copy.const";
import { NotificationImmediateEmailTemplate } from "@workspace/server/modules/notification/email/notification-immediate-email-template";
import type { NotificationEmailPendingPersistedType } from "@workspace/server/modules/notification/entity/notification-email-pending.types";
import { UserNotificationPreferenceFactory } from "@workspace/server/modules/notification/entity/user-notification-preference.factory";
import type { NotificationUserPort } from "@workspace/server/modules/notification/port/user.port";
import type { NotificationEmailPendingRepository } from "@workspace/server/modules/notification/repository/notification-email-pending.repository";
import type { UserNotificationPreferenceRepository } from "@workspace/server/modules/notification/repository/user-notification-preference.repository";
import type { UserPreferenceRepository } from "@workspace/server/modules/preference/repository/user-preference.repository";
import type { EmailService } from "@workspace/server/shared/email/service/email.service";
import type { NotificationEmailDigest } from "@workspace/validation/modules/notification/consts/notification-email-digest.const";
import type { NotificationObjectType } from "@workspace/validation/modules/notification/consts/notification-object-type.const";
import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";
import { userPreferenceDefaults } from "@workspace/validation/modules/preference/dto/user-preference.model";
import { randomUUID } from "crypto";

export type NotificationEmailDeliveryInput = {
  userId: string;
  organizationId: string;
  type: NotificationType;
  actorUserId: string | null;
  objectType: NotificationObjectType;
  objectId: string;
  projectId: string | null;
  payload: NotificationPayloadType;
};

export class NotificationEmailDispatchService {
  constructor(
    private readonly emailService: EmailService,
    private readonly notificationEmailPendingRepository: NotificationEmailPendingRepository,
    private readonly userNotificationPreferenceRepository: UserNotificationPreferenceRepository,
    private readonly userPreferenceRepository: UserPreferenceRepository,
    private readonly userPort: NotificationUserPort,
  ) {}

  async deliver(input: NotificationEmailDeliveryInput): Promise<void> {
    const preference =
      (await this.userNotificationPreferenceRepository.findByUserId(input.userId)) ??
      UserNotificationPreferenceFactory.create(input.userId);

    if (preference.emailDigest === "immediately") {
      await this.sendImmediate(input);
      return;
    }

    const pending: NotificationEmailPendingPersistedType = {
      id: randomUUID(),
      userId: input.userId,
      organizationId: input.organizationId,
      type: input.type,
      actorUserId: input.actorUserId,
      objectType: input.objectType,
      objectId: input.objectId,
      projectId: input.projectId,
      payload: input.payload,
      createdAt: new Date(),
    };

    await this.notificationEmailPendingRepository.enqueue(pending);
    await this.flushOpportunistic(input.userId);
  }

  async flushOpportunistic(userId: string): Promise<void> {
    const preference =
      (await this.userNotificationPreferenceRepository.findByUserId(userId)) ??
      UserNotificationPreferenceFactory.create(userId);

    if (preference.emailDigest === "immediately") return;

    const now = new Date();
    if (
      !this.shouldFlushDigest(
        preference.emailDigest,
        preference.emailDigestSentAt,
        now,
        await this.resolveTimeZone(userId),
      )
    ) {
      return;
    }

    const pending = await this.notificationEmailPendingRepository.findByUserId(userId);
    if (pending.length === 0) return;

    await this.sendDigest(userId, pending);
    await this.notificationEmailPendingRepository.deleteByIds(pending.map((item) => item.id));
    await this.userNotificationPreferenceRepository.save(preference.update({ emailDigestSentAt: now }));
  }

  private async sendImmediate(input: NotificationEmailDeliveryInput): Promise<void> {
    const users = await this.userPort.findManyByIds([input.userId]);
    const user = users[0];
    if (!user) return;

    await this.emailService.send({
      to: user.email,
      subject: notificationEmailSubject(input.type, input.payload, user.interfaceLanguage),
      react: NotificationImmediateEmailTemplate({
        type: input.type,
        objectType: input.objectType,
        payload: input.payload,
        language: user.interfaceLanguage,
      }),
    });
  }

  private async sendDigest(userId: string, pending: NotificationEmailPendingPersistedType[]): Promise<void> {
    const users = await this.userPort.findManyByIds([userId]);
    const user = users[0];
    if (!user) return;

    const groups = groupDigestByProject(pending, user.interfaceLanguage);
    const count = pending.length;
    const texts = notificationEmailLanguage(user.interfaceLanguage);

    await this.emailService.send({
      to: user.email,
      subject:
        count === 1
          ? notificationEmailSubject(pending[0]!.type, pending[0]!.payload, user.interfaceLanguage)
          : texts.digestTitle,
      react: NotificationDigestEmailTemplate({
        groups,
        language: user.interfaceLanguage,
      }),
    });
  }

  private async resolveTimeZone(userId: string): Promise<string> {
    const preference = await this.userPreferenceRepository.findByUserId(userId);
    return preference?.timeZone ?? userPreferenceDefaults.timeZone;
  }

  private shouldFlushDigest(
    digest: NotificationEmailDigest,
    lastSent: Date | null,
    now: Date,
    timeZone: string,
  ): boolean {
    if (digest === "hourly") {
      if (!lastSent) return true;
      return now.getTime() - lastSent.getTime() >= 60 * 60 * 1000;
    }

    const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hour12: false }).format(now));
    if (hour < 9) return false;
    if (!lastSent) return true;

    const dayFormatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return dayFormatter.format(now) !== dayFormatter.format(lastSent);
  }
}
