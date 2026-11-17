import { FindNotificationPreferenceUseCase } from "@workspace/server/modules/notification/application/find-notification-preference.use-case";
import { UserNotificationPreference } from "@workspace/server/modules/notification/entity/user-notification-preference.entity";
import { UserOrganizationNotificationPreference } from "@workspace/server/modules/notification/entity/user-organization-notification-preference.entity";
import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";
import type { UserNotificationPreferenceRepository } from "@workspace/server/modules/notification/repository/user-notification-preference.repository";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const userId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const membershipId = "11111111-1111-4111-8111-111111111111";

describe("FindNotificationPreferenceUseCase", () => {
  it("hides admin-only rows for members", async () => {
    const userNotificationPreference = new UserNotificationPreference({
      userId,
      emailDigest: "hourly",
      channels: {},
      emailDigestSentAt: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    const organizationPreference = new UserOrganizationNotificationPreference({
      userId,
      organizationId,
      mutedProjectIds: [],
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    const membershipPort: NotificationMembershipPort = {
      findManyByOrganizationId: vi
        .fn()
        .mockResolvedValue([{ id: membershipId, userId, organizationId, role: UserRole.USER }]),
      filterProjectIds: vi.fn(),
    };

    const userNotificationPreferenceRepository = {
      findByUserId: vi.fn().mockResolvedValue(userNotificationPreference),
      findOrganizationPreference: vi.fn().mockResolvedValue(organizationPreference),
    } as unknown as UserNotificationPreferenceRepository;

    const useCase = new FindNotificationPreferenceUseCase(userNotificationPreferenceRepository, membershipPort);
    const result = await useCase.execute(userId, organizationId);

    expect(result.channels.team_invitation_accepted).toBeUndefined();
    expect(result.channels.assigned_to_me).toEqual({ inApp: true, email: true });
    expect(result.lockedGroups).toContain("security");
  });

  it("returns admin-only rows for admins", async () => {
    const membershipPort: NotificationMembershipPort = {
      findManyByOrganizationId: vi
        .fn()
        .mockResolvedValue([{ id: membershipId, userId, organizationId, role: UserRole.ADMIN }]),
      filterProjectIds: vi.fn(),
    };

    const userNotificationPreferenceRepository = {
      findByUserId: vi.fn().mockResolvedValue(null),
      findOrganizationPreference: vi.fn().mockResolvedValue(null),
    } as unknown as UserNotificationPreferenceRepository;

    const useCase = new FindNotificationPreferenceUseCase(userNotificationPreferenceRepository, membershipPort);
    const result = await useCase.execute(userId, organizationId);

    expect(result.channels.team_invitation_accepted).toEqual({ inApp: true, email: false });
  });
});