import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "MCP",
  description:
    "Connect a normal MCP client with a personal token. Send it as a Bearer token to /api/mcp. A project key is not accepted.",
  create: {
    action: "Create token",
    error: "Could not create the token. Try again.",
  },
  secret: {
    title: "Copy this token",
    description: "This token is shown once. Store it now. You can revoke it later.",
    copy: "Copy",
    copied: "Copied",
  },
  column: {
    token: "Token",
    created: "Created",
    status: "Status",
  },
  status: {
    active: "Active",
    revoked: "Revoked",
  },
  revoke: {
    action: "Revoke",
    success: "Token revoked",
    error: "Could not revoke the token. Try again.",
  },
  empty: "No tokens yet.",
} as const;

const ru = {
  title: "MCP",
  description:
    "Подключите обычный MCP-клиент личным токеном. Передавайте его как Bearer-токен на /api/mcp. Ключ проекта не подойдёт.",
  create: {
    action: "Создать токен",
    error: "Не удалось создать токен. Попробуйте ещё раз.",
  },
  secret: {
    title: "Скопируйте токен",
    description: "Токен показывается один раз. Сохраните его сейчас. Позже его можно отозвать.",
    copy: "Копировать",
    copied: "Скопировано",
  },
  column: {
    token: "Токен",
    created: "Создан",
    status: "Статус",
  },
  status: {
    active: "Активен",
    revoked: "Отозван",
  },
  revoke: {
    action: "Отозвать",
    success: "Токен отозван",
    error: "Не удалось отозвать токен. Попробуйте ещё раз.",
  },
  empty: "Токенов пока нет.",
} as const;

export const texts: typeof en = localize(en, ru as never);
