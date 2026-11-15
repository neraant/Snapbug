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
    archivedBadge: "Archived",
    archiveDialog: {
      title: "Archive project?",
      description: (name: string) => `${name} will stop accepting new bug reports. Existing tickets stay available.`,
      cancel: "Cancel",
      confirm: "Archive",
    },
    member: (name: string) => name,
    moreMembers: (count: number) => `+${count}`,
  },
  settingsSheet: {
    title: "Project settings",
    description: "Update how this project appears and how the widget collects visitor data.",
    archivedBadge: "Archived",
    submit: "Save",
    cancel: "Cancel",
    field: {
      name: {
        label: "Project name",
        placeholder: "Acme Store",
      },
      slug: {
        label: "URL slug",
        placeholder: "acme-store",
        description: "Used in scoped links as ?project=slug. Must be unique in your organization.",
      },
      color: {
        label: "Color",
        swatchLabel: (color: string) => `Use color ${color}`,
      },
      defaultAssignee: {
        label: "Default assignee",
        placeholder: "Select a member",
        unassigned: "Unassigned",
      },
      storeVisitorIp: {
        label: "Store visitor IP",
        description: "When off, visitor IP addresses are not saved on new bug reports.",
      },
      collectVisitorEmail: {
        label: "Collect visitor email",
        description: "When off, the widget does not show an email field.",
      },
    },
    danger: {
      title: "Danger zone",
      description: "Archive, restore, or permanently delete this project.",
      archive: "Archive",
      restore: "Restore",
      delete: "Delete project",
    },
    deleteDialog: {
      title: "Delete project?",
      description: (name: string) =>
        `${name} and all of its tickets will be permanently deleted. This cannot be undone.`,
      cancel: "Cancel",
      confirm: "Delete",
    },
    toast: {
      saveSuccess: "Project settings saved.",
      saveError: "Could not save project settings. Try again.",
      archiveSuccess: "Project archived.",
      archiveError: "Could not archive the project. Try again.",
      restoreSuccess: "Project restored.",
      restoreError: "Could not restore the project. Try again.",
      deleteSuccess: "Project deleted.",
      deleteError: "Could not delete the project. Try again.",
    },
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
    archivedBadge: "В архиве",
    archiveDialog: {
      title: "Отправить проект в архив?",
      description: (name: string) =>
        `Проект «${name}» перестанет принимать новые отчёты. Существующие тикеты останутся доступны.`,
      cancel: "Отмена",
      confirm: "В архив",
    },
    member: (name: string) => name,
    moreMembers: (count: number) => `+${count}`,
  },
  settingsSheet: {
    title: "Настройки проекта",
    description: "Измените название, slug и параметры сбора данных в виджете.",
    archivedBadge: "В архиве",
    submit: "Сохранить",
    cancel: "Отмена",
    field: {
      name: {
        label: "Название проекта",
        placeholder: "Магазин Acme",
      },
      slug: {
        label: "Slug в URL",
        placeholder: "acme-store",
        description: "Используется в ссылках как ?project=slug. Должен быть уникален в организации.",
      },
      color: {
        label: "Цвет",
        swatchLabel: (color: string) => `Цвет ${color}`,
      },
      defaultAssignee: {
        label: "Исполнитель по умолчанию",
        placeholder: "Выберите участника",
        unassigned: "Не назначен",
      },
      storeVisitorIp: {
        label: "Сохранять IP посетителя",
        description: "Если выключено, IP не сохраняется в новых отчётах.",
      },
      collectVisitorEmail: {
        label: "Собирать email посетителя",
        description: "Если выключено, виджет не показывает поле email.",
      },
    },
    danger: {
      title: "Опасная зона",
      description: "Архивирование, восстановление или полное удаление проекта.",
      archive: "В архив",
      restore: "Восстановить",
      delete: "Удалить проект",
    },
    deleteDialog: {
      title: "Удалить проект?",
      description: (name: string) => `Проект «${name}» и все его тикеты будут удалены без возможности восстановления.`,
      cancel: "Отмена",
      confirm: "Удалить",
    },
    toast: {
      saveSuccess: "Настройки проекта сохранены.",
      saveError: "Не удалось сохранить настройки. Попробуйте ещё раз.",
      archiveSuccess: "Проект отправлен в архив.",
      archiveError: "Не удалось архивировать проект. Попробуйте ещё раз.",
      restoreSuccess: "Проект восстановлен.",
      restoreError: "Не удалось восстановить проект. Попробуйте ещё раз.",
      deleteSuccess: "Проект удалён.",
      deleteError: "Не удалось удалить проект. Попробуйте ещё раз.",
    },
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
