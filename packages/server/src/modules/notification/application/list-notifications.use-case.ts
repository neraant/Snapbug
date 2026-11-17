import { NotificationMapper } from "@workspace/server/modules/notification/entity/notification.mapper";
import { encodeNotificationCursor } from "@workspace/server/modules/notification/notification-cursor.util";
import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";
import type { NotificationRepository } from "@workspace/server/modules/notification/repository/notification.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  ListNotificationInputDtoType,
  ListNotificationOutputDtoType,
} from "@workspace/validation/modules/notification/dto/list-notification.schema";

export class ListNotificationsUseCase {
  constructor(
    private readonly membershipPort: NotificationMembershipPort,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    userId: string,
    organizationId: string | null,
    input: ListNotificationInputDtoType,
  ): Promise<ListNotificationOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const memberships = await this.membershipPort.findManyByOrganizationId(organizationId);
    const membership = memberships.find((item) => item.userId === userId);
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const limit = input.limit ?? 20;
    const rows = await this.notificationRepository.findPage({
      organizationId,
      recipientUserId: userId,
      limit,
      cursor: input.cursor,
      filter: input.filter ?? "all",
      types: input.types,
    });

    const pageItems = rows.slice(0, limit);
    const hasMore = rows.length > limit;
    const accessibleProjectIds = new Set<string>();
    const projectIds = [...new Set(pageItems.map((item) => item.projectId).filter((id): id is string => id != null))];
    for (const projectId of projectIds) {
      const allowed = await this.membershipPort.filterProjectIds(membership, [projectId]);
      if (allowed.length > 0) accessibleProjectIds.add(projectId);
    }

    const items = pageItems.map((notification) => {
      const projectId = notification.projectId;
      const accessible = projectId == null ? true : accessibleProjectIds.has(projectId);
      return NotificationMapper.toDto(notification, accessible);
    });

    const last = pageItems.at(-1);
    const nextCursor = hasMore && last ? encodeNotificationCursor(last.createdAt, last.id) : null;

    return { items, nextCursor };
  }
}