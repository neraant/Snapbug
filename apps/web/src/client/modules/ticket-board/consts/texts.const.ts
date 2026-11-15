import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "Tickets",
  description: "Bug reports with screenshots and session replay from your apps.",
  filter: {
    searchPlaceholder: "Search by title or ID",
    searchAriaLabel: "Search tickets",
    searchClear: "Clear search",
    severity: {
      ariaLabel: "Severity",
      placeholder: "All severities",
    },
    status: {
      ariaLabel: "Status",
      placeholder: "All statuses",
    },
    period: {
      ariaLabel: "Period",
      all: "All time",
      last7Days: "Last 7 days",
      last30Days: "Last 30 days",
      last90Days: "Last 90 days",
    },
    clear: "Clear filters",
  },
  column: {
    [BugReportStatus.NEW]: {
      label: "New",
      hint: "Newly submitted bug reports waiting for triage.",
      empty: "No new reports",
    },
    [BugReportStatus.IN_PROGRESS]: {
      label: "In progress",
      hint: "Reports your team is actively working on.",
      empty: "Nothing in progress",
    },
    [BugReportStatus.RESOLVED]: {
      label: "Resolved",
      hint: "Fixed reports pending verification or closure.",
      empty: "No resolved reports",
    },
    [BugReportStatus.CLOSED]: {
      label: "Closed",
      hint: "Completed or archived bug reports.",
      empty: "No closed reports",
    },
    loadMore: "Load more",
  },
  card: {
    unassigned: "Unassigned",
    screenshot: "Screenshot attached",
    replay: "Session replay available",
  },
  severityLabels: {
    [BugReportSeverity.CRITICAL]: "Critical",
    [BugReportSeverity.HIGH]: "High",
    [BugReportSeverity.MEDIUM]: "Medium",
    [BugReportSeverity.LOW]: "Low",
  },
  empty: {
    noReportsTitle: "No bug reports yet",
    noReportsDescription: "Install the SDK and send your first report from the widget.",
    sdkSetupLink: "Go to SDK setup",
    filteredTitle: "No tickets match your filters",
    filteredDescription: "Try adjusting search, status, severity, or the time range.",
  },
  error: {
    title: "Could not load tickets",
    description: "Check your connection and try again.",
    retry: "Retry",
  },
  toast: {
    statusUpdated: "Ticket status updated",
    updateFailed: "Could not update ticket status",
  },
} as const;

const ru = {
  title: "Тикеты",
  description: "Отчёты об ошибках со скриншотами и записью сессии из ваших приложений.",
  filter: {
    searchPlaceholder: "Поиск по названию или ID",
    searchAriaLabel: "Поиск тикетов",
    searchClear: "Очистить поиск",
    severity: {
      ariaLabel: "Важность",
      placeholder: "Все уровни",
    },
    status: {
      ariaLabel: "Статус",
      placeholder: "Все статусы",
    },
    period: {
      ariaLabel: "Период",
      all: "Всё время",
      last7Days: "Последние 7 дней",
      last30Days: "Последние 30 дней",
      last90Days: "Последние 90 дней",
    },
    clear: "Сбросить фильтры",
  },
  column: {
    [BugReportStatus.NEW]: {
      label: "Новые",
      hint: "Новые отчёты, которые ещё ждут разбора.",
      empty: "Новых отчётов нет",
    },
    [BugReportStatus.IN_PROGRESS]: {
      label: "В работе",
      hint: "Отчёты, над которыми команда сейчас работает.",
      empty: "В работе ничего нет",
    },
    [BugReportStatus.RESOLVED]: {
      label: "Решено",
      hint: "Исправленные отчёты ждут проверки или закрытия.",
      empty: "Решённых отчётов нет",
    },
    [BugReportStatus.CLOSED]: {
      label: "Закрыто",
      hint: "Завершённые или архивные отчёты.",
      empty: "Закрытых отчётов нет",
    },
    loadMore: "Загрузить ещё",
  },
  card: {
    unassigned: "Не назначен",
    screenshot: "Есть скриншот",
    replay: "Есть запись сессии",
  },
  severityLabels: {
    [BugReportSeverity.CRITICAL]: "Критическая",
    [BugReportSeverity.HIGH]: "Высокая",
    [BugReportSeverity.MEDIUM]: "Средняя",
    [BugReportSeverity.LOW]: "Низкая",
  },
  empty: {
    noReportsTitle: "Отчётов пока нет",
    noReportsDescription: "Установите SDK и отправьте первый отчёт из виджета.",
    sdkSetupLink: "К настройке SDK",
    filteredTitle: "Нет тикетов по этим фильтрам",
    filteredDescription: "Измените поиск, статус, важность или период.",
  },
  error: {
    title: "Не удалось загрузить тикеты",
    description: "Проверьте соединение и попробуйте ещё раз.",
    retry: "Повторить",
  },
  toast: {
    statusUpdated: "Статус тикета обновлён",
    updateFailed: "Не удалось обновить статус тикета",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
