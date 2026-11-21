"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { UserPreferenceModelType } from "@workspace/validation/modules/preference/dto/user-preference.model";
import { useTheme } from "next-themes";
import { type PropsWithChildren, Suspense, useEffect } from "react";

import { useBootstrapUserTimeZone } from "@/client/modules/preference/hooks/use-bootstrap-user-time-zone";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";

type UserPreferenceProviderProps = PropsWithChildren<{
  initialPreference?: UserPreferenceModelType | null;
}>;

let didSyncServerTheme = false;

function UserPreferenceProviderInner({ children }: PropsWithChildren) {
  useFindUserPreference();
  useBootstrapUserTimeZone();

  return children;
}

export function UserPreferenceProvider({ initialPreference, children }: UserPreferenceProviderProps) {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const preferenceQueryKey = orpcQuery.preference.findUserPreference.queryOptions().queryKey;

  if (initialPreference && queryClient.getQueryData(preferenceQueryKey) === undefined) {
    queryClient.setQueryData(preferenceQueryKey, initialPreference);
  }

  useEffect(() => {
    if (didSyncServerTheme) return;
    if (!initialPreference) return;
    if (theme === undefined) return;

    didSyncServerTheme = true;

    if (initialPreference.theme !== theme) {
      setTheme(initialPreference.theme);
    }
  }, [initialPreference, setTheme, theme]);

  return (
    <Suspense fallback={children}>
      <UserPreferenceProviderInner>{children}</UserPreferenceProviderInner>
    </Suspense>
  );
}
