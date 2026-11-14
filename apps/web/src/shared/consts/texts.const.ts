import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  brand: {
    name: "Snapbug",
    tagline: "Developer Triage",
  },
} as const;

const ru = {
  brand: {
    name: "Snapbug",
    tagline: "Триаж для разработчиков",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
