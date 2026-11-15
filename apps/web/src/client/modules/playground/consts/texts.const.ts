import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  sample: {
    title: "Sample checkout",
    description: "A customer page. The widget on this page is the real Snapbug widget.",
    email: "Email",
    pay: "Pay",
  },
  capture: {
    screenshotTitle: "Screenshot",
    screenshotEmpty: "No screenshot attached.",
    screenshotAlt: "Bug report screenshot",
    replayTitle: "Session replay",
    replayEmpty: "No session replay attached.",
    playSession: "Play session replay",
    environmentTitle: "Client environment",
    browser: "Browser",
    os: "OS",
    device: "Device",
    viewport: "Viewport",
    pageUrl: "Page URL",
    diagnosticsTitle: "Technical diagnostics",
    console: "Console",
    network: "Network",
    emptyConsole: "No console logs captured.",
    emptyNetwork: "No network logs captured.",
    diagnosticsAria: "Diagnostics view",
  },
} as const;

const ru = {
  sample: {
    title: "Пример оформления заказа",
    description: "Страница клиента. Виджет на этой странице — настоящий виджет Snapbug.",
    email: "Email",
    pay: "Оплатить",
  },
  capture: {
    screenshotTitle: "Скриншот",
    screenshotEmpty: "Скриншот не приложен.",
    screenshotAlt: "Скриншот отчёта об ошибке",
    replayTitle: "Запись сессии",
    replayEmpty: "Запись сессии не приложена.",
    playSession: "Воспроизвести запись сессии",
    environmentTitle: "Окружение клиента",
    browser: "Браузер",
    os: "ОС",
    device: "Устройство",
    viewport: "Область просмотра",
    pageUrl: "URL страницы",
    diagnosticsTitle: "Техническая диагностика",
    console: "Консоль",
    network: "Сеть",
    emptyConsole: "Логи консоли не записаны.",
    emptyNetwork: "Сетевые логи не записаны.",
    diagnosticsAria: "Вид диагностики",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
