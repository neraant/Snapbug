import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  tryAgain: "Try again",
  overview: "Go to overview",
  details: "Technical details",
  errorId: "Error ID:",
  timestamp: "Timestamp:",
  copy: "Copy details",
  copied: "Copied",
  byStatus: {
    400: {
      title: "Invalid request",
      description: "Something in the request was not accepted. Try again or return to the overview.",
    },
    401: {
      title: "Sign in required",
      description: "You need to sign in to continue. Try again after signing in.",
    },
    403: {
      title: "Access denied",
      description: "You do not have permission to open this. Return to the overview or contact an administrator.",
    },
    404: {
      title: "Not found",
      description: "The page or resource does not exist or is no longer available.",
    },
    409: {
      title: "Conflict",
      description: "This action could not be completed because something changed. Refresh and try again.",
    },
    429: {
      title: "Too many requests",
      description: "Please wait a moment and try again.",
    },
    client: {
      title: "Request failed",
      description: "The request could not be completed. Try again or return to the overview.",
    },
    server: {
      title: "Something broke on our side",
      description: "It's not you, it's us. Try again, and if it keeps happening, send us the details below.",
    },
  },
} as const;

const ru = {
  tryAgain: "Повторить",
  overview: "К обзору",
  details: "Технические подробности",
  errorId: "ID ошибки:",
  timestamp: "Время:",
  copy: "Копировать подробности",
  copied: "Скопировано",
  byStatus: {
    400: {
      title: "Некорректный запрос",
      description: "Запрос не принят. Попробуйте ещё раз или вернитесь к обзору.",
    },
    401: {
      title: "Нужен вход",
      description: "Чтобы продолжить, войдите в аккаунт и повторите попытку.",
    },
    403: {
      title: "Доступ запрещён",
      description: "У вас нет прав на этот ресурс. Вернитесь к обзору или обратитесь к администратору.",
    },
    404: {
      title: "Не найдено",
      description: "Страница или ресурс не существует или больше недоступны.",
    },
    409: {
      title: "Конфликт",
      description: "Действие не выполнено из‑за изменений. Обновите страницу и попробуйте снова.",
    },
    429: {
      title: "Слишком много запросов",
      description: "Подождите немного и попробуйте снова.",
    },
    client: {
      title: "Запрос не выполнен",
      description: "Не удалось выполнить запрос. Попробуйте ещё раз или вернитесь к обзору.",
    },
    server: {
      title: "Что-то сломалось на нашей стороне",
      description: "Дело не в вас. Попробуйте ещё раз, а если ошибка повторится — пришлите данные ниже.",
    },
  },
} as const;

export const texts: typeof en = localize(en, ru as never);