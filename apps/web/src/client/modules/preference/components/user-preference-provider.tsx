"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { UserPreferenceModelType } from "@workspace/validation/modules/preference/dto/user-preference.model";
import { useTheme } from "next-themes";
import { type PropsWithChildren, Suspense, useEffect } from "react";

import { useBootstrapUserTimeZone } from "@/client/modules/preference/hooks/use-bootstrap-user-time-zone";
import { applyUserPreferenceDom } from "@/client/modules/preference/utils/apply-user-preference-dom.util";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";

type UserPreferenceProviderProps = PropsWithChildren<{
  initialPreference?: UserPreferenceModelType | null;
}>;

function UserPreferenceProviderInner({ children }: PropsWithChildren) {
  const { data: preference } = useFindUserPreference();
  const { setTheme } = useTheme();

  useBootstrapUserTimeZone();

  useEffect(() => {
    applyUserPreferenceDom({
      preference: {
        theme: preference.theme,
        accent: preference.accent,
        density: preference.density,
        reduceMotion: preference.reduceMotion,
        sidebarCollapsed: preference.sidebarCollapsed,
      },
      setTheme,
    });
  }, [
    preference.accent,
    preference.density,
    preference.reduceMotion,
    preference.sidebarCollapsed,
    preference.theme,
    setTheme,
  ]);

  return children;
}

export function UserPreferenceProvider({ initialPreference, children }: UserPreferenceProviderProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!initialPreference) return;
    queryClient.setQueryData(orpcQuery.preference.findUserPreference.queryOptions().queryKey, initialPreference);
  }, [initialPreference, queryClient]);

  return (
    <Suspense fallback={children}>
      <UserPreferenceProviderInner>{children}</UserPreferenceProviderInner>
    </Suspense>
  );
}
