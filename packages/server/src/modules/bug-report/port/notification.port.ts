import type { DbClient } from "@workspace/database";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

export type BugReportNotificationPort = {
  withTx(tx: DbClient): BugReportNotificationPort;
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
    reporterEmail: string | null;
    payload: NotificationPayloadType;
  }): Promise<void>;
};
