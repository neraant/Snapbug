import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "Settings",
  description: "Profile, preferences, notifications, and organization.",
  tabs: {
    ariaLabel: "Settings sections",
    profile: "Profile",
    preferences: "Preferences",
    notifications: "Notifications",
    organization: "Organization",
  },
  unsavedTabChange: {
    title: "Discard unsaved changes?",
    description: "You have unsaved organization settings. Discard them and switch tab?",
    confirm: "Discard",
  },
  saved: "Saved",
} as const;

const ru = {
  title: "Настройки",
  description: "Профиль, предпочтения, уведомления и организация.",
  tabs: {
    ariaLabel: "Разделы настроек",
    profile: "Профиль",
    preferences: "Предпочтения",
    notifications: "Уведомления",
    organization: "Организация",
  },
  unsavedTabChange: {
    title: "Отменить несохранённые изменения?",
    description: "Есть несохранённые настройки организации. Отменить их и перейти на другую вкладку?",
    confirm: "Отменить",
  },
  saved: "Сохранено",
} as const;

export const texts: typeof en = localize(en, ru as never);