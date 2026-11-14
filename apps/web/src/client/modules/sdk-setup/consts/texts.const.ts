import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "Set up the SDK",
  description: "Add the Snapbug widget to your app so users can report bugs with screenshots, session replay and logs.",
  docsLink: "Read the docs",
  docsHref: "https://github.com/neraant/Snapbug",
  selectProject: "Select a project in the sidebar to view install steps and the API key for that project.",
  install: {
    title: "1. Install the package",
    description: "Choose your preferred package manager or embed our lightweight CDN script tag.",
    copy: "Copy",
    copied: "Copied",
    tabs: {
      npm: "npm",
      pnpm: "pnpm",
      yarn: "yarn",
      script: "Script tag",
    },
    panelTitle: {
      terminal: "Terminal",
      script: "index.html",
    },
  },
  init: {
    title: "2. Initialize the widget",
    description: "Paste into your application root. Use your project API key and ingestion host.",
    tip: "Call snapbug.init once during client-side hydration. No server-side runtime code is required.",
    tabs: {
      react: "React",
      next: "Next.js",
    },
    panelTitle: {
      react: "src/App.tsx",
      next: "app/providers.tsx",
    },
  },
  apiKey: {
    title: "Project API Key",
    label: "Public Ingestion Key",
    copy: "Copy",
    copied: "Copied",
    created: (date: string) => `Created: ${date}`,
    rotate: "Rotate key",
    rotateTitle: "Rotate project key",
    rotateDescription: "This issues a new key and stops the previous key immediately.",
    confirm: "Rotate key",
    cancel: "Cancel",
    revealedTitle: "New project key",
    revealedDescription: "Copy this key into your app. It is shown here once. The previous key has stopped working.",
    close: "Done",
    rotateError: "Could not rotate the project key. Please try again.",
  },
  widgetSettings: {
    title: "Widget settings",
    description: "Configure how the Snapbug trigger looks and what data is masked before reports leave the browser.",
    position: {
      label: "Trigger position",
      bottomRight: "Bottom right",
      bottomLeft: "Bottom left",
    },
    buttonLabel: {
      label: "Trigger button label",
    },
    theme: {
      label: "Theme",
      auto: "Auto",
      light: "Light",
      dark: "Dark",
    },
    accent: {
      label: "Accent color",
      swatchLabel: (color: string) => `Use accent ${color}`,
    },
    background: {
      label: "Popup background",
    },
    text: {
      label: "Popup text",
    },
    mutedText: {
      label: "Muted text",
    },
    hexColor: {
      clear: "Reset",
      defaultHint: "Default",
      hueSlider: "Hue",
      hexInput: "Hex color",
    },
    font: {
      label: "Font",
      default: "Default",
      systemUi: "System",
      georgia: "Georgia",
      monospace: "Mono",
    },
    domainsAndMaskingAdmin: "Only an administrator can change domains and masking.",
    allowedDomains: {
      label: "Allowed domains",
      description: "Hosts that may submit bug reports from the widget. Leave empty to allow any origin.",
      placeholder: "Add domain",
      removeTag: (domain: string) => `Remove ${domain}`,
    },
    privacy: {
      heading: "Privacy",
      maskText: {
        label: "Mask text",
        description: "Hide visible page text in session replay and strip it from report logs.",
      },
      maskInputs: {
        label: "Mask inputs",
        description: "Hide input values in session replay and strip them from report logs.",
      },
      blockSelectors: {
        label: "Block CSS selectors",
        description: "Leave matching elements out of session replay and out of the log redaction scan.",
        placeholder: "Add selector",
        removeTag: (selector: string) => `Remove ${selector}`,
      },
    },
  },
  testReport: {
    title: "3. Test report",
    description: "Send a sample report from your app to confirm the widget reaches Snapbug.",
    connection: {
      connected: "Connected",
      waiting: "Waiting for a test report from your site.",
      notConnected: "Not connected",
    },
  },
} as const;

