import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "Projects",
  newProject: "New project",
  search: {
    ariaLabel: "Search projects",
    placeholder: "Search projects…",
    clear: "Clear search",
  },
  empty: {
    title: "No projects yet",
    description: "Create a project to start collecting bug reports.",
  },
  emptyFiltered: {
    title: "No matching projects",
    description: "Try a different search term.",
  },
  card: {
    openIssues: (count: number) => (count === 1 ? "1 open issue" : `${count} open issues`),
    created: (dateLabel: string) => `Created ${dateLabel}`,
    menu: "Project actions",
    settings: "Settings",
    archive: "Archive",
    member: (name: string) => name,
    moreMembers: (count: number) => `+${count}`,
  },
  createSheet: {
    title: "New project",
    description: "Add a project for your team to triage bug reports.",
    field: {
      name: {
        label: "Project name",
        placeholder: "Default project",
        required: "Project name is required",
      },
      color: {
        label: "Color",
        swatchLabel: (color: string) => `Use color ${color}`,
      },
    },
    submit: "Create project",
    cancel: "Cancel",
  },
  toast: {
    createError: "Could not create the project. Try again.",
    missingOrganization: "Organization is not set up yet. Finish onboarding first.",
  },
} as const;

const ru = {
  title: "Проекты",
  newProject: "Новый проект",
  search: {
    ariaLabel: "Поиск проектов",
    placeholder: "Поиск проектов…",
    clear: "Очистить поиск",
  },
  empty: {
    title: "Проектов пока нет",
    description: "Создайте проект, чтобы начать собирать отчёты об ошибках.",
  },
  emptyFiltered: {
    title: "Нет подходящих проектов",
    description: "Попробуйте другой запрос.",
  },
  card: {
    openIssues: (count: number) => {
      const mod10 = count % 10;
      const mod100 = count % 100;
      if (mod10 === 1 && mod100 !== 11) return `${count} открытая проблема`;
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} открытые проблемы`;
      return `${count} открытых проблем`;
    },
    created: (dateLabel: string) => `Создан ${dateLabel}`,
    menu: "Действия с проектом",
    settings: "Настройки",
    archive: "В архив",
    member: (name: string) => name,
    moreMembers: (count: number) => `+${count}`,
  },
  createSheet: {
    title: "Новый проект",
    description: "Добавьте проект, чтобы команда разбирала отчёты об ошибках.",
    field: {
      name: {
        label: "Название проекта",
        placeholder: "Проект по умолчанию",
        required: "Укажите название проекта",
      },
      color: {
        label: "Цвет",
        swatchLabel: (color: string) => `Цвет ${color}`,
      },
    },
    submit: "Создать проект",
    cancel: "Отмена",
  },
  toast: {
    createError: "Не удалось создать проект. Попробуйте ещё раз.",
    missingOrganization: "Организация ещё не настроена. Сначала завершите онбординг.",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
