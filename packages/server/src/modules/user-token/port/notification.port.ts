import type { DbClient } from "@workspace/database";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

export type UserTokenNotificationPort = {
  withTx(tx: DbClient): UserTokenNotificationPort;
  tokenCreated(params: {
    organizationId: string;
    actorUserId: string | null;
    tokenId: string;
    ownerUserId: string;
    payload: NotificationPayloadType;
  }): Promise<void>;
};
