"use client";

import { snapbug } from "@neraant/snapbug";
import { useEffect, useMemo } from "react";

import { buildSnapbugWidgetInitOptions } from "@/client/modules/sdk-setup/utils/build-snapbug-widget-init-options.util";
import { useProjectScopeSearchParam } from "@/client/modules/shared/hooks/use-project-scope-search-param";
import { useFindProjectApiKey } from "@/client/modules/shared/queries/use-find-project-api-key";
import { useFindProjectWidgetSetting } from "@/client/modules/shared/queries/use-find-project-widget-setting";

const playgroundFallbackApiKey = "sb_test_store_active";

const isStagingApp =
  process.env.NEXT_PUBLIC_APP_ENV === "staging" || process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV === "staging";

export function PlaygroundSnapbug() {
  const { projectId } = useProjectScopeSearchParam();

  if (!projectId) {
    return <PlaygroundSnapbugUnscoped />;
  }

  return <PlaygroundSnapbugScoped projectId={projectId} />;
}

function PlaygroundSnapbugUnscoped() {
  useEffect(() => {
    if (isStagingApp) {
      const stagingApiKey = process.env.NEXT_PUBLIC_SNAPBUG_API_KEY?.trim();
      if (!stagingApiKey) {
        console.warn("NEXT_PUBLIC_SNAPBUG_API_KEY is not set");
        return;
      }

      snapbug.init({
        apiKey: stagingApiKey,
        host: window.location.origin,
      });

      return () => snapbug.destroy();
    }

    snapbug.init({
      apiKey: playgroundFallbackApiKey,
      host: window.location.origin,
    });

    return () => snapbug.destroy();
  }, []);

  return null;
}

type PlaygroundSnapbugScopedProps = {
  projectId: string;
};

function PlaygroundSnapbugScoped({ projectId }: PlaygroundSnapbugScopedProps) {
  const { data: apiKeyData } = useFindProjectApiKey({ projectId });
  const { data: widgetSettings } = useFindProjectWidgetSetting({ projectId });

  const widgetOptions = useMemo(() => buildSnapbugWidgetInitOptions(widgetSettings), [widgetSettings]);

  useEffect(() => {
    if (apiKeyData.key.includes("\u2022")) {
      return;
    }

    snapbug.init({
      apiKey: apiKeyData.key,
      host: window.location.origin,
      ...widgetOptions,
    });

    return () => snapbug.destroy();
  }, [apiKeyData.key, widgetOptions]);

  return null;
}
