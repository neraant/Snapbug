import { toast } from "@workspace/design-system/components/ui/toast";
import { getAppErrorMessage } from "@workspace/server/error/get-app-error-message";
import type { UserPreferenceAccent } from "@workspace/validation/modules/preference/consts/user-preference-accent.const";
import type { UserPreferenceDateFormat } from "@workspace/validation/modules/preference/consts/user-preference-date-format.const";
import type { UserPreferenceDensity } from "@workspace/validation/modules/preference/consts/user-preference-density.const";
import type { UserPreferenceLandingPage } from "@workspace/validation/modules/preference/consts/user-preference-landing-page.const";
import type { UserPreferenceTheme } from "@workspace/validation/modules/preference/consts/user-preference-theme.const";
import type { UpdateUserPreferenceInputDtoType } from "@workspace/validation/modules/preference/dto/update-user-preference.schema";
import { useTheme } from "next-themes";
import { useCallback, useMemo } from "react";

import { texts } from "@/client/modules/preference/consts/texts.const";
import { useQuietSavedIndicator } from "@/client/modules/preference/hooks/use-quiet-saved-indicator";
import { applyUserPreferenceDom } from "@/client/modules/preference/utils/apply-user-preference-dom.util";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";
import { useUpdateUserPreference } from "@/client/modules/shared/queries/use-update-user-preference";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useAppearanceSettingsForm() {
  const { data: preference } = useFindUserPreference();
  const { mutateAsync: updateUserPreference, isPending } = useUpdateUserPreference();
  const { markSaved, isSaved } = useQuietSavedIndicator();
  const { setTheme } = useTheme();

  const patch = useCallback(
    async (input: UpdateUserPreferenceInputDtoType, section: string) => {
      if (isPending) return;

      try {
        const updated = await updateUserPreference(input);
        applyUserPreferenceDom({
          preference: {
            theme: updated.theme,
            accent: updated.accent,
            density: updated.density,
            reduceMotion: updated.reduceMotion,
            sidebarCollapsed: updated.sidebarCollapsed,
          },
          setTheme,
        });
        markSaved(section);
      } catch (error) {
        toast.add({
          title: getAppErrorMessage(error, texts.toast.error),
          type: "error",
        });
      }
    },
    [isPending, markSaved, setTheme, updateUserPreference],
  );

  const onThemeChange = useCallback(
    (theme: UserPreferenceTheme) => {
      if (theme === preference.theme) return;
      patch({ theme }, "theme");
    },
    [patch, preference.theme],
  );

  const onAccentChange = useCallback(
    (accent: UserPreferenceAccent) => {
      if (accent === preference.accent) return;
      patch({ accent }, "accent");
    },
    [patch, preference.accent],
  );

  const onDensityChange = useCallback(
    (density: UserPreferenceDensity) => {
      if (density === preference.density) return;
      patch({ density }, "density");
    },
    [patch, preference.density],
  );

  const onDateFormatChange = useCallback(
    (dateFormat: UserPreferenceDateFormat) => {
      if (dateFormat === preference.dateFormat) return;
      patch({ dateFormat }, "date-format");
    },
    [patch, preference.dateFormat],
  );

  const onUse24HourTimeChange = useCallback(
    (use24HourTime: boolean) => {
      if (use24HourTime === preference.use24HourTime) return;
      patch({ use24HourTime }, "date-format");
    },
    [patch, preference.use24HourTime],
  );

  const onReduceMotionChange = useCallback(
    (checked: boolean) => {
      patch({ reduceMotion: checked }, "reduce-motion");
    },
    [patch],
  );

  const onResetReduceMotionToSystem = useCallback(() => {
    if (preference.reduceMotion === null) return;
    patch({ reduceMotion: null }, "reduce-motion");
  }, [patch, preference.reduceMotion]);

  const onDefaultLandingPageChange = useCallback(
    (defaultLandingPage: UserPreferenceLandingPage) => {
      if (defaultLandingPage === preference.defaultLandingPage) return;
      patch({ defaultLandingPage }, "landing-page");
    },
    [patch, preference.defaultLandingPage],
  );

  const onSidebarCollapsedChange = useCallback(
    (sidebarCollapsed: boolean) => {
      if (sidebarCollapsed === preference.sidebarCollapsed) return;
      patch({ sidebarCollapsed }, "sidebar");
    },
    [patch, preference.sidebarCollapsed],
  );

  const reduceMotionChecked = useMemo(
    () => (preference.reduceMotion === null ? prefersReducedMotion() : preference.reduceMotion),
    [preference.reduceMotion],
  );

  const reduceMotionUsesSystem = preference.reduceMotion === null;

  return {
    preference,
    saving: isPending,
    isSaved,
    onThemeChange,
    onAccentChange,
    onDensityChange,
    onDateFormatChange,
    onUse24HourTimeChange,
    onReduceMotionChange,
    onResetReduceMotionToSystem,
    onDefaultLandingPageChange,
    onSidebarCollapsedChange,
    reduceMotionChecked,
    reduceMotionUsesSystem,
  };
}
