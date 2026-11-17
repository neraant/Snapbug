import { userPreferenceDefaults } from "@workspace/validation/modules/preference/dto/user-preference.model";
import { useEffect } from "react";

import { timeZoneUserSetStorageKey } from "@/client/modules/preference/consts/time-zone-user-set.storage-key.const";
import { detectBrowserTimeZone } from "@/client/modules/preference/utils/detect-browser-time-zone.util";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";
import { useUpdateUserPreference } from "@/client/modules/shared/queries/use-update-user-preference";

export function useBootstrapUserTimeZone() {
  const { data: preference } = useFindUserPreference();
  const { mutateAsync: updateUserPreference } = useUpdateUserPreference();

  useEffect(() => {
    const detectedTimeZone = detectBrowserTimeZone();
    if (preference.timeZone !== userPreferenceDefaults.timeZone) return;
    if (detectedTimeZone === preference.timeZone) return;
    if (typeof localStorage !== "undefined" && localStorage.getItem(timeZoneUserSetStorageKey) === "1") return;

    updateUserPreference({ timeZone: detectedTimeZone }).catch(() => undefined);
  }, [preference.timeZone, updateUserPreference]);
}
