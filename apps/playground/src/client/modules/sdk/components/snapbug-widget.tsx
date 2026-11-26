"use client";

import { snapbug } from "@neraant/snapbug";
import { useEffect } from "react";

import { usePlaygroundApiKey } from "@/client/modules/sdk/hooks/use-playground-api-key";
import { publicEnv } from "@/shared/env.public.schema";

export function SnapbugWidget() {
  const { apiKey } = usePlaygroundApiKey();

  useEffect(() => {
    if (!apiKey) return;

    snapbug.init({ apiKey, host: publicEnv.NEXT_PUBLIC_SNAPBUG_HOST }).catch((error: unknown) => {
      console.error(error);
    });

    return () => snapbug.destroy();
  }, [apiKey]);

  return null;
}
