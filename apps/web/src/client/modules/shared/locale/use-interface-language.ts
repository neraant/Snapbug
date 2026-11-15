"use client";

import { useSyncExternalStore } from "react";

import { getInterfaceLanguage, subscribeInterfaceLanguage } from "@/client/modules/shared/locale/interface-language";

export function useInterfaceLanguage() {
  return useSyncExternalStore(subscribeInterfaceLanguage, getInterfaceLanguage, getInterfaceLanguage);
}
