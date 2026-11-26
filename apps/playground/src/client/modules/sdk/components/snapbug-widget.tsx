"use client";

import { snapbug } from "@neraant/snapbug";
import { useEffect } from "react";

import { publicEnv } from "@/shared/env.public.schema";

export function SnapbugWidget() {
  useEffect(() => {
    const apiKey = publicEnv.NEXT_PUBLIC_SNAPBUG_API_KEY;
    if (!apiKey) return;

    snapbug.init({ apiKey, host: publicEnv.NEXT_PUBLIC_SNAPBUG_HOST }).catch((error: unknown) => {
      console.error(error);
    });

    return () => snapbug.destroy();
  }, []);

  return null;
}
