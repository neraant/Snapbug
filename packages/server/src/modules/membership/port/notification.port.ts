import type { DbClient } from "@workspace/database";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

export type MembershipNotificationPort = {
  withTx(tx: DbClient): MembershipNotificationPort;
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
};
