export type UserOrganizationNotificationPreferencePersistedType = {
  userId: string;
  organizationId: string;
  mutedProjectIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserOrganizationNotificationPreferenceType = Partial<
  Pick<UserOrganizationNotificationPreferencePersistedType, "mutedProjectIds">
>;