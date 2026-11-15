import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  code: "500",
  title: "Something broke on our side",
  description: "It's not you, it's us. Try again, and if it keeps happening, send us the details below.",
  tryAgain: "Try again",
  overview: "Go to overview",
  details: "Technical details",
  errorId: "Error ID:",
  timestamp: "Timestamp:",
  copy: "Copy details",
  copied: "Copied",
} as const;

const ru = {
  code: "500",
  title: "Что-то сломалось на нашей стороне",
  description: "Дело не в вас. Попробуйте ещё раз, а если ошибка повторится — пришлите данные ниже.",
  tryAgain: "Повторить",
  overview: "К обзору",
  details: "Технические подробности",
  errorId: "ID ошибки:",
  timestamp: "Время:",
  copy: "Копировать подробности",
  copied: "Скопировано",
} as const;

export const texts: typeof en = localize(en, ru as never);
