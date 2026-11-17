import { SIDEBAR_OPEN_STATE_COOKIE } from "@workspace/design-system/lib/sidebar-open-state.util";
import type { UserPreferenceModelType } from "@workspace/validation/modules/preference/dto/user-preference.model";
import type { ThemeProviderProps } from "next-themes";

import {
  USER_PREFERENCE_COOKIE,
  USER_PREFERENCE_COOKIE_MAX_AGE_SECONDS,
} from "@/client/modules/preference/consts/user-preference-cookie.const";
import { toUserPreferenceCookieMirror } from "@/shared/user-preference/parse-user-preference-cookie.util";

type ApplyUserPreferenceDomInput = {
  preference: Pick<UserPreferenceModelType, "theme" | "accent" | "density" | "reduceMotion" | "sidebarCollapsed">;
  setTheme?: (theme: NonNullable<ThemeProviderProps["defaultTheme"]>) => void;
};

export function applyUserPreferenceDom({ preference, setTheme }: ApplyUserPreferenceDomInput): void {
  const root = document.documentElement;

  if (setTheme) {
    setTheme(preference.theme);
  } else if (preference.theme === "dark") {
    root.classList.add("dark");
  } else if (preference.theme === "light") {
    root.classList.remove("dark");
  }

  root.style.setProperty("--primary", preference.accent);
  root.dataset.density = preference.density;

  if (preference.reduceMotion === true) {
    root.dataset.reduceMotion = "true";
  } else if (preference.reduceMotion === false) {
    root.dataset.reduceMotion = "false";
  } else {
    delete root.dataset.reduceMotion;
  }

  const sidebarOpen = preference.sidebarCollapsed ? "false" : "true";
  document.cookie = `${SIDEBAR_OPEN_STATE_COOKIE}=${sidebarOpen}; path=/; max-age=${USER_PREFERENCE_COOKIE_MAX_AGE_SECONDS}`;

  const mirror = toUserPreferenceCookieMirror(preference);
  document.cookie = `${USER_PREFERENCE_COOKIE}=${encodeURIComponent(JSON.stringify(mirror))}; path=/; max-age=${USER_PREFERENCE_COOKIE_MAX_AGE_SECONDS}`;
}
