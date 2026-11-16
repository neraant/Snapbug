import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  pageNote: "Only admins can change these settings.",
  name: {
    sectionTitle: "Organization name",
    sectionDescription: "The name shown across the workspace.",
    label: "Name",
  },
  retention: {
    sectionTitle: "Retention period",
    sectionDescription: "Days to keep reports for this organization.",
    label: "Retention period",
    days: (count: number) => `${count} days`,
  },
  save: "Save",
  saved: "Saved",
  toast: {
    success: "Organization settings saved",
    error: "Could not save organization settings. Try again.",
  },
} as const;

const ru = {
  pageNote: "Только администраторы могут менять эти настройки.",
  name: {
    sectionTitle: "Название организации",
    sectionDescription: "Имя, которое видно в рабочей области.",
    label: "Название",
  },
  retention: {
    sectionTitle: "Срок хранения",
    sectionDescription: "Сколько дней хранить отчёты этой организации.",
    label: "Срок хранения",
    days: (count: number) => `${count} дн.`,
  },
  save: "Сохранить",
  saved: "Сохранено",
  toast: {
    success: "Настройки организации сохранены",
    error: "Не удалось сохранить настройки организации. Попробуйте ещё раз.",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);