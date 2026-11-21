"use client";

import { type PropsWithChildren, useEffect, useLayoutEffect } from "react";

import {
  getInterfaceLanguage,
  type InterfaceLanguage,
  setInterfaceLanguage,
  syncInterfaceLanguage,
} from "@/client/modules/shared/locale/interface-language";
import { useInterfaceLanguage } from "@/client/modules/shared/locale/use-interface-language";

type InterfaceLanguageProviderProps = PropsWithChildren<{
  language: InterfaceLanguage;
}>;

export function InterfaceLanguageProvider({ language, children }: InterfaceLanguageProviderProps) {
  if (getInterfaceLanguage() !== language) {
    syncInterfaceLanguage(language);
  }

  useLayoutEffect(() => {
    if (getInterfaceLanguage() !== language) {
      setInterfaceLanguage(language);
    }
  }, [language]);

  const active = useInterfaceLanguage();

  useEffect(() => {
    document.documentElement.lang = active;
  }, [active]);

  return children;
}
