import type { NotificationPreferenceGroup } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";

export const notificationPreferenceAdminOnlyGroups = [
  "team_invitation_accepted",
] as const satisfies readonly NotificationPreferenceGroup[];
