"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useInterfaceLanguage } from "@/client/modules/shared/locale/use-interface-language";
import { texts } from "@/shared/consts/texts.const";

export function DocumentTitle() {
  const pathname = usePathname();
  const language = useInterfaceLanguage();

  useEffect(() => {
    const pageTitle = document.querySelector("[data-page-title]")?.getAttribute("data-page-title");
    document.title = pageTitle ? `${pageTitle} | ${texts.brand.name}` : texts.brand.name;
  }, [language, pathname]);

  return null;
}
