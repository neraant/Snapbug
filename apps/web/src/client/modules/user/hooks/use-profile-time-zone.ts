import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import { useCallback, useMemo, useState } from "react";

import { timeZoneUserSetStorageKey } from "@/client/modules/preference/consts/time-zone-user-set.storage-key.const";
import { useQuietSavedIndicator } from "@/client/modules/preference/hooks/use-quiet-saved-indicator";
import { detectBrowserTimeZone } from "@/client/modules/preference/utils/detect-browser-time-zone.util";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";
import { useUpdateUserPreference } from "@/client/modules/shared/queries/use-update-user-preference";
import { texts } from "@/client/modules/user/consts/texts.const";

const TIME_ZONE_SECTION = "time-zone";

export function useProfileTimeZone() {
  const { data: preference } = useFindUserPreference();
  const { mutateAsync: updateUserPreference, isPending } = useUpdateUserPreference();
  const { markSaved, isSaved } = useQuietSavedIndicator();
  const [detectedTimeZone] = useState(() => detectBrowserTimeZone());

  const options = useMemo(() => {
    const zones =
      typeof Intl.supportedValuesOf === "function"
        ? Intl.supportedValuesOf("timeZone")
        : [preference.timeZone, detectedTimeZone, "UTC"];

    const values = new Set(zones);
    values.add(preference.timeZone);
    values.add(detectedTimeZone);

    return [...values]
      .sort((left, right) => left.localeCompare(right))
      .map((value) => ({
        value,
        label: value,
      }));
  }, [detectedTimeZone, preference.timeZone]);

  const onValueChange = useCallback(
    async (nextTimeZone: string) => {
      if (nextTimeZone === preference.timeZone || isPending) return;

      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(timeZoneUserSetStorageKey, "1");
        }
        await updateUserPreference({ timeZone: nextTimeZone });
        markSaved(TIME_ZONE_SECTION);
      } catch (error) {
        toast.add({
          title: getAppErrorMessage(error, texts.timeZone.toast.error),
          type: "error",
        });
      }
    },
    [isPending, markSaved, preference.timeZone, updateUserPreference],
  );

  return {
    value: preference.timeZone,
    options,
    detectedTimeZone,
    saving: isPending,
    savedVisible: isSaved(TIME_ZONE_SECTION),
    onValueChange,
    hint: texts.timeZone.detectedHint(detectedTimeZone),
  };
}
