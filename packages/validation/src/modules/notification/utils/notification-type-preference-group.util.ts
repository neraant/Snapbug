import type { NotificationPreferenceGroup } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import { notificationPreferenceGroups } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";

export const notificationPreferenceLockedGroups = [
  "security",
] as const satisfies readonly NotificationPreferenceGroup[];

const notificationTypePreferenceGroupMap = {
  "ticket.assigned": "assigned_to_me",
  "ticket.created": "new_tickets_in_my_projects",
  "ticket.status_changed": "status_changes_on_my_tickets",
  "comment.created": "comments_on_followed_tickets",
  "membership.role_changed": "project_access_and_role_changes",
  "project.access_granted": "project_access_and_role_changes",
  "project.access_revoked": "project_access_and_role_changes",
  "invitation.accepted": "team_invitation_accepted",
  "project.archived": "project_archived_or_restored",
  "security.api_key_rotated": "security",
  "security.token_created": "security",
} as const satisfies Record<NotificationType, NotificationPreferenceGroup>;

export function notificationTypeToPreferenceGroup(type: NotificationType): NotificationPreferenceGroup {
  return notificationTypePreferenceGroupMap[type];
}

export function isNotificationPreferenceLockedGroup(group: NotificationPreferenceGroup): boolean {
  return (notificationPreferenceLockedGroups as readonly string[]).includes(group);
}

type NotificationPreferenceChannelDefaults = {
  inApp: boolean;
  email: boolean;
};

export const notificationPreferenceDefaultChannels: Record<
  NotificationPreferenceGroup,
  NotificationPreferenceChannelDefaults
> = {
  assigned_to_me: { inApp: true, email: true },
  new_tickets_in_my_projects: { inApp: true, email: false },
  status_changes_on_my_tickets: { inApp: true, email: false },
  comments_on_followed_tickets: { inApp: true, email: true },
  project_access_and_role_changes: { inApp: true, email: true },
  team_invitation_accepted: { inApp: true, email: false },
  project_archived_or_restored: { inApp: true, email: false },
  security: { inApp: true, email: true },
};
