import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import type { UserPreferenceTheme } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import { texts } from "@/client/modules/preference/consts/texts.const";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";
import { useUpdateUserPreference } from "@/client/modules/shared/queries/use-update-user-preference";

export function useUserTheme() {
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme();
  const { data: preference } = useFindUserPreference();
  const { mutateAsync: updateUserPreference, isPending } = useUpdateUserPreference();

  const theme = nextTheme ?? preference.theme ?? "system";

  const setTheme = useCallback(
    async (value: string) => {
      const next = value as UserPreferenceTheme;
      const previous = (nextTheme ?? preference.theme ?? "system") as UserPreferenceTheme;

      setNextTheme(next);

      try {
        await updateUserPreference({ theme: next });
        return true;
      } catch (error) {
        setNextTheme(previous);
        toast.add({
          title: getAppErrorMessage(error, texts.toast.error),
          type: "error",
        });
        return false;
      }
    },
    [nextTheme, preference.theme, setNextTheme, updateUserPreference],
  );

  return { theme, setTheme, saving: isPending };
}
