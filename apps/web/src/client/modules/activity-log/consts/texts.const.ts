import { localize } from "@/client/modules/shared/locale/interface-language";

const en = {
  title: "Activity log",
  description: "Who changed an application object, when, and what changed.",
  empty: "No activity yet.",
  column: {
    who: "Who",
    when: "When",
    object: "Object",
    source: "Source",
    change: "What changed",
  },
  source: {
    web: "Web",
    mcp: "MCP",
  },
  entity: {
    organization: "Organization",
    membership: "Membership",
    invitation: "Invitation",
    project: "Project",
    "api-key": "Project key",
    "bug-report": "Ticket",
    comment: "Comment",
    "project-access": "Project access",
  },
} as const;

const ru = {
  title: "Журнал действий",
  description: "Кто изменил объект, когда и что именно изменилось.",
  empty: "Пока нет записей.",
  column: {
    who: "Кто",
    when: "Когда",
    object: "Объект",
    source: "Источник",
    change: "Что изменилось",
  },
  source: {
    web: "Веб",
    mcp: "MCP",
  },
  entity: {
    organization: "Организация",
    membership: "Участие",
    invitation: "Приглашение",
    project: "Проект",
    "api-key": "Ключ проекта",
    "bug-report": "Тикет",
    comment: "Комментарий",
    "project-access": "Доступ к проектам",
  },
} as const;

export const texts: typeof en = localize(en, ru as never);
