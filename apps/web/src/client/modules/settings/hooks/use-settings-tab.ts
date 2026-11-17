"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  defaultSettingsTab,
  type SettingsTab,
  settingsTabs,
  settingsTabSearchParamKey,
} from "@/client/modules/settings/consts/settings-tab.const";

function parseSettingsTab(value: string | null): SettingsTab {
  if (
    value === settingsTabs.profile ||
    value === settingsTabs.appearance ||
    value === settingsTabs.organization ||
    value === settingsTabs.tokens
  ) {
    return value;
  }

  return defaultSettingsTab;
}

export function useSettingsTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = parseSettingsTab(searchParams.get(settingsTabSearchParamKey));

  const setTab = useCallback(
    (nextTab: SettingsTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextTab === defaultSettingsTab) {
        params.delete(settingsTabSearchParamKey);
      } else {
        params.set(settingsTabSearchParamKey, nextTab);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { tab, setTab };
}
