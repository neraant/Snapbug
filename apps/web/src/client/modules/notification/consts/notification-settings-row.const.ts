import type { NotificationPreferenceGroup } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import { notificationPreferenceGroups } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";

export const notificationSettingsRowOrder: NotificationPreferenceGroup[] = [...notificationPreferenceGroups];
