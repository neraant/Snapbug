import type { NotificationRepository } from "@workspace/server/modules/notification/repository/notification.repository";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  MarkReadInputDtoType,
  MarkReadOutputDtoType,
} from "@workspace/validation/modules/notification/dto/mark-read.schema";

export class MarkReadUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: MarkReadInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<MarkReadOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const notifications = await this.notificationRepository.findManyByIdsForRecipient(
      input.ids,
      userId,
      organizationId,
    );

    if (notifications.length === 0) return { updated: 0 };

    const now = new Date();
    const toMark = notifications.filter((notification) => !notification.readAt).map((n) => n.markRead(now));

    await this.withTransaction(async (tx) => {
      const repository = this.notificationRepository.withTx(tx);
      for (const notification of toMark) {
        await repository.save(notification);
      }
    });

    return { updated: toMark.length };
  }
}