import type { UserPreferenceTheme } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import { useCallback } from "react";

import { useQuietSavedIndicator } from "@/client/modules/preference/hooks/use-quiet-saved-indicator";
import { useUserTheme } from "@/client/modules/preference/hooks/use-user-theme";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";

export function usePreferencesSettingsForm() {
  const { data: preference } = useFindUserPreference();
  const { theme, setTheme, saving } = useUserTheme();
  const { markSaved, isSaved } = useQuietSavedIndicator();

  const onThemeChange = useCallback(
    async (next: UserPreferenceTheme) => {
      if (next === preference.theme) return;
      const saved = await setTheme(next);
      if (saved) {
        markSaved("theme");
      }
    },
    [markSaved, preference.theme, setTheme],
  );

  return {
    theme: theme as UserPreferenceTheme,
    saving,
    isSaved,
    onThemeChange,
  };
}
