import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";
import type { NotificationRepository } from "@workspace/server/modules/notification/repository/notification.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { UnreadCountOutputDtoType } from "@workspace/validation/modules/notification/dto/unread-count.schema";

export class UnreadCountUseCase {
  constructor(
    private readonly membershipPort: NotificationMembershipPort,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string, organizationId: string | null): Promise<UnreadCountOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const memberships = await this.membershipPort.findManyByOrganizationId(organizationId);
    if (!memberships.some((membership) => membership.userId === userId)) {
      throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);
    }

    const count = await this.notificationRepository.countUnread(organizationId, userId);
    return { count };
  }
}