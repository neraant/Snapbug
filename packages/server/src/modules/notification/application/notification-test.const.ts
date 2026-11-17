import type { NotificationDispatchPort } from "@workspace/server/modules/notification/adapter/notification-dispatch.adapter";
import { vi } from "vitest";

export function createNotificationPortMock(): NotificationDispatchPort {
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
  return mock as unknown as NotificationDispatchPort;
}
