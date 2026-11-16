import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "Projects",
  newProject: "New project",
  search: {
    ariaLabel: "Search projects",
    placeholder: "Search projects…",
    clear: "Clear search",
  },
  filter: {
    archive: {
      ariaLabel: "Show projects",
      active: "Active",
      archived: "Archived",
      all: "All",
    },
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
    menu: "Project actions",
    settings: "Settings",
    openSdkSetup: "Open SDK setup",
    archive: "Archive",
    restore: "Restore",
    delete: "Delete",
    archivedStrip: "Archived",
    openTickets: (count: number) => (count === 1 ? "1 open" : `${count} open`),
    totalTickets: (count: number) => (count === 1 ? "1 ticket" : `${count} tickets`),
    noTicketsYet: "No tickets yet",
    lastTicket: (relative: string) => `Last ${relative}`,
    created: (dateLabel: string) => `Created ${dateLabel}`,
    navigateToTickets: (name: string) => `Open tickets for ${name}`,
    archiveDialog: {
      title: (name: string) => `Archive "${name}"?`,
      description: (name: string) =>
        `${name} will stop accepting new bug reports. You can restore it later from project settings.`,
      confirm: "Archive",
    },
    restoreDialog: {
      title: (name: string) => `Restore "${name}"?`,
      description: (name: string) => `${name} will accept new bug reports again.`,
      confirm: "Restore",
    },
    deleteDialog: {
      title: (name: string) => `Delete "${name}"?`,
      description: () => "This project and all of its tickets will be permanently deleted. This cannot be undone.",
      confirm: "Delete",
    },
    member: (name: string) => name,
    moreMembers: (count: number) => `+${count}`,
  },
  settingsSheet: {
    title: "Project settings",
    archivedBadge: "Archived",
    submit: "Save changes",
    cancel: "Cancel",
    section: {
      general: "General",
      privacy: "Privacy",
    },
    unsavedClose: {
      title: "Discard unsaved changes?",
      description: "You have unsaved changes to this project. Discard them and close settings?",
      confirm: "Discard changes",
    },
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
      description: "These actions affect every ticket in this project.",
      archive: {
        label: "Archive project",
        description: "New tickets are rejected. Existing tickets stay readable.",
        action: "Archive",
        actionRestore: "Restore",
      },
      delete: {
        label: "Delete project",
        description: "Permanently removes the project, its tickets and their files.",
        action: "Delete",
      },
    },
    deleteDialog: {
      title: (name: string) => `Delete "${name}"?`,
      description: () => "This project and all of its tickets will be permanently deleted. This cannot be undone.",
      confirm: "Delete",
    },
    archiveDialog: {
      title: (name: string) => `Archive "${name}"?`,
      description: (name: string) =>
        `${name} will stop accepting new bug reports. You can restore it later from project settings.`,
      confirm: "Archive",
    },
    restoreDialog: {
      title: (name: string) => `Restore "${name}"?`,
      description: (name: string) => `${name} will accept new bug reports again.`,
      confirm: "Restore",
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
  filter: {
    archive: {
      ariaLabel: "Показать проекты",
      active: "Активные",
      archived: "В архиве",
      all: "Все",
    },
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
    menu: "Действия с проектом",
    settings: "Настройки",
    openSdkSetup: "Открыть настройку SDK",
    archive: "В архив",
    restore: "Восстановить",
    delete: "Удалить",
    archivedStrip: "В архиве",
    openTickets: (count: number) => {
      const mod10 = count % 10;
      const mod100 = count % 100;
      if (mod10 === 1 && mod100 !== 11) return `${count} открыт`;
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} открыто`;
      return `${count} открытых`;
    },
    totalTickets: (count: number) => {
      const mod10 = count % 10;
      const mod100 = count % 100;
      if (mod10 === 1 && mod100 !== 11) return `${count} тикет`;
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} тикета`;
      return `${count} тикетов`;
    },
    noTicketsYet: "Тикетов пока нет",
    lastTicket: (relative: string) => `Последний ${relative}`,
    created: (dateLabel: string) => `Создан ${dateLabel}`,
    navigateToTickets: (name: string) => `Открыть тикеты проекта «${name}»`,
    archiveDialog: {
      title: (name: string) => `Отправить «${name}» в архив?`,
      description: (name: string) =>
        `Проект «${name}» перестанет принимать новые отчёты. Его можно восстановить в настройках проекта.`,
      confirm: "В архив",
    },
    restoreDialog: {
      title: (name: string) => `Восстановить «${name}»?`,
      description: (name: string) => `Проект «${name}» снова будет принимать новые отчёты.`,
      confirm: "Восстановить",
    },
    deleteDialog: {
      title: (name: string) => `Удалить «${name}»?`,
      description: () => "Проект и все его тикеты будут удалены без возможности восстановления.",
      confirm: "Удалить",
    },
    member: (name: string) => name,
    moreMembers: (count: number) => `+${count}`,
  },
  settingsSheet: {
    title: "Настройки проекта",
    archivedBadge: "В архиве",
    submit: "Сохранить изменения",
    cancel: "Отмена",
    section: {
      general: "Общие",
      privacy: "Конфиденциальность",
    },
    unsavedClose: {
      title: "Отменить несохранённые изменения?",
      description: "Есть несохранённые настройки проекта. Закрыть без сохранения?",
      confirm: "Отменить изменения",
    },
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
      description: "Эти действия затрагивают все тикеты в проекте.",
      archive: {
        label: "Архивировать проект",
        description: "Новые тикеты отклоняются. Существующие остаются доступны для чтения.",
        action: "В архив",
        actionRestore: "Восстановить",
      },
      delete: {
        label: "Удалить проект",
        description: "Проект, все тикеты и файлы будут удалены безвозвратно.",
        action: "Удалить",
      },
    },
    deleteDialog: {
      title: (name: string) => `Удалить «${name}»?`,
      description: () => "Проект и все его тикеты будут удалены без возможности восстановления.",
      confirm: "Удалить",
    },
    archiveDialog: {
      title: (name: string) => `Отправить «${name}» в архив?`,
      description: (name: string) =>
        `Проект «${name}» перестанет принимать новые отчёты. Его можно восстановить в настройках проекта.`,
      confirm: "В архив",
    },
    restoreDialog: {
      title: (name: string) => `Восстановить «${name}»?`,
      description: (name: string) => `Проект «${name}» снова будет принимать новые отчёты.`,
      confirm: "Восстановить",
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
