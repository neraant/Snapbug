import { UserOrganizationNotificationPreference } from "@workspace/server/modules/notification/entity/user-organization-notification-preference.entity";
import type { UserOrganizationNotificationPreferencePersistedType } from "@workspace/server/modules/notification/entity/user-organization-notification-preference.types";

export abstract class UserOrganizationNotificationPreferenceMapper {
  static fromPersistence(
    row: UserOrganizationNotificationPreferencePersistedType,
  ): UserOrganizationNotificationPreference {
    return new UserOrganizationNotificationPreference(row);
  }

  static toPersistence(
    preference: UserOrganizationNotificationPreference,
  ): UserOrganizationNotificationPreferencePersistedType {
    return preference.toObject();
  }
}
