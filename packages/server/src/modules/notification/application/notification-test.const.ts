import type { DbClient } from "@workspace/database";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";
import { vi } from "vitest";

type NotificationPortMock = {
  withTx(tx: DbClient): NotificationPortMock;
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

export function createNotificationPortMock(): NotificationPortMock {
  const mock = {
    withTx: vi.fn(),
    ticketAssigned: vi.fn(),
    ticketCreated: vi.fn(),
    ticketStatusChanged: vi.fn(),
    commentCreated: vi.fn(),
    membershipRoleChanged: vi.fn(),
    projectAccessGranted: vi.fn(),
    projectAccessRevoked: vi.fn(),
    invitationAccepted: vi.fn(),
    projectArchived: vi.fn(),
    apiKeyRotated: vi.fn(),
    tokenCreated: vi.fn(),
  };
  mock.withTx.mockReturnValue(mock);
  return mock as unknown as NotificationPortMock;
}
