import { UserNotificationPreference } from "@workspace/server/modules/notification/entity/user-notification-preference.entity";
import type { UserNotificationPreferencePersistedType } from "@workspace/server/modules/notification/entity/user-notification-preference.types";
import { notificationPreferenceAdminOnlyGroups } from "@workspace/validation/modules/notification/consts/notification-preference-admin-only-group.const";
import type { NotificationPreferenceGroup } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import { notificationPreferenceGroups } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import type { NotificationPreferenceModelType } from "@workspace/validation/modules/notification/dto/notification-preference.model";
import { notificationPreferenceModelDefaultLockedGroups } from "@workspace/validation/modules/notification/dto/notification-preference.model";
import {
  notificationPreferenceDefaultChannels,
  isNotificationPreferenceLockedGroup,
} from "@workspace/validation/modules/notification/utils/notification-type-preference-group.util";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export abstract class UserNotificationPreferenceMapper {
  static fromPersistence(row: UserNotificationPreferencePersistedType): UserNotificationPreference {
    return new UserNotificationPreference(row);
  }

  static toPersistence(
    userNotificationPreference: UserNotificationPreference,
  ): UserNotificationPreferencePersistedType {
    return userNotificationPreference.toObject();
  }

  static resolveChannels(
    stored: UserNotificationPreferencePersistedType["channels"],
  ): Record<NotificationPreferenceGroup, { inApp: boolean; email: boolean }> {
    return Object.fromEntries(
      notificationPreferenceGroups.map((group) => {
        const defaults = notificationPreferenceDefaultChannels[group];
        const saved = stored[group];
        return [
          group,
          {
            inApp: saved?.inApp ?? defaults.inApp,
            email: saved?.email ?? defaults.email,
          },
        ];
      }),
    ) as Record<NotificationPreferenceGroup, { inApp: boolean; email: boolean }>;
  }

  static toDto(input: {
    userNotificationPreference: UserNotificationPreference;
    mutedProjectIds: string[];
    role: UserRole;
  }): NotificationPreferenceModelType {
    const { userNotificationPreference, mutedProjectIds, role } = input;
    const persisted = userNotificationPreference.toObject();
    const channels = UserNotificationPreferenceMapper.resolveChannels(persisted.channels);
    const visibleGroups = notificationPreferenceGroups.filter((group) => {
      if (role === UserRole.ADMIN) return true;
      return !(notificationPreferenceAdminOnlyGroups as readonly string[]).includes(group);
    });

    const visibleChannels = Object.fromEntries(
      visibleGroups.map((group) => [group, channels[group]]),
    ) as NotificationPreferenceModelType["channels"];

    return {
      channels: visibleChannels,
      mutedProjectIds,
      lockedGroups: notificationPreferenceGroups.filter(isNotificationPreferenceLockedGroup),
      createdAt: persisted.createdAt.toISOString(),
      updatedAt: persisted.updatedAt.toISOString(),
    };
  }

  static mergeChannelUpdates(
    current: UserNotificationPreference,
    patch: Partial<Record<NotificationPreferenceGroup, { inApp?: boolean; email?: boolean }>>,
    role: UserRole,
  ): UserNotificationPreferencePersistedType["channels"] {
    const resolved = UserNotificationPreferenceMapper.resolveChannels(current.channels);
    const next = { ...current.channels };

    for (const [group, change] of Object.entries(patch) as [
      NotificationPreferenceGroup,
      { inApp?: boolean; email?: boolean },
    ][]) {
      if (isNotificationPreferenceLockedGroup(group)) {
        continue;
      }
      if (role !== UserRole.ADMIN && (notificationPreferenceAdminOnlyGroups as readonly string[]).includes(group)) {
        continue;
      }
      const base = resolved[group];
      next[group] = {
        inApp: change.inApp ?? base.inApp,
        email: change.email ?? base.email,
      };
    }

    return next;
  }

  static modelDefaultLockedGroups(): NotificationPreferenceModelType["lockedGroups"] {
    return [...notificationPreferenceModelDefaultLockedGroups];
  }
}
