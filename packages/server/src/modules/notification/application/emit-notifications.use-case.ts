import type { DbClient } from "@workspace/database";
import type { NotificationBugReportPort } from "@workspace/server/modules/notification/port/bug-report.port";
import type { NotificationCommentPort } from "@workspace/server/modules/notification/port/comment.port";
import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";
import type { NotificationProjectPort } from "@workspace/server/modules/notification/port/project.port";
import type { NotificationUserPort } from "@workspace/server/modules/notification/port/user.port";
import type {
  DeliverNotificationInput,
  NotificationService,
} from "@workspace/server/modules/notification/service/notification.service";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class EmitNotificationsUseCase {
  constructor(
    private readonly membershipPort: NotificationMembershipPort,
    private readonly projectPort: NotificationProjectPort,
    private readonly bugReportPort: NotificationBugReportPort,
    private readonly commentPort: NotificationCommentPort,
    private readonly userPort: NotificationUserPort,
    private readonly notificationService: NotificationService,
  ) {}

  withTx(tx: DbClient): EmitNotificationsUseCase {
    return new EmitNotificationsUseCase(
      this.membershipPort,
      this.projectPort,
      this.bugReportPort,
      this.commentPort,
      this.userPort,
      this.notificationService.withTx(tx),
    );
  }

  async ticketAssigned(input: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    assigneeUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    const recipients = await this.filterProjectAccess(input.organizationId, input.projectId, [
      input.assigneeUserId,
    ]);
    await this.deliver("ticket.assigned", recipients, {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      objectType: "bug-report",
      objectId: input.ticketId,
      projectId: input.projectId,
      payload: input.payload,
    });
  }

  async ticketCreated(input: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    defaultAssigneeId: string | null;
    payload: NotificationPayloadType;
  }): Promise<void> {
    let recipientIds: string[] = [];

    if (input.defaultAssigneeId) {
      recipientIds = await this.filterProjectAccess(input.organizationId, input.projectId, [input.defaultAssigneeId]);
    } else {
      recipientIds = await this.adminUserIds(input.organizationId, input.actorUserId);
    }

    await this.deliver("ticket.created", recipientIds, {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      objectType: "bug-report",
      objectId: input.ticketId,
      projectId: input.projectId,
      payload: input.payload,
    });
  }

  async ticketStatusChanged(input: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    assigneeUserId: string | null;
    reporterEmail: string | null;
    payload: NotificationPayloadType;
  }): Promise<void> {
    const participantIds = await this.commentPort.findAuthorUserIdsByBugReportId(input.ticketId);
    const candidateIds = [
      ...(input.assigneeUserId ? [input.assigneeUserId] : []),
      ...participantIds,
    ];
    const reporterUserId = await this.resolveReporterUserId(input.reporterEmail, candidateIds);
    const withoutReporter = reporterUserId
      ? candidateIds.filter((userId) => userId !== reporterUserId)
      : candidateIds;
    const recipients = await this.filterProjectAccess(input.organizationId, input.projectId, withoutReporter, input.actorUserId);

    await this.deliver("ticket.status_changed", recipients, {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      objectType: "bug-report",
      objectId: input.ticketId,
      projectId: input.projectId,
      payload: input.payload,
    });
  }

  async commentCreated(input: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    assigneeUserId: string | null;
    payload: NotificationPayloadType;
  }): Promise<void> {
    const participantIds = await this.commentPort.findAuthorUserIdsByBugReportId(input.ticketId);
    const candidateIds = [
      ...(input.assigneeUserId ? [input.assigneeUserId] : []),
      ...participantIds,
    ];
    const recipients = await this.filterProjectAccess(
      input.organizationId,
      input.projectId,
      candidateIds,
      input.actorUserId,
    );

    await this.deliver("comment.created", recipients, {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      objectType: "bug-report",
      objectId: input.ticketId,
      projectId: input.projectId,
      payload: input.payload,
    });
  }

  async membershipRoleChanged(input: {
    organizationId: string;
    actorUserId: string | null;
    membershipId: string;
    affectedUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    const recipients = this.excludeActor([input.affectedUserId], input.actorUserId);
    await this.deliver("membership.role_changed", recipients, {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      objectType: "membership",
      objectId: input.membershipId,
      projectId: null,
      payload: input.payload,
    });
  }

  async projectAccessGranted(input: {
    organizationId: string;
    actorUserId: string | null;
    membershipId: string;
    affectedUserId: string;
    projectId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    const recipients = this.excludeActor([input.affectedUserId], input.actorUserId);
    await this.deliver("project.access_granted", recipients, {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      objectType: "membership",
      objectId: input.membershipId,
      projectId: input.projectId,
      payload: input.payload,
    });
  }

  async projectAccessRevoked(input: {
    organizationId: string;
    actorUserId: string | null;
    membershipId: string;
    affectedUserId: string;
    projectId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    const recipients = this.excludeActor([input.affectedUserId], input.actorUserId);
    await this.deliver("project.access_revoked", recipients, {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      objectType: "membership",
      objectId: input.membershipId,
      projectId: input.projectId,
      payload: input.payload,
    });
  }

  async invitationAccepted(input: {
    organizationId: string;
    actorUserId: string | null;
    invitationId: string;
    inviterUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    const admins = await this.adminUserIds(input.organizationId, input.actorUserId);
    const recipients = this.unique([input.inviterUserId, ...admins].filter((id) => id !== input.actorUserId));
    await this.deliver("invitation.accepted", recipients, {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      objectType: "invitation",
      objectId: input.invitationId,
      projectId: null,
      payload: input.payload,
    });
  }

  async projectArchived(input: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    restored: boolean;
    payload: NotificationPayloadType;
  }): Promise<void> {
    const recipients = await this.resolveMembersWithProjectAccess(input.organizationId, input.projectId, input.actorUserId);
    await this.deliver("project.archived", recipients, {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      objectType: "project",
      objectId: input.projectId,
      projectId: input.projectId,
      payload: { ...input.payload, restored: input.restored },
    });
  }

  async apiKeyRotated(input: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    apiKeyId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    const recipients = await this.adminUserIds(input.organizationId, input.actorUserId);
    await this.deliver("security.api_key_rotated", recipients, {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      objectType: "api-key",
      objectId: input.apiKeyId,
      projectId: input.projectId,
      payload: input.payload,
    });
  }

  async tokenCreated(input: {
    organizationId: string;
    actorUserId: string | null;
    tokenId: string;
    ownerUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void> {
    const recipients = this.excludeActor([input.ownerUserId], input.actorUserId);
    await this.deliver("security.token_created", recipients, {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      objectType: "user-token",
      objectId: input.tokenId,
      projectId: null,
      payload: input.payload,
    });
  }

  private async deliver(
    type: DeliverNotificationInput["type"],
    recipientUserIds: string[],
    base: Omit<DeliverNotificationInput, "type" | "recipientUserId">,
  ): Promise<void> {
    const uniqueRecipients = this.unique(recipientUserIds);
    const deliveries = uniqueRecipients.map((recipientUserId) => ({
      ...base,
      type,
      recipientUserId,
    }));
    await this.notificationService.deliverBatch(deliveries);
  }

  private excludeActor(userIds: string[], actorUserId: string | null): string[] {
    if (!actorUserId) return this.unique(userIds);
    return this.unique(userIds.filter((userId) => userId !== actorUserId));
  }

  private unique(userIds: string[]): string[] {
    return [...new Set(userIds)];
  }

  private async adminUserIds(organizationId: string, actorUserId: string | null): Promise<string[]> {
    const memberships = await this.membershipPort.findManyByOrganizationId(organizationId);
    const adminIds = memberships.filter((membership) => membership.role === UserRole.ADMIN).map((m) => m.userId);
    return this.excludeActor(adminIds, actorUserId);
  }

  private async resolveMembersWithProjectAccess(
    organizationId: string,
    projectId: string,
    actorUserId: string | null,
  ): Promise<string[]> {
    const memberships = await this.membershipPort.findManyByOrganizationId(organizationId);
    const userIds: string[] = [];
    for (const membership of memberships) {
      const allowed = await this.membershipPort.filterProjectIds(membership, [projectId]);
      if (allowed.length > 0) userIds.push(membership.userId);
    }
    return this.excludeActor(userIds, actorUserId);
  }

  private async filterProjectAccess(
    organizationId: string,
    projectId: string,
    candidateUserIds: string[],
    actorUserId: string | null = null,
  ): Promise<string[]> {
    const memberships = await this.membershipPort.findManyByOrganizationId(organizationId);
    const membershipByUserId = new Map(memberships.map((membership) => [membership.userId, membership]));
    const allowed: string[] = [];

    for (const userId of this.unique(candidateUserIds)) {
      const membership = membershipByUserId.get(userId);
      if (!membership) continue;
      const allowedProjects = await this.membershipPort.filterProjectIds(membership, [projectId]);
      if (allowedProjects.length > 0) allowed.push(userId);
    }

    return this.excludeActor(allowed, actorUserId);
  }

  private async resolveReporterUserId(
    reporterEmail: string | null,
    candidateUserIds: string[],
  ): Promise<string | null> {
    if (!reporterEmail || candidateUserIds.length === 0) return null;
    const users = await this.userPort.findManyByIds(candidateUserIds);
    const normalized = reporterEmail.toLowerCase();
    const match = users.find((user) => user.email.toLowerCase() === normalized);
    return match?.id ?? null;
  }
}