const ru = {
  title: "Настройка SDK",
  description:
    "Добавьте виджет Snapbug в приложение, чтобы пользователи сообщали о багах со скриншотом, записью сессии и логами.",
  docsLink: "Документация",
  docsHref: "https://github.com/neraant/Snapbug",
  selectProject: "Выберите проект в боковой панели, чтобы увидеть шаги установки и API-ключ этого проекта.",
  install: {
    title: "1. Установите пакет",
    description: "Выберите менеджер пакетов или вставьте лёгкий CDN-тег script.",
    copy: "Копировать",
    copied: "Скопировано",
    tabs: {
      npm: "npm",
      pnpm: "pnpm",
      yarn: "yarn",
      script: "Тег script",
    },
    panelTitle: {
      terminal: "Терминал",
      script: "index.html",
    },
  },
  init: {
    title: "2. Инициализируйте виджет",
    description: "Вставьте в корень приложения. Укажите API-ключ проекта и хост приёма.",
    tip: "Вызовите snapbug.init один раз при гидратации на клиенте. Серверный рантайм не нужен.",
    tabs: {
      react: "React",
      next: "Next.js",
    },
    panelTitle: {
      react: "src/App.tsx",
      next: "app/providers.tsx",
    },
  },
  apiKey: {
    title: "API-ключ проекта",
    label: "Публичный ключ приёма",
    copy: "Копировать",
    copied: "Скопировано",
    created: (date: string) => `Создан: ${date}`,
    rotate: "Сменить ключ",
    rotateTitle: "Смена ключа проекта",
    rotateDescription: "Будет выпущен новый ключ, а предыдущий сразу перестанет работать.",
    confirm: "Сменить ключ",
    cancel: "Отмена",
    revealedTitle: "Новый ключ проекта",
    revealedDescription: "Скопируйте ключ в приложение. Он показан здесь один раз. Предыдущий ключ больше не работает.",
    close: "Готово",
    rotateError: "Не удалось сменить ключ проекта. Попробуйте ещё раз.",
  },
  widgetSettings: {
    title: "Настройки виджета",
    description: "Как выглядит кнопка Snapbug и какие данные маскируются до отправки отчёта из браузера.",
    position: {
      label: "Положение кнопки",
      bottomRight: "Снизу справа",
      bottomLeft: "Снизу слева",
    },
    buttonLabel: {
      label: "Подпись кнопки",
    },
    theme: {
      label: "Тема",
      auto: "Авто",
      light: "Светлая",
      dark: "Тёмная",
    },
    accent: {
      label: "Акцентный цвет",
      swatchLabel: (color: string) => `Акцент ${color}`,
    },
    background: {
      label: "Фон окна",
    },
    text: {
      label: "Текст окна",
    },
    mutedText: {
      label: "Приглушённый текст",
    },
    hexColor: {
      clear: "Сбросить",
      defaultHint: "По умолчанию",
      hueSlider: "Оттенок",
      hexInput: "Цвет в hex",
    },
    font: {
      label: "Шрифт",
      default: "По умолчанию",
      systemUi: "Системный",
      georgia: "Georgia",
      monospace: "Моно",
    },
    domainsAndMaskingAdmin: "Домены и маскирование может менять только администратор.",
    allowedDomains: {
      label: "Разрешённые домены",
      description: "Хосты, с которых виджет может отправлять отчёты. Пустой список разрешает любой origin.",
      placeholder: "Добавить домен",
      removeTag: (domain: string) => `Удалить ${domain}`,
    },
    privacy: {
      heading: "Конфиденциальность",
      maskText: {
        label: "Маскировать текст",
        description: "Скрывать видимый текст страницы в записи сессии и убирать его из логов отчёта.",
      },
      maskInputs: {
        label: "Маскировать поля",
        description: "Скрывать значения полей в записи сессии и убирать их из логов отчёта.",
      },
      blockSelectors: {
        label: "Исключить CSS-селекторы",
        description: "Не включать совпавшие элементы в запись сессии и в проверку маскирования логов.",
        placeholder: "Добавить селектор",
        removeTag: (selector: string) => `Удалить ${selector}`,
      },
    },
  },
  testReport: {
    title: "3. Тестовый отчёт",
    description: "Отправьте пробный отчёт из приложения и убедитесь, что виджет достучался до Snapbug.",
    connection: {
      connected: "Подключено",
      waiting: "Ждём тестовый отчёт с вашего сайта.",
      notConnected: "Нет подключения",
    },
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
