import { UpdateNotificationPreferenceUseCase } from "@workspace/server/modules/notification/application/update-notification-preference.use-case";
import { UserNotificationPreference } from "@workspace/server/modules/notification/entity/user-notification-preference.entity";
import { UserOrganizationNotificationPreference } from "@workspace/server/modules/notification/entity/user-organization-notification-preference.entity";
import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";
import type { UserNotificationPreferenceRepository } from "@workspace/server/modules/notification/repository/user-notification-preference.repository";
import type { UpdateNotificationPreferenceInputDtoType } from "@workspace/validation/modules/notification/dto/update-notification-preference.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { describe, expect, it, vi } from "vitest";

const organizationId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const userId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const membershipId = "11111111-1111-4111-8111-111111111111";
const mutedProjectId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

describe("UpdateNotificationPreferenceUseCase", () => {
  it("keeps locked security channels on", async () => {
    const existing = new UserNotificationPreference({
      userId,
      channels: {},
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
        .mockResolvedValue([{ id: membershipId, userId, organizationId, role: UserRole.ADMIN }]),
      filterProjectIds: vi.fn(),
    };

    let saved: UserNotificationPreference | undefined;
    const userNotificationPreferenceRepository = {
      findByUserId: vi.fn().mockResolvedValue(existing),
      findOrganizationPreference: vi.fn().mockResolvedValue(organizationPreference),
      save: vi.fn(async (value: UserNotificationPreference) => {
        saved = value;
      }),
      saveOrganizationPreference: vi.fn(),
    } as unknown as UserNotificationPreferenceRepository;

    const useCase = new UpdateNotificationPreferenceUseCase(userNotificationPreferenceRepository, membershipPort);
    const result = await useCase.execute(userId, organizationId, {
      channels: {
        security: { inApp: false, email: false },
        assigned_to_me: { email: false },
      } as UpdateNotificationPreferenceInputDtoType["channels"],
    });

    expect(saved?.channels.security).toBeUndefined();
    expect(result.channels.security).toEqual({ inApp: true, email: true });
    expect(result.channels.assigned_to_me?.email).toBe(false);
  });

  it("stores muted project ids for the organization", async () => {
    const existing = new UserNotificationPreference({
      userId,
      channels: {},
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

    let savedOrganization: UserOrganizationNotificationPreference | undefined;
    const userNotificationPreferenceRepository = {
      findByUserId: vi.fn().mockResolvedValue(existing),
      findOrganizationPreference: vi.fn().mockResolvedValue(organizationPreference),
      save: vi.fn(),
      saveOrganizationPreference: vi.fn(async (value: UserOrganizationNotificationPreference) => {
        savedOrganization = value;
      }),
    } as unknown as UserNotificationPreferenceRepository;

    const useCase = new UpdateNotificationPreferenceUseCase(userNotificationPreferenceRepository, membershipPort);
    const result = await useCase.execute(userId, organizationId, { mutedProjectIds: [mutedProjectId] });

    expect(savedOrganization?.mutedProjectIds).toEqual([mutedProjectId]);
    expect(result.mutedProjectIds).toEqual([mutedProjectId]);
  });
});
