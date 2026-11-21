import { UserNotificationPreferenceFactory } from "@workspace/server/modules/notification/entity/user-notification-preference.factory";
import { UserNotificationPreferenceMapper } from "@workspace/server/modules/notification/entity/user-notification-preference.mapper";
import { UserOrganizationNotificationPreferenceFactory } from "@workspace/server/modules/notification/entity/user-organization-notification-preference.factory";
import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";
import type { UserNotificationPreferenceRepository } from "@workspace/server/modules/notification/repository/user-notification-preference.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { UpdateNotificationPreferenceInputDtoType } from "@workspace/validation/modules/notification/dto/update-notification-preference.schema";
import type { UpdateNotificationPreferenceOutputDtoType } from "@workspace/validation/modules/notification/dto/update-notification-preference.schema";

export class UpdateNotificationPreferenceUseCase {
  constructor(
    private readonly userNotificationPreferenceRepository: UserNotificationPreferenceRepository,
    private readonly membershipPort: NotificationMembershipPort,
  ) {}

  async execute(
    userId: string,
    organizationId: string | null,
    input: UpdateNotificationPreferenceInputDtoType,
  ): Promise<UpdateNotificationPreferenceOutputDtoType> {
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

    const nextChannels = input.channels
      ? UserNotificationPreferenceMapper.mergeChannelUpdates(
          userNotificationPreference,
          input.channels,
          membership.role,
        )
      : userNotificationPreference.channels;

    const updatedUserPreference = userNotificationPreference.update({
      channels: nextChannels,
    });

    const updatedOrganizationPreference =
      input.mutedProjectIds !== undefined
        ? organizationPreference.update({ mutedProjectIds: input.mutedProjectIds })
        : organizationPreference;

    await this.userNotificationPreferenceRepository.save(updatedUserPreference);
    if (input.mutedProjectIds !== undefined) {
      await this.userNotificationPreferenceRepository.saveOrganizationPreference(updatedOrganizationPreference);
    }

    return UserNotificationPreferenceMapper.toDto({
      userNotificationPreference: updatedUserPreference,
      mutedProjectIds: updatedOrganizationPreference.mutedProjectIds,
      role: membership.role,
    });
  }
}
