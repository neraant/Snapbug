import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  issue: {
    descriptionTitle: "Issue description",
    emptyDescription: "No description provided.",
  },
  comments: {
    title: "Comments",
    description: "Internal notes for the team. The report author does not see them.",
    empty: "No comments yet.",
    fieldLabel: "Comment",
    submit: "Add comment",
    unknownAuthor: "Teammate",
    submitError: "Could not add the comment.",
  },
  screenshot: {
    title: "Screenshot",
    empty: "No screenshot attached.",
    imageAlt: "Bug report screenshot",
  },
  replay: {
    title: "Session replay",
    empty: "No session replay attached.",
    loadFailed: "Could not load session replay.",
    playSession: "Play session replay",
  },
  diagnostics: {
    title: "Technical diagnostics",
    console: "Console",
    network: "Network",
    customContext: "Custom context",
    emptyConsole: "No console logs captured.",
    emptyNetwork: "No network logs captured.",
    emptyCustomContext: "No custom context provided.",
    ariaLabel: "Diagnostics view",
  },
  sidebar: {
    propertiesTitle: "Ticket properties",
    environmentTitle: "Client environment",
    status: "Status",
    severity: "Severity",
    assignee: "Assignee",
    project: "Project",
    reporter: "Reporter",
    created: "Created",
    updated: "Last updated",
    browser: "Browser",
    os: "OS",
    device: "Device",
    viewport: "Viewport",
    pageUrl: "Page URL",
    unassigned: "Unassigned",
    copyUrl: "Copy URL",
    copiedUrl: "Copied",
  },
  header: {
    statusAriaLabel: "Ticket status",
    severityAriaLabel: "Ticket severity",
  },
  statusLabels: {
    [BugReportStatus.NEW]: "New",
    [BugReportStatus.IN_PROGRESS]: "In progress",
    [BugReportStatus.RESOLVED]: "Resolved",
    [BugReportStatus.CLOSED]: "Closed",
  },
  severityLabels: {
    [BugReportSeverity.CRITICAL]: "Critical",
    [BugReportSeverity.HIGH]: "High",
    [BugReportSeverity.MEDIUM]: "Medium",
    [BugReportSeverity.LOW]: "Low",
  },
  toast: {
    statusUpdated: "Ticket status updated",
    severityUpdated: "Ticket severity updated",
    updateFailed: "Could not update ticket",
  },
} as const;

const ru = {
  issue: {
    descriptionTitle: "Описание проблемы",
    emptyDescription: "Описание не указано.",
  },
  comments: {
    title: "Комментарии",
    description: "Внутренние заметки для команды. Автор отчёта их не видит.",
    empty: "Комментариев пока нет.",
    fieldLabel: "Комментарий",
    submit: "Добавить комментарий",
    unknownAuthor: "Участник",
    submitError: "Не удалось добавить комментарий.",
  },
  screenshot: {
    title: "Скриншот",
    empty: "Скриншот не приложен.",
    imageAlt: "Скриншот отчёта об ошибке",
  },
  replay: {
    title: "Запись сессии",
    empty: "Запись сессии не приложена.",
    loadFailed: "Не удалось загрузить запись сессии.",
    playSession: "Воспроизвести запись сессии",
  },
  diagnostics: {
    title: "Техническая диагностика",
    console: "Консоль",
    network: "Сеть",
    customContext: "Пользовательский контекст",
    emptyConsole: "Логи консоли не записаны.",
    emptyNetwork: "Сетевые логи не записаны.",
    emptyCustomContext: "Пользовательский контекст не передан.",
    ariaLabel: "Вид диагностики",
  },
  sidebar: {
    propertiesTitle: "Свойства тикета",
    environmentTitle: "Окружение клиента",
    status: "Статус",
    severity: "Важность",
    assignee: "Исполнитель",
    project: "Проект",
    reporter: "Автор",
    created: "Создан",
    updated: "Обновлён",
    browser: "Браузер",
    os: "OS",
    device: "Устройство",
    viewport: "Область просмотра",
    pageUrl: "URL страницы",
    unassigned: "Не назначен",
    copyUrl: "Копировать URL",
    copiedUrl: "Скопировано",
  },
  header: {
    statusAriaLabel: "Статус тикета",
    severityAriaLabel: "Важность тикета",
  },
  statusLabels: {
    [BugReportStatus.NEW]: "Новые",
    [BugReportStatus.IN_PROGRESS]: "В работе",
    [BugReportStatus.RESOLVED]: "Решено",
    [BugReportStatus.CLOSED]: "Закрыто",
  },
  severityLabels: {
    [BugReportSeverity.CRITICAL]: "Критическая",
    [BugReportSeverity.HIGH]: "Высокая",
    [BugReportSeverity.MEDIUM]: "Средняя",
    [BugReportSeverity.LOW]: "Низкая",
  },
  toast: {
    statusUpdated: "Статус тикета обновлён",
    severityUpdated: "Важность тикета обновлена",
    updateFailed: "Не удалось обновить тикет",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
