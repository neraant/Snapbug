import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  filter: {
    project: {
      ariaLabel: "Project",
      allProjects: "All projects",
    },
    period: {
      ariaLabel: "Time range",
      last7Days: "Last 7 days",
      last30Days: "Last 30 days",
      last90Days: "Last 90 days",
    },
  },
  stat: {
    comparisonPeriod: (periodDays: number) => `vs previous ${periodDays} days`,
    card: {
      newReport: {
        title: "New reports",
      },
      openIssue: {
        title: "Open issues",
        valueHint: "New + In progress",
      },
      criticalHighOpen: {
        title: "Critical & High open",
      },
      medianTimeToResolve: {
        title: "Median time to resolve",
      },
    },
  },
  chart: {
    reportsOverTime: {
      title: "Reports over time",
      description: "Daily created and resolved reports for the selected period.",
      seriesAriaLabel: "Chart series",
      series: {
        all: "All",
        created: "Created",
        resolved: "Resolved",
      },
      legend: {
        created: "Created",
        resolved: "Resolved",
      },
    },
    bySeverity: {
      title: "By severity",
      description: "New reports in the selected period, grouped by severity.",
      centerLabel: "Tickets",
      severityLabels: {
        critical: "Critical",
        high: "High",
        low: "Low",
        medium: "Medium",
      },
    },
    busiestHours: {
      title: "Busiest Hours Heatmap",
      description: "Distribution of report arrival times by day of week and hour of day (UTC)",
      weekdayLabels: {
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
        7: "Sun",
      },
      formatHourLabel: (hour: number) => `${hour}:00`,
      formatTooltip: (weekdayLabel: string, hour: number, count: number) =>
        `${weekdayLabel}, ${hour}:00 UTC — ${count} ${count === 1 ? "report" : "reports"}`,
      formatAccessibleName: (weekdayLabel: string, hour: number, count: number) =>
        `${weekdayLabel}, ${hour}:00 UTC, ${count} ${count === 1 ? "report" : "reports"}`,
      legendFewer: "Fewer reports",
      legendMore: "More reports",
    },
  },
  breakdown: {
    emptyList: "No reports in this period",
    byStatus: {
      title: "By status",
      description: "New reports in the selected period, grouped by status.",
      statusLabels: {
        new: "New",
        in_progress: "In progress",
        resolved: "Resolved",
        closed: "Closed",
      },
    },
    topPages: {
      title: "Top pages",
      description: "Pages with the most new reports in the selected period.",
      formatBugCount: (count: number) => (count === 1 ? "1 bug" : `${count} bugs`),
    },
    environment: {
      title: "Environment",
      description: "Where new reports came from in the selected period.",
      segmentAriaLabel: "Environment dimension",
      segmentLabels: {
        browser: "Browser",
        os: "OS",
        device: "Device",
      },
      formatShare: (count: number, total: number) => {
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        return `${count} (${percent}%)`;
      },
    },
  },
  activity: {
    recent: {
      title: "Recent Activity",
      description: "The 8 latest issues captured by Snapbug",
      viewAll: "View all tickets",
      empty: "No issues yet",
      unassigned: "Unassigned",
      severityLabels: {
        critical: "Critical",
        high: "High",
        medium: "Medium",
        low: "Low",
      },
    },
    workload: {
      title: "Team Workload",
      description: "Active open tickets assigned across engineers",
      empty: "No teammates",
      formatOpenCount: (count: number) => `${count} open`,
    },
  },
} as const;

const ru = {
  filter: {
    project: {
      ariaLabel: "Проект",
      allProjects: "Все проекты",
    },
    period: {
      ariaLabel: "Период",
      last7Days: "Последние 7 дней",
      last30Days: "Последние 30 дней",
      last90Days: "Последние 90 дней",
    },
  },
  stat: {
    comparisonPeriod: (periodDays: number) => `к предыдущим ${periodDays} дн.`,
    card: {
      newReport: {
        title: "Новые отчёты",
      },
      openIssue: {
        title: "Открытые проблемы",
        valueHint: "Новые + В работе",
      },
      criticalHighOpen: {
        title: "Открытые критические и высокие",
      },
      medianTimeToResolve: {
        title: "Медиана времени до решения",
      },
    },
  },
  chart: {
    reportsOverTime: {
      title: "Отчёты по времени",
      description: "Созданные и решённые отчёты по дням за выбранный период.",
      seriesAriaLabel: "Ряды графика",
      series: {
        all: "Все",
        created: "Создано",
        resolved: "Решено",
      },
      legend: {
        created: "Создано",
        resolved: "Решено",
      },
    },
    bySeverity: {
      title: "По важности",
      description: "Новые отчёты за выбранный период, сгруппированные по важности.",
      centerLabel: "Тикеты",
      severityLabels: {
        critical: "Критическая",
        high: "Высокая",
        low: "Низкая",
        medium: "Средняя",
      },
    },
    busiestHours: {
      title: "Тепловая карта часов",
      description: "Когда приходят отчёты: день недели и час (UTC)",
      weekdayLabels: {
        1: "Пн",
        2: "Вт",
        3: "Ср",
        4: "Чт",
        5: "Пт",
        6: "Сб",
        7: "Вс",
      },
      formatHourLabel: (hour: number) => `${hour}:00`,
      formatTooltip: (weekdayLabel: string, hour: number, count: number) =>
        `${weekdayLabel}, ${hour}:00 UTC — ${count} ${count === 1 ? "отчёт" : "отчётов"}`,
      formatAccessibleName: (weekdayLabel: string, hour: number, count: number) =>
        `${weekdayLabel}, ${hour}:00 UTC, ${count} ${count === 1 ? "отчёт" : "отчётов"}`,
      legendFewer: "Меньше отчётов",
      legendMore: "Больше отчётов",
    },
  },
  breakdown: {
    emptyList: "За этот период отчётов нет",
    byStatus: {
      title: "По статусу",
      description: "Новые отчёты за выбранный период, сгруппированные по статусу.",
      statusLabels: {
        new: "Новые",
        in_progress: "В работе",
        resolved: "Решено",
        closed: "Закрыто",
      },
    },
    topPages: {
      title: "Частые страницы",
      description: "Страницы с наибольшим числом новых отчётов за выбранный период.",
      formatBugCount: (count: number) => {
        const mod10 = count % 10;
        const mod100 = count % 100;
        if (mod10 === 1 && mod100 !== 11) return `${count} баг`;
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} бага`;
        return `${count} багов`;
      },
    },
    environment: {
      title: "Окружение",
      description: "Откуда пришли новые отчёты за выбранный период.",
      segmentAriaLabel: "Срез окружения",
      segmentLabels: {
        browser: "Браузер",
        os: "OS",
        device: "Устройство",
      },
      formatShare: (count: number, total: number) => {
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        return `${count} (${percent}%)`;
      },
    },
  },
  activity: {
    recent: {
      title: "Недавняя активность",
      description: "8 последних проблем, которые поймал Snapbug",
      viewAll: "Все тикеты",
      empty: "Проблем пока нет",
      unassigned: "Не назначен",
      severityLabels: {
        critical: "Критическая",
        high: "Высокая",
        medium: "Средняя",
        low: "Низкая",
      },
    },
    workload: {
      title: "Нагрузка команды",
      description: "Открытые тикеты, назначенные инженерам",
      empty: "Нет участников",
      formatOpenCount: (count: number) => `${count} открыто`,
    },
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
