import type { DbClient } from "@workspace/database";
import type { EmitNotificationsUseCase } from "@workspace/server/modules/notification/application/emit-notifications.use-case";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

type NotificationDispatchPort = {
  withTx(tx: DbClient): NotificationDispatchPort;
  ticketAssigned(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    assigneeUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void>;
  ticketCreated(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    defaultAssigneeId: string | null;
    payload: NotificationPayloadType;
  }): Promise<void>;
  ticketStatusChanged(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    assigneeUserId: string | null;
    payload: NotificationPayloadType;
  }): Promise<void>;
  commentCreated(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    assigneeUserId: string | null;
    payload: NotificationPayloadType;
  }): Promise<void>;
  membershipRoleChanged(params: {
    organizationId: string;
    actorUserId: string | null;
    membershipId: string;
    affectedUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void>;
  projectAccessGranted(params: {
    organizationId: string;
    actorUserId: string | null;
    membershipId: string;
    affectedUserId: string;
    projectId: string;
    payload: NotificationPayloadType;
  }): Promise<void>;
  projectAccessRevoked(params: {
    organizationId: string;
    actorUserId: string | null;
    membershipId: string;
    affectedUserId: string;
    projectId: string;
    payload: NotificationPayloadType;
  }): Promise<void>;
  invitationAccepted(params: {
    organizationId: string;
    actorUserId: string | null;
    invitationId: string;
    inviterUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void>;
  projectArchived(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    restored: boolean;
    payload: NotificationPayloadType;
  }): Promise<void>;
  apiKeyRotated(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    apiKeyId: string;
    payload: NotificationPayloadType;
  }): Promise<void>;
  tokenCreated(params: {
    organizationId: string;
    actorUserId: string | null;
    tokenId: string;
    ownerUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void>;
};

export class NotificationDispatchAdapter implements NotificationDispatchPort {
  constructor(private readonly emitNotifications: EmitNotificationsUseCase) {}

  withTx(tx: DbClient): NotificationDispatchAdapter {
    return new NotificationDispatchAdapter(this.emitNotifications.withTx(tx));
  }

  async ticketAssigned(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    assigneeUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    await this.emitNotifications.ticketAssigned(params);
  }

  async ticketCreated(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    defaultAssigneeId: string | null;
    payload: NotificationPayloadType;
  }): Promise<void> {
    await this.emitNotifications.ticketCreated(params);
  }

  async ticketStatusChanged(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    assigneeUserId: string | null;
    payload: NotificationPayloadType;
  }): Promise<void> {
    await this.emitNotifications.ticketStatusChanged(params);
  }

  async commentCreated(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    assigneeUserId: string | null;
    payload: NotificationPayloadType;
  }): Promise<void> {
    await this.emitNotifications.commentCreated(params);
  }

  async membershipRoleChanged(params: {
    organizationId: string;
    actorUserId: string | null;
    membershipId: string;
    affectedUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    await this.emitNotifications.membershipRoleChanged(params);
  }

  async projectAccessGranted(params: {
    organizationId: string;
    actorUserId: string | null;
    membershipId: string;
    affectedUserId: string;
    projectId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    await this.emitNotifications.projectAccessGranted(params);
  }

  async projectAccessRevoked(params: {
    organizationId: string;
    actorUserId: string | null;
    membershipId: string;
    affectedUserId: string;
    projectId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    await this.emitNotifications.projectAccessRevoked(params);
  }

  async invitationAccepted(params: {
    organizationId: string;
    actorUserId: string | null;
    invitationId: string;
    inviterUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    await this.emitNotifications.invitationAccepted(params);
  }

  async projectArchived(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    restored: boolean;
    payload: NotificationPayloadType;
  }): Promise<void> {
    await this.emitNotifications.projectArchived(params);
  }

  async apiKeyRotated(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    apiKeyId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    await this.emitNotifications.apiKeyRotated(params);
  }

  async tokenCreated(params: {
    organizationId: string;
    actorUserId: string | null;
    tokenId: string;
    ownerUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    await this.emitNotifications.tokenCreated(params);
  }
}
