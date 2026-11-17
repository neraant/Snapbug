import type { DbClient } from "@workspace/database";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

export type InvitationNotificationPort = {
  withTx(tx: DbClient): InvitationNotificationPort;
  invitationAccepted(params: {
    organizationId: string;
    actorUserId: string | null;
    invitationId: string;
    inviterUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void>;
};
