import type { NotificationModelType } from "@workspace/validation/modules/notification/dto/notification.model";

import { type NotificationMessageContent, texts } from "@/client/modules/notification/consts/texts.const";

const systemActorLabel = "Snapbug";

export function formatNotificationMessage(notification: NotificationModelType): NotificationMessageContent {
  const actor = notification.payload.actorName ?? systemActorLabel;
  const ticketId = notification.payload.ticketShortId ?? "";
  const title = notification.payload.ticketTitle ?? "";
  const project = notification.payload.projectName ?? "";
  const member = notification.payload.memberName ?? "";
  const role = notification.payload.newValue ?? "";
  const status = notification.payload.newValue ?? "";
  const token = notification.payload.tokenName ?? "";
  const count = notification.payload.count ?? 1;

  switch (notification.type) {
    case "ticket.assigned":
      return texts.message.ticketAssigned(actor, ticketId, title);
    case "ticket.created":
      return texts.message.ticketCreated(ticketId, title);
    case "ticket.status_changed":
      return count > 1
        ? texts.message.ticketStatusChangedGrouped(count, ticketId)
        : texts.message.ticketStatusChanged(actor, ticketId, status);
    case "comment.created":
      return count > 1
        ? texts.message.commentCreatedGrouped(count, ticketId)
        : texts.message.commentCreated(actor, ticketId);
    case "membership.role_changed":
      return texts.message.membershipRoleChanged(actor, member, role);
    case "project.access_granted":
      return texts.message.projectAccessGranted(actor, project);
    case "project.access_revoked":
      return texts.message.projectAccessRevoked(actor, project);
    case "invitation.accepted":
      return texts.message.invitationAccepted(member || actor);
    case "project.archived":
      return texts.message.projectArchived(project, notification.payload.restored === true);
    case "security.api_key_rotated":
      return texts.message.securityApiKeyRotated(project);
    case "security.token_created":
      return texts.message.securityTokenCreated(token);
    default:
      return texts.message.fallback(notification.type);
  }
}

export function notificationMessagePlainText(notification: NotificationModelType): string {
  return formatNotificationMessage(notification)
    .parts.map((part) => part.text)
    .join("");
}
