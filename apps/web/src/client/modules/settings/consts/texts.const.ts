import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "Settings",
  description: "Profile, organization, and personal access tokens.",
  tabs: {
    ariaLabel: "Settings sections",
    profile: "Profile",
    organization: "Organization",
    tokens: "Access tokens",
  },
  unsavedTabChange: {
    title: "Discard unsaved changes?",
    description: "You have unsaved organization settings. Discard them and switch tab?",
    confirm: "Discard",
  },
  saved: "Saved",
  tokens: {
    section: {
      title: "Personal access tokens",
      description:
        "Connect an MCP client with a personal token. Send it as a Bearer token to /api/mcp. A project key is not accepted.",
      manageLink: "Manage tokens →",
    },
  },
} as const;

const ru = {
  title: "Настройки",
  description: "Профиль, организация и личные токены доступа.",
  tabs: {
    ariaLabel: "Разделы настроек",
    profile: "Профиль",
    organization: "Организация",
    tokens: "Токены доступа",
  },
  unsavedTabChange: {
    title: "Отменить несохранённые изменения?",
    description: "Есть несохранённые настройки организации. Отменить их и перейти на другую вкладку?",
    confirm: "Отменить",
  },
  saved: "Сохранено",
  tokens: {
    section: {
      title: "Личные токены доступа",
      description:
        "Подключите MCP-клиент личным токеном. Передавайте его как Bearer-токен на /api/mcp. Ключ проекта не подойдёт.",
      manageLink: "Управление токенами →",
    },
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
