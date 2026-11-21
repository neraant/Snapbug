import type { NotificationMembershipPort } from "@workspace/server/modules/notification/port/membership.port";
import type { NotificationRepository } from "@workspace/server/modules/notification/repository/notification.repository";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { MarkAllReadOutputDtoType } from "@workspace/validation/modules/notification/dto/mark-all-read.schema";

export class MarkAllReadUseCase {
  constructor(
    private readonly membershipPort: NotificationMembershipPort,
    private readonly notificationRepository: NotificationRepository,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(userId: string, organizationId: string | null): Promise<MarkAllReadOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const memberships = await this.membershipPort.findManyByOrganizationId(organizationId);
    if (!memberships.some((membership) => membership.userId === userId)) {
      throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);
    }

    const updated = await this.withTransaction(async (tx) => {
      return await this.notificationRepository.withTx(tx).markAllRead(organizationId, userId);
    });

    return { updated };
  }
}
