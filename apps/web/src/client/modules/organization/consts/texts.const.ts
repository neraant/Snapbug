import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "Organization settings",
  description: "The name of this organization and how long its reports are kept.",
  name: {
    label: "Name",
  },
  retention: {
    label: "Retention period",
    description: "Days to keep reports for this organization.",
  },
  save: "Save",
  toast: {
    success: "Organization settings saved",
    error: "Could not save organization settings. Try again.",
  },
} as const;

const ru = {
  title: "Настройки организации",
  description: "Название организации и срок хранения отчётов.",
  name: {
    label: "Название",
  },
  retention: {
    label: "Срок хранения",
    description: "Сколько дней хранить отчёты этой организации.",
  },
  save: "Сохранить",
  toast: {
    success: "Настройки организации сохранены",
    error: "Не удалось сохранить настройки организации. Попробуйте ещё раз.",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
