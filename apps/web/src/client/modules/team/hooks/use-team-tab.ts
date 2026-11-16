"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  defaultTeamTab,
  type TeamTab,
  teamTabs,
  teamTabSearchParamKey,
} from "@/client/modules/team/consts/team-tab.const";

function parseTeamTab(value: string | null): TeamTab {
  if (value === teamTabs.members || value === teamTabs.invitations) {
    return value;
  }

  return defaultTeamTab;
}

export function useTeamTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = parseTeamTab(searchParams.get(teamTabSearchParamKey));

  const setTab = useCallback(
    (nextTab: TeamTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(teamTabSearchParamKey, nextTab);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { tab, setTab, isMembersTab: tab === teamTabs.members };
}
