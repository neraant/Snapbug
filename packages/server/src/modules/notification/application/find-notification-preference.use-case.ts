import { UserNotificationPreferenceFactory } from "@workspace/server/modules/notification/entity/user-notification-preference.factory";
import { UserNotificationPreferenceMapper } from "@workspace/server/modules/notification/entity/user-notification-preference.mapper";
import { UserOrganizationNotificationPreferenceFactory } from "@workspace/server/modules/notification/entity/user-organization-notification-preference.factory";
import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";
import type { UserNotificationPreferenceRepository } from "@workspace/server/modules/notification/repository/user-notification-preference.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { FindNotificationPreferenceOutputDtoType } from "@workspace/validation/modules/notification/dto/find-notification-preference.schema";

export class FindNotificationPreferenceUseCase {
  constructor(
    private readonly userNotificationPreferenceRepository: UserNotificationPreferenceRepository,
    private readonly membershipPort: NotificationMembershipPort,
  ) {}

  async execute(userId: string, organizationId: string | null): Promise<FindNotificationPreferenceOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const memberships = await this.membershipPort.findManyByOrganizationId(organizationId);
    const membership = memberships.find((row) => row.userId === userId);
    if (!membership) {
      throw new NotFoundError(ERROR_CODES.MEMBERSHIP_NOT_FOUND);
    }

    let userNotificationPreference = await this.userNotificationPreferenceRepository.findByUserId(userId);
    if (!userNotificationPreference) {
      userNotificationPreference = UserNotificationPreferenceFactory.create(userId);
    }

    let organizationPreference = await this.userNotificationPreferenceRepository.findOrganizationPreference(
      userId,
      organizationId,
    );
    if (!organizationPreference) {
      organizationPreference = UserOrganizationNotificationPreferenceFactory.create(userId, organizationId);
    }

    return UserNotificationPreferenceMapper.toDto({
      userNotificationPreference,
      mutedProjectIds: organizationPreference.mutedProjectIds,
      role: membership.role,
    });
  }
}
