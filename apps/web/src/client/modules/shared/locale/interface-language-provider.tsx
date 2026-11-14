"use client";

import { type PropsWithChildren, useEffect } from "react";

import {
  getInterfaceLanguage,
  type InterfaceLanguage,
  setInterfaceLanguage,
} from "@/client/modules/shared/locale/interface-language";
import { useInterfaceLanguage } from "@/client/modules/shared/locale/use-interface-language";

type InterfaceLanguageProviderProps = PropsWithChildren<{
  language: InterfaceLanguage;
}>;

export function InterfaceLanguageProvider({ language, children }: InterfaceLanguageProviderProps) {
  if (getInterfaceLanguage() !== language) {
    setInterfaceLanguage(language);
  }

  const active = useInterfaceLanguage();

  useEffect(() => {
    document.documentElement.lang = active;
  }, [active]);

  return children;
}
