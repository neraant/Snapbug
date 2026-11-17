import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import type { NotificationEmailDigest } from "@workspace/validation/modules/notification/consts/notification-email-digest.const";
import type { NotificationPreferenceGroup } from "@workspace/validation/modules/notification/consts/notification-preference-group.const";
import type { UpdateNotificationPreferenceInputDtoType } from "@workspace/validation/modules/notification/dto/update-notification-preference.schema";
import { useCallback, useMemo } from "react";

import { notificationSettingsRowOrder } from "@/client/modules/notification/consts/notification-settings-row.const";
import { texts } from "@/client/modules/notification/consts/texts.const";
import { useQuietSavedIndicator } from "@/client/modules/preference/hooks/use-quiet-saved-indicator";
import { useFindNotificationPreference } from "@/client/modules/shared/queries/use-find-notification-preference";
import { useFindProjects } from "@/client/modules/shared/queries/use-find-projects";
import { useUpdateNotificationPreference } from "@/client/modules/shared/queries/use-update-notification-preference";

export function useNotificationSettingsForm() {
  const { data: preference } = useFindNotificationPreference();
  const { data: projects } = useFindProjects();
  const { mutateAsync: updatePreference, isPending } = useUpdateNotificationPreference();
  const { markSaved, isSaved } = useQuietSavedIndicator();

  const visibleRows = useMemo(
    () =>
      notificationSettingsRowOrder
        .filter((group) => preference.channels[group] !== undefined)
        .map((group) => ({
          group,
          locked: preference.lockedGroups.includes(group),
        })),
    [preference.channels, preference.lockedGroups],
  );

  const mutedProjectIds = useMemo(() => new Set(preference.mutedProjectIds), [preference.mutedProjectIds]);

  const patch = useCallback(
    async (input: UpdateNotificationPreferenceInputDtoType, section: string) => {
      if (isPending) return;

      try {
        await updatePreference(input);
        markSaved(section);
      } catch (error) {
        toast.add({
          title: getAppErrorMessage(error, texts.settings.toast.error),
          type: "error",
        });
      }
    },
    [isPending, markSaved, updatePreference],
  );

  const onChannelChange = useCallback(
    (group: NotificationPreferenceGroup, channel: "inApp" | "email", enabled: boolean) => {
      const current = preference.channels[group];
      if (!current || current[channel] === enabled) return;
      patch(
        {
          channels: {
            [group]: { [channel]: enabled },
          } as UpdateNotificationPreferenceInputDtoType["channels"],
        },
        "matrix",
      );
    },
    [patch, preference.channels],
  );

  const onToggleMutedProject = useCallback(
    (projectId: string, muted: boolean) => {
      const next = new Set(preference.mutedProjectIds);
      if (muted) {
        next.add(projectId);
      } else {
        next.delete(projectId);
      }
      if (next.size === preference.mutedProjectIds.length && preference.mutedProjectIds.every((id) => next.has(id))) {
        return;
      }
      patch({ mutedProjectIds: [...next] }, "mute");
    },
    [patch, preference.mutedProjectIds],
  );

  const onEmailDigestChange = useCallback(
    (emailDigest: NotificationEmailDigest) => {
      if (emailDigest === preference.emailDigest) return;
      patch({ emailDigest }, "digest");
    },
    [patch, preference.emailDigest],
  );

  return {
    preference,
    projects,
    visibleRows,
    mutedProjectIds,
    saving: isPending,
    isSaved,
    onChannelChange,
    onToggleMutedProject,
    onEmailDigestChange,
  };
}
