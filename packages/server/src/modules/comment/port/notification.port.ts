import type { DbClient } from "@workspace/database";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

export type CommentNotificationPort = {
  withTx(tx: DbClient): CommentNotificationPort;
  commentCreated(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    ticketId: string;
    assigneeUserId: string | null;
    payload: NotificationPayloadType;
  }): Promise<void>;
};
