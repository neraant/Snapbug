import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  overview: "Overview",
  tickets: "Tickets",
  sdkSetup: "SDK Setup",
  mcp: "MCP",
  playground: "Playground",
  projects: "Projects",
  team: "Team",
  settings: "Settings",
  activity: "Activity",
  organization: {
    ariaLabel: "Organization",
    create: "Create organization",
    empty: "No organization",
    switchError: "Could not switch organization. Try again.",
    role: {
      [UserRole.ADMIN]: "Admin",
      [UserRole.USER]: "Member",
    },
    dialog: {
      title: "Create organization",
      description: "Projects and tickets in this organization stay separate from your others.",
      nameLabel: "Name",
      namePlaceholder: "Acme",
      cancel: "Cancel",
      submit: "Create",
      error: "Could not create the organization. Try again.",
    },
  },
} as const;

const ru = {
  overview: "Обзор",
  tickets: "Тикеты",
  sdkSetup: "Настройка SDK",
  mcp: "MCP",
  playground: "Песочница",
  projects: "Проекты",
  team: "Команда",
  settings: "Настройки",
  activity: "Журнал",
  organization: {
    ariaLabel: "Организация",
    create: "Создать организацию",
    empty: "Нет организации",
    switchError: "Не удалось переключить организацию. Попробуйте ещё раз.",
    role: {
      [UserRole.ADMIN]: "Администратор",
      [UserRole.USER]: "Участник",
    },
    dialog: {
      title: "Создать организацию",
      description: "Проекты и тикеты этой организации не смешиваются с остальными.",
      nameLabel: "Название",
      namePlaceholder: "Acme",
      cancel: "Отмена",
      submit: "Создать",
      error: "Не удалось создать организацию. Попробуйте ещё раз.",
    },
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
