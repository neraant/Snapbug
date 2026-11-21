import type { InterfaceLanguage } from "@workspace/validation/modules/user/consts/interface-language.const";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";
import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";

type NotificationEmailLine = {
  text: string;
  ticketShortId?: string;
  projectName?: string;
};

const en = {
  manageSettings: "Manage notification settings",
  viewTicket: "View ticket",
  digestTitle: "Your notification digest",
  digestIntro: (count: number) =>
    count === 1 ? "You have 1 new notification." : `You have ${count} new notifications.`,
  immediateEyebrow: "Snapbug",
  projectGroupFallback: "Workspace",
};

const ru: typeof en = {
  manageSettings: "Настройки уведомлений",
  viewTicket: "Открыть тикет",
  digestTitle: "Дайджест уведомлений",
  digestIntro: (count: number) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `У вас ${count} новое уведомление.`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `У вас ${count} новых уведомления.`;
    return `У вас ${count} новых уведомлений.`;
  },
  immediateEyebrow: "Snapbug",
  projectGroupFallback: "Рабочее пространство",
};

export const notificationEmailTexts = {
  en,
  ru,
} as const satisfies Record<InterfaceLanguage, typeof en>;

export function notificationEmailLanguage(language: InterfaceLanguage): typeof en {
  return notificationEmailTexts[language];
}

export function formatNotificationEmailLine(
  type: NotificationType,
  payload: NotificationPayloadType,
  language: InterfaceLanguage,
): NotificationEmailLine {
  const actor = payload.actorName ?? "Snapbug";
  const ticketId = payload.ticketShortId ?? "";
  const title = payload.ticketTitle ?? "";
  const project = payload.projectName ?? "";
  const member = payload.memberName ?? "";
  const role = payload.newValue ?? "";
  const status = payload.newValue ?? "";
  const token = payload.tokenName ?? "";
  const count = payload.count ?? 1;

  if (language === "ru") {
    switch (type) {
      case "ticket.assigned":
        return {
          text: `${actor} назначил(а) вас на ${ticketId} ${title}`.trim(),
          ticketShortId: ticketId,
          projectName: project,
        };
      case "ticket.created":
        return { text: `Новый тикет ${ticketId} ${title}`.trim(), ticketShortId: ticketId, projectName: project };
      case "ticket.status_changed":
        return {
          text:
            count > 1
              ? `${count} обновлений статуса в ${ticketId}`
              : `${actor} изменил(а) статус ${ticketId} на ${status}`,
          ticketShortId: ticketId,
          projectName: project,
        };
      case "comment.created":
        return {
          text: count > 1 ? `${count} новых комментариев к ${ticketId}` : `${actor} прокомментировал(а) ${ticketId}`,
          ticketShortId: ticketId,
          projectName: project,
        };
      case "membership.role_changed":
        return { text: `${actor} изменил(а) роль ${member} на ${role}` };
      case "project.access_granted":
        return { text: `${actor} выдал(а) вам доступ к ${project}`, projectName: project };
      case "project.access_revoked":
        return { text: `${actor} отозвал(а) ваш доступ к ${project}`, projectName: project };
      case "invitation.accepted":
        return { text: `${member || actor} присоединился(ась) к команде` };
      case "project.archived":
        return {
          text: payload.restored ? `Проект ${project} восстановлен` : `Проект ${project} архивирован`,
          projectName: project,
        };
      case "security.api_key_rotated":
        return { text: `Ключ API проекта ${project} обновлён`, projectName: project };
      case "security.token_created":
        return { text: `Создан токен ${token}` };
      default:
        return { text: type };
    }
  }

  switch (type) {
    case "ticket.assigned":
      return {
        text: `${actor} assigned you ${ticketId} ${title}`.trim(),
        ticketShortId: ticketId,
        projectName: project,
      };
    case "ticket.created":
      return { text: `New ticket ${ticketId} ${title}`.trim(), ticketShortId: ticketId, projectName: project };
    case "ticket.status_changed":
      return {
        text: count > 1 ? `${count} status updates on ${ticketId}` : `${actor} changed ${ticketId} to ${status}`,
        ticketShortId: ticketId,
        projectName: project,
      };
    case "comment.created":
      return {
        text: count > 1 ? `${count} new comments on ${ticketId}` : `${actor} commented on ${ticketId}`,
        ticketShortId: ticketId,
        projectName: project,
      };
    case "membership.role_changed":
      return { text: `${actor} changed ${member}'s role to ${role}` };
    case "project.access_granted":
      return { text: `${actor} granted you access to ${project}`, projectName: project };
    case "project.access_revoked":
      return { text: `${actor} revoked your access to ${project}`, projectName: project };
    case "invitation.accepted":
      return { text: `${member || actor} joined your team` };
    case "project.archived":
      return {
        text: payload.restored ? `Project ${project} was restored` : `Project ${project} was archived`,
        projectName: project,
      };
    case "security.api_key_rotated":
      return { text: `API key rotated for ${project}`, projectName: project };
    case "security.token_created":
      return { text: `New token created: ${token}` };
    default:
      return { text: type };
  }
}

export function notificationEmailSubject(
  type: NotificationType,
  payload: NotificationPayloadType,
  language: InterfaceLanguage,
): string {
  const line = formatNotificationEmailLine(type, payload, language);
  return line.text;
}
