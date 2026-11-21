"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { UserPreferenceModelType } from "@workspace/validation/modules/preference/dto/user-preference.model";
import { useTheme } from "next-themes";
import { type PropsWithChildren, Suspense, useEffect, useRef } from "react";

import { useBootstrapUserTimeZone } from "@/client/modules/preference/hooks/use-bootstrap-user-time-zone";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";
import { useFindUserPreference } from "@/client/modules/shared/queries/use-find-user-preference";

type UserPreferenceProviderProps = PropsWithChildren<{
  initialPreference?: UserPreferenceModelType | null;
}>;

function UserPreferenceProviderInner({ children }: PropsWithChildren) {
  const { data: preference } = useFindUserPreference();
  const { theme, setTheme } = useTheme();
  const hasAppliedServerTheme = useRef(false);

  useBootstrapUserTimeZone();

  useEffect(() => {
    if (hasAppliedServerTheme.current) return;
    if (theme === undefined) return;

    hasAppliedServerTheme.current = true;

    if (preference.theme !== theme) {
      setTheme(preference.theme);
    }
  }, [preference.theme, setTheme, theme]);

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
