import { z } from "zod";

export const notificationPreferenceGroups = [
  "assigned_to_me",
  "new_tickets_in_my_projects",
  "status_changes_on_my_tickets",
  "comments_on_followed_tickets",
  "project_access_and_role_changes",
  "team_invitation_accepted",
  "project_archived_or_restored",
  "security",
] as const;

export type NotificationPreferenceGroup = (typeof notificationPreferenceGroups)[number];

export const notificationPreferenceGroupSchema = z.enum(notificationPreferenceGroups);
