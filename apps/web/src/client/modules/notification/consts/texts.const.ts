import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  bell: {
    label: "Notifications",
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
    bulkClear: "Clear selection",
    bulkSelected: (count: number) => `${count} selected`,
  },
  item: {
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
      parts: [
        { text: "New ticket " },
        { text: ticketId, bold: true },
        { text: ` ${title}` },
      ],
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
      parts: [
        { text: String(count), bold: true },
        { text: ` status updates on ` },
        { text: ticketId, bold: true },
      ],
    }),
    commentCreated: (actor: string, ticketId: string) => ({
      parts: [
        { text: actor, bold: true },
        { text: " commented on " },
        { text: ticketId, bold: true },
      ],
    }),
    commentCreatedGrouped: (count: number, ticketId: string) => ({
      parts: [
        { text: String(count), bold: true },
        { text: " new comments on " },
        { text: ticketId, bold: true },
      ],
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
      parts: [
        { text: actor, bold: true },
        { text: " granted you access to " },
        { text: project, bold: true },
      ],
    }),
    projectAccessRevoked: (actor: string, project: string) => ({
      parts: [
        { text: actor, bold: true },
        { text: " revoked your access to " },
        { text: project, bold: true },
      ],
    }),
    invitationAccepted: (member: string) => ({
      parts: [
        { text: member, bold: true },
        { text: " joined your team" },
      ],
    }),
    projectArchived: (project: string, restored: boolean) => ({
      parts: restored
        ? [
            { text: "Project " },
            { text: project, bold: true },
            { text: " was restored" },
          ]
        : [
            { text: "Project " },
            { text: project, bold: true },
            { text: " was archived" },
          ],
    }),
    securityApiKeyRotated: (project: string) => ({
      parts: [
        { text: "API key rotated for " },
        { text: project, bold: true },
      ],
    }),
    securityTokenCreated: (token: string) => ({
      parts: [
        { text: "New access token " },
        { text: token, bold: true },
        { text: " was created" },
      ],
    }),
    fallback: (type: string) => ({
      parts: [{ text: type }],
    }),
  },
} as const;

const ru = {
  bell: {
    label: "Уведомления",
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
    bulkClear: "Сбросить выбор",
    bulkSelected: (count: number) => `Выбрано: ${count}`,
  },
  item: {
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
      parts: [
        { text: "Новый тикет " },
        { text: ticketId, bold: true },
        { text: ` ${title}` },
      ],
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
      parts: [
        { text: String(count), bold: true },
        { text: ` обновления статуса у ` },
        { text: ticketId, bold: true },
      ],
    }),
    commentCreated: (actor: string, ticketId: string) => ({
      parts: [
        { text: actor, bold: true },
        { text: " прокомментировал(а) " },
        { text: ticketId, bold: true },
      ],
    }),
    commentCreatedGrouped: (count: number, ticketId: string) => ({
      parts: [
        { text: String(count), bold: true },
        { text: " новых комментария к " },
        { text: ticketId, bold: true },
      ],
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
      parts: [
        { text: actor, bold: true },
        { text: " дал(а) вам доступ к " },
        { text: project, bold: true },
      ],
    }),
    projectAccessRevoked: (actor: string, project: string) => ({
      parts: [
        { text: actor, bold: true },
        { text: " забрал(а) доступ к " },
        { text: project, bold: true },
      ],
    }),
    invitationAccepted: (member: string) => ({
      parts: [
        { text: member, bold: true },
        { text: " присоединился(ась) к команде" },
      ],
    }),
    projectArchived: (project: string, restored: boolean) => ({
      parts: restored
        ? [
            { text: "Проект " },
            { text: project, bold: true },
            { text: " восстановлен" },
          ]
        : [
            { text: "Проект " },
            { text: project, bold: true },
            { text: " архивирован" },
          ],
    }),
    securityApiKeyRotated: (project: string) => ({
      parts: [
        { text: "Ключ API для " },
        { text: project, bold: true },
        { text: " обновлён" },
      ],
    }),
    securityTokenCreated: (token: string) => ({
      parts: [
        { text: "Создан токен доступа " },
        { text: token, bold: true },
      ],
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