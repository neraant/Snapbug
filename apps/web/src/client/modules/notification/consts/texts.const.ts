import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  bell: {
    label: "Notifications",
    labelUnread: (count: number) => {
      const n = count > 9 ? "9+" : String(count);
      return `Notifications, ${n} unread`;
    },
    settings: "Notification settings",
    markAllRead: "Mark all as read",
    viewAll: "View all notifications",
    unreadBadge: (count: number) => (count > 9 ? "9+" : String(count)),
  },
  popover: {
    title: "Notifications",
    tabsAria: "Notification filters",
    unread: "Unread",
    all: "All",
  },
  inbox: {
    title: "Notifications",
    description: "Updates about tickets, comments, your team, and security.",
    typeFilterLabel: "Filter by type",
    typeAll: "All",
    typeTicket: "Tickets",
    typeComment: "Comments",
    typeTeam: "Team",
    typeSecurity: "Security",
    tabsAria: "Notification filters",
    bulkMarkRead: "Mark read",
    bulkArchive: "Archive",
    bulkCancel: "Cancel",
    bulkSelected: (count: number) => `${count} selected`,
    selectMode: "Select",
    selectCancel: "Cancel",
  },
  item: {
    menuLabel: "Notification actions",
    markRead: "Mark as read",
    markUnread: "Mark as unread",
    archive: "Archive",
    unavailable: "This item is no longer available",
    select: (id: string) => `Select notification ${id}`,
    open: (summary: string) => `Open notification: ${summary}`,
  },
  empty: {
    unread: "You're all caught up",
    all: "No notifications yet",
  },
  day: {
    today: "Today",
    earlier: "Earlier",
  },
  error: {
    list: "Could not load notifications.",
    retry: "Retry",
  },
  settings: {
    saved: "Saved",
    matrix: {
      sectionTitle: "Notification types",
      sectionDescription: "Choose how you are notified for each category. Changes save automatically.",
      inApp: "In-app",
      email: "Email",
      lockedTooltip: "Always on for your security",
    },
    rows: {
      assigned_to_me: {
        title: "Assigned to me",
        description: "When someone assigns a ticket to you",
      },
      new_tickets_in_my_projects: {
        title: "New tickets in my projects",
        description: "When a new report arrives in a project you can access",
      },
      status_changes_on_my_tickets: {
        title: "Status changes on my tickets",
        description: "When status changes on tickets you follow or are assigned to",
      },
      comments_on_followed_tickets: {
        title: "Comments on tickets I follow",
        description: "When someone comments on a ticket you participate in",
      },
      project_access_and_role_changes: {
        title: "Project access and role changes",
        description: "When your project access or role in the organization changes",
      },
      team_invitation_accepted: {
        title: "Team: invitation accepted",
        description: "When someone accepts an invitation and joins your team",
      },
      project_archived_or_restored: {
        title: "Project archived or restored",
        description: "When a project you can access is archived or restored",
      },
      security: {
        title: "Security: API key rotated, new token created",
        description: "When API keys are rotated or a new personal access token is created",
      },
    },
    mute: {
      sectionTitle: "Mute projects",
      sectionDescription: "Mute notifications from selected projects. Applies to ticket-related types above.",
      projectCheckbox: (name: string) => `Mute ${name}`,
      empty: "No projects available",
    },
    digest: {
      sectionTitle: "Email digest",
      sectionDescription: "How often we send email when email notifications are enabled.",
      label: "Send emails",
      immediate: "Immediately",
      hourly: "Hourly digest",
      daily: "Daily digest (09:00 in my time zone)",
    },
    switch: {
      inApp: (title: string) => `In-app: ${title}`,
      email: (title: string) => `Email: ${title}`,
    },
    toast: {
      error: "Could not save notification settings.",
    },
  },
  message: {
    ticketAssigned: (actor: string, ticketId: string, title: string) => ({
      parts: [
        { text: actor, bold: true },
        { text: " assigned you " },
        { text: ticketId, bold: true },
        { text: ` ${title}` },
      ],
    }),
    ticketCreated: (ticketId: string, title: string) => ({
      parts: [{ text: "New ticket " }, { text: ticketId, bold: true }, { text: ` ${title}` }],
    }),
    ticketStatusChanged: (actor: string, ticketId: string, status: string) => ({
      parts: [
        { text: actor, bold: true },
        { text: " changed " },
        { text: ticketId, bold: true },
        { text: ` to ${status}` },
      ],
    }),
    ticketStatusChangedGrouped: (count: number, ticketId: string) => ({
      parts: [{ text: String(count), bold: true }, { text: ` status updates on ` }, { text: ticketId, bold: true }],
    }),
    commentCreated: (actor: string, ticketId: string) => ({
      parts: [{ text: actor, bold: true }, { text: " commented on " }, { text: ticketId, bold: true }],
    }),
    commentCreatedGrouped: (count: number, ticketId: string) => ({
      parts: [{ text: String(count), bold: true }, { text: " new comments on " }, { text: ticketId, bold: true }],
    }),
    membershipRoleChanged: (actor: string, member: string, role: string) => ({
      parts: [
        { text: actor, bold: true },
        { text: " changed " },
        { text: member, bold: true },
        { text: `'s role to ${role}` },
      ],
    }),
    projectAccessGranted: (actor: string, project: string) => ({
      parts: [{ text: actor, bold: true }, { text: " granted you access to " }, { text: project, bold: true }],
    }),
    projectAccessRevoked: (actor: string, project: string) => ({
      parts: [{ text: actor, bold: true }, { text: " revoked your access to " }, { text: project, bold: true }],
    }),
    invitationAccepted: (member: string) => ({
      parts: [{ text: member, bold: true }, { text: " joined your team" }],
    }),
    projectArchived: (project: string, restored: boolean) => ({
      parts: restored
        ? [{ text: "Project " }, { text: project, bold: true }, { text: " was restored" }]
        : [{ text: "Project " }, { text: project, bold: true }, { text: " was archived" }],
    }),
    securityApiKeyRotated: (project: string) => ({
      parts: [{ text: "API key rotated for " }, { text: project, bold: true }],
    }),
    securityTokenCreated: (token: string) => ({
      parts: [{ text: "New access token " }, { text: token, bold: true }, { text: " was created" }],
    }),
    fallback: (type: string) => ({
      parts: [{ text: type }],
    }),
  },
} as const;

