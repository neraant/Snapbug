import { UserOrganizationNotificationPreference } from "@workspace/server/modules/notification/entity/user-organization-notification-preference.entity";

export abstract class UserOrganizationNotificationPreferenceFactory {
  static create(userId: string, organizationId: string): UserOrganizationNotificationPreference {
    const now = new Date();
    return new UserOrganizationNotificationPreference({
      userId,
      organizationId,
      mutedProjectIds: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
