import type { DbClient } from "@workspace/database";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

export type ProjectNotificationPort = {
  withTx(tx: DbClient): ProjectNotificationPort;
  projectArchived(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    restored: boolean;
    payload: NotificationPayloadType;
  }): Promise<void>;
};
