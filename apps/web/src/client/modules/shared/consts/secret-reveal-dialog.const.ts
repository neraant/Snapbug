import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  userToken: {
    title: "Token created",
    connectLink: "How to connect → MCP · Connect",
  },
  apiKey: {
    title: "New API key",
  },
  description: "Copy it now. You won't be able to see it again.",
  warning: "Store this secret somewhere safe. If you lose it, create a new one.",
  copy: "Copy",
  copied: "Copied",
  createdJustNow: "Created just now",
  reveal: "Show secret",
  hide: "Hide secret",
  done: "Done",
  doneNudge: "I've copied it",
} as const;

const ru = {
  userToken: {
    title: "Токен создан",
    connectLink: "Как подключить → MCP · Подключение",
  },
  apiKey: {
    title: "Новый API-ключ",
  },
  description: "Скопируйте его сейчас. Потом он больше не отобразится.",
  warning: "Сохраните секрет в надёжном месте. Если потеряете — создайте новый.",
  copy: "Копировать",
  copied: "Скопировано",
  createdJustNow: "Создан только что",
  reveal: "Показать секрет",
  hide: "Скрыть секрет",
  done: "Готово",
  doneNudge: "Я скопировал",
} as const;

export const secretRevealDialogTexts: typeof en = localize(en, ru as never);
