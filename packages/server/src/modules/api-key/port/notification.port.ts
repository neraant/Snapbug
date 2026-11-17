import type { DbClient } from "@workspace/database";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

export type ApiKeyNotificationPort = {
  withTx(tx: DbClient): ApiKeyNotificationPort;
  apiKeyRotated(params: {
    organizationId: string;
    actorUserId: string | null;
    projectId: string;
    apiKeyId: string;
    payload: NotificationPayloadType;
  }): Promise<void>;
};
