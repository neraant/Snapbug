import type { DbClient } from "@workspace/database";
import { UserNotificationPreferenceFactory } from "@workspace/server/modules/notification/entity/user-notification-preference.factory";
import { UserNotificationPreferenceMapper } from "@workspace/server/modules/notification/entity/user-notification-preference.mapper";
import type { UserNotificationPreferenceRepository } from "@workspace/server/modules/notification/repository/user-notification-preference.repository";
import type { NotificationEmailDigest } from "@workspace/validation/modules/notification/consts/notification-email-digest.const";
import { notificationMuteTicketTypes } from "@workspace/validation/modules/notification/consts/notification-mute-ticket-type.const";
import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";
import {
  isNotificationPreferenceLockedGroup,
  notificationTypeToPreferenceGroup,
} from "@workspace/validation/modules/notification/utils/notification-type-preference-group.util";

export type NotificationDeliveryResolution = {
  inApp: boolean;
  email: boolean;
};

export class NotificationPreferenceService {
  constructor(private readonly userNotificationPreferenceRepository: UserNotificationPreferenceRepository) {}

  withTx(tx: DbClient): NotificationPreferenceService {
    return new NotificationPreferenceService(this.userNotificationPreferenceRepository.withTx(tx));
  }

  async resolveDelivery(input: {
    userId: string;
    organizationId: string;
    type: NotificationType;
    projectId: string | null;
  }): Promise<NotificationDeliveryResolution> {
    const group = notificationTypeToPreferenceGroup(input.type);

    if (isNotificationPreferenceLockedGroup(group)) {
      return { inApp: true, email: true };
    }

    if (
      input.projectId &&
      (notificationMuteTicketTypes as readonly string[]).includes(input.type) &&
      (await this.isProjectMuted(input.userId, input.organizationId, input.projectId))
    ) {
      return { inApp: false, email: false };
    }

    const preference =
      (await this.userNotificationPreferenceRepository.findByUserId(input.userId)) ??
      UserNotificationPreferenceFactory.create(input.userId);
    const channels = UserNotificationPreferenceMapper.resolveChannels(preference.channels);
    const channel = channels[group];

    return {
      inApp: channel.inApp,
      email: channel.email,
    };
  }

  async getEmailDigest(userId: string): Promise<NotificationEmailDigest> {
    const preference =
      (await this.userNotificationPreferenceRepository.findByUserId(userId)) ??
      UserNotificationPreferenceFactory.create(userId);
    return preference.emailDigest;
  }

  private async isProjectMuted(userId: string, organizationId: string, projectId: string): Promise<boolean> {
    const mutedProjectIds = await this.userNotificationPreferenceRepository.findMutedProjectIds(userId, organizationId);
    return mutedProjectIds.includes(projectId);
  }
}
