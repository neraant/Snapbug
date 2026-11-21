import type {
  UpdateUserOrganizationNotificationPreferenceType,
  UserOrganizationNotificationPreferencePersistedType,
} from "@workspace/server/modules/notification/entity/user-organization-notification-preference.types";

export class UserOrganizationNotificationPreference {
  readonly userId: UserOrganizationNotificationPreferencePersistedType["userId"];
  readonly organizationId: UserOrganizationNotificationPreferencePersistedType["organizationId"];
  readonly mutedProjectIds: UserOrganizationNotificationPreferencePersistedType["mutedProjectIds"];
  readonly createdAt: UserOrganizationNotificationPreferencePersistedType["createdAt"];
  readonly updatedAt: UserOrganizationNotificationPreferencePersistedType["updatedAt"];

  constructor(preference: UserOrganizationNotificationPreferencePersistedType) {
    this.userId = preference.userId;
    this.organizationId = preference.organizationId;
    this.mutedProjectIds = preference.mutedProjectIds;
    this.createdAt = preference.createdAt;
    this.updatedAt = preference.updatedAt;
  }

  update(patch: UpdateUserOrganizationNotificationPreferenceType): UserOrganizationNotificationPreference {
    return new UserOrganizationNotificationPreference({
      ...this.toObject(),
      ...patch,
      updatedAt: new Date(),
    });
  }

  toObject(): UserOrganizationNotificationPreferencePersistedType {
    return {
      userId: this.userId,
      organizationId: this.organizationId,
      mutedProjectIds: this.mutedProjectIds,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
