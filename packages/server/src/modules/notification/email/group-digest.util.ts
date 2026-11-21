import type { NotificationEmailPendingPersistedType } from "@workspace/server/modules/notification/entity/notification-email-pending.types";
import { notificationEmailTexts } from "@workspace/server/modules/notification/email/notification-email-copy.const";
import type { InterfaceLanguage } from "@workspace/validation/modules/user/consts/interface-language.const";

export type NotificationDigestProjectGroup = {
  projectKey: string;
  projectName: string;
  items: NotificationEmailPendingPersistedType[];
};

export function groupDigestByProject(
  items: NotificationEmailPendingPersistedType[],
  language: InterfaceLanguage,
): NotificationDigestProjectGroup[] {
  const fallback = notificationEmailTexts[language].projectGroupFallback;
  const groups = new Map<string, NotificationDigestProjectGroup>();

  for (const item of items) {
    const projectName = item.payload.projectName?.trim() || fallback;
    const projectKey = item.projectId ?? projectName;
    const existing = groups.get(projectKey);
    if (existing) {
      existing.items.push(item);
      continue;
    }
    groups.set(projectKey, { projectKey, projectName, items: [item] });
  }

  return [...groups.values()];
}