const ru = {
  bell: {
    label: "Уведомления",
    labelUnread: (count: number) => {
      const n = count > 9 ? "9+" : String(count);
      return `Уведомления, ${n} непрочитанных`;
    },
    settings: "Настройки уведомлений",
    markAllRead: "Отметить все как прочитанные",
    viewAll: "Все уведомления",
    unreadBadge: (count: number) => (count > 9 ? "9+" : String(count)),
  },
  popover: {
    title: "Уведомления",
    tabsAria: "Фильтры уведомлений",
    unread: "Непрочитанные",
    all: "Все",
  },
  inbox: {
    title: "Уведомления",
    description: "Обновления по тикетам, комментариям, команде и безопасности.",
    typeFilterLabel: "Фильтр по типу",
    typeAll: "Все",
    typeTicket: "Тикеты",
    typeComment: "Комментарии",
    typeTeam: "Команда",
    typeSecurity: "Безопасность",
    tabsAria: "Фильтры уведомлений",
    bulkMarkRead: "Прочитано",
    bulkArchive: "В архив",
    bulkCancel: "Отмена",
    bulkSelected: (count: number) => `Выбрано: ${count}`,
    selectMode: "Выбрать",
    selectCancel: "Отмена",
  },
  item: {
    menuLabel: "Действия с уведомлением",
    markRead: "Прочитано",
    markUnread: "Непрочитано",
    archive: "В архив",
    unavailable: "Этот объект больше недоступен",
    select: (id: string) => `Выбрать уведомление ${id}`,
    open: (summary: string) => `Открыть уведомление: ${summary}`,
  },
  empty: {
    unread: "Вы всё просмотрели",
    all: "Уведомлений пока нет",
  },
  day: {
    today: "Сегодня",
    earlier: "Ранее",
  },
  error: {
    list: "Не удалось загрузить уведомления.",
    retry: "Повторить",
  },
  settings: {
    saved: "Сохранено",
    matrix: {
      sectionTitle: "Типы уведомлений",
      sectionDescription: "Выберите способ уведомления для каждой категории. Изменения сохраняются автоматически.",
      inApp: "В приложении",
      email: "Email",
      lockedTooltip: "Всегда включено для вашей безопасности",
    },
    rows: {
      assigned_to_me: {
        title: "Назначено мне",
        description: "Когда кто-то назначает вам тикет",
      },
      new_tickets_in_my_projects: {
        title: "Новые тикеты в моих проектах",
        description: "Когда в доступном вам проекте появляется новый отчёт",
      },
      status_changes_on_my_tickets: {
        title: "Смена статуса моих тикетов",
        description: "Когда меняется статус тикетов, за которыми вы следите или которые назначены вам",
      },
      comments_on_followed_tickets: {
        title: "Комментарии к тикетам, за которыми я слежу",
        description: "Когда кто-то комментирует тикет, в котором вы участвуете",
      },
      project_access_and_role_changes: {
        title: "Доступ к проектам и смена роли",
        description: "Когда меняется ваш доступ к проекту или роль в организации",
      },
      team_invitation_accepted: {
        title: "Команда: приглашение принято",
        description: "Когда кто-то принимает приглашение и присоединяется к команде",
      },
      project_archived_or_restored: {
        title: "Проект архивирован или восстановлен",
        description: "Когда проект, к которому у вас есть доступ, архивируют или восстанавливают",
      },
      security: {
        title: "Безопасность: смена API-ключа, новый токен",
        description: "Когда меняют API-ключи или создают новый личный токен доступа",
      },
    },
    mute: {
      sectionTitle: "Заглушить проекты",
      sectionDescription: "Заглушить уведомления от выбранных проектов. Относится к типам, связанным с тикетами, выше.",
      projectCheckbox: (name: string) => `Заглушить ${name}`,
      empty: "Нет доступных проектов",
    },
    digest: {
      sectionTitle: "Сводка по email",
      sectionDescription: "Как часто отправлять письма, когда включены email-уведомления.",
      label: "Отправлять письма",
      immediate: "Сразу",
      hourly: "Раз в час",
      daily: "Раз в день (09:00 в вашем часовом поясе)",
    },
    switch: {
      inApp: (title: string) => `В приложении: ${title}`,
      email: (title: string) => `Email: ${title}`,
    },
    toast: {
      error: "Не удалось сохранить настройки уведомлений.",
    },
  },
  message: {
    ticketAssigned: (actor: string, ticketId: string, title: string) => ({
      parts: [
        { text: actor, bold: true },
        { text: " назначил(а) вам " },
        { text: ticketId, bold: true },
        { text: ` ${title}` },
      ],
    }),
    ticketCreated: (ticketId: string, title: string) => ({
      parts: [{ text: "Новый тикет " }, { text: ticketId, bold: true }, { text: ` ${title}` }],
    }),
    ticketStatusChanged: (actor: string, ticketId: string, status: string) => ({
      parts: [
        { text: actor, bold: true },
        { text: " изменил(а) статус " },
        { text: ticketId, bold: true },
        { text: ` на ${status}` },
      ],
    }),
    ticketStatusChangedGrouped: (count: number, ticketId: string) => ({
      parts: [{ text: String(count), bold: true }, { text: ` обновления статуса у ` }, { text: ticketId, bold: true }],
    }),
    commentCreated: (actor: string, ticketId: string) => ({
      parts: [{ text: actor, bold: true }, { text: " прокомментировал(а) " }, { text: ticketId, bold: true }],
    }),
    commentCreatedGrouped: (count: number, ticketId: string) => ({
      parts: [{ text: String(count), bold: true }, { text: " новых комментария к " }, { text: ticketId, bold: true }],
    }),
    membershipRoleChanged: (actor: string, member: string, role: string) => ({
      parts: [
        { text: actor, bold: true },
        { text: " изменил(а) роль " },
        { text: member, bold: true },
        { text: ` на ${role}` },
      ],
    }),
    projectAccessGranted: (actor: string, project: string) => ({
      parts: [{ text: actor, bold: true }, { text: " дал(а) вам доступ к " }, { text: project, bold: true }],
    }),
    projectAccessRevoked: (actor: string, project: string) => ({
      parts: [{ text: actor, bold: true }, { text: " забрал(а) доступ к " }, { text: project, bold: true }],
    }),
    invitationAccepted: (member: string) => ({
      parts: [{ text: member, bold: true }, { text: " присоединился(ась) к команде" }],
    }),
    projectArchived: (project: string, restored: boolean) => ({
      parts: restored
        ? [{ text: "Проект " }, { text: project, bold: true }, { text: " восстановлен" }]
        : [{ text: "Проект " }, { text: project, bold: true }, { text: " архивирован" }],
    }),
    securityApiKeyRotated: (project: string) => ({
      parts: [{ text: "Ключ API для " }, { text: project, bold: true }, { text: " обновлён" }],
    }),
    securityTokenCreated: (token: string) => ({
      parts: [{ text: "Создан токен доступа " }, { text: token, bold: true }],
    }),
    fallback: (type: string) => ({
      parts: [{ text: type }],
    }),
  },
} as const;

export type NotificationMessagePart = {
  text: string;
  bold?: boolean;
};

export type NotificationMessageContent = {
  parts: NotificationMessagePart[];
};

export const texts: typeof en = localize(en, ru as never);
