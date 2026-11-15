import { ActivityLogMapper } from "@workspace/server/modules/audit/entity/activity-log.mapper";
import type { MembershipPort } from "@workspace/server/modules/audit/port/membership.port";
import type { UserPort } from "@workspace/server/modules/audit/port/user.port";
import { encodeActivityLogCursor } from "@workspace/server/shared/audit/activity-log-cursor.util";
import type { AuditLogRepository } from "@workspace/server/shared/audit/audit-log.repository";
import { ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { FindActivityLogsInputDtoType } from "@workspace/validation/modules/audit/dto/find-activity-logs-input.schema";
import type { FindActivityLogsOutputDtoType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class FindActivityLogsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly userPort: UserPort,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(
    userId: string,
    organizationId: string | null,
    input: FindActivityLogsInputDtoType,
  ): Promise<FindActivityLogsOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);
    if (membership.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_CODES.ADMIN_REQUIRED, "Administrator access is required");
    }

    const limit = input.limit ?? 50;
    const auditLogs = await this.auditLogRepository.findPageByOrganizationId({
      organizationId,
      limit,
      cursor: input.cursor,
      search: input.search,
      actorId: input.actorId,
      entityType: input.entityType,
      range: input.range ?? "all",
    });

    const pageItems = auditLogs.slice(0, limit);
    const hasMore = auditLogs.length > limit;
    const actorIds = [
      ...new Set(
        pageItems.flatMap((auditLog) =>
          auditLog.actorId && (auditLog.actorType === "user" || auditLog.actorType === "mcp") ? [auditLog.actorId] : [],
        ),
      ),
    ];
    const users = actorIds.length === 0 ? [] : await this.userPort.findManyByIds(actorIds);
    const labelByUserId = new Map(users.map((user) => [user.id, user.email]));
    const nameByUserId = new Map(users.map((user) => [user.id, user.name]));

    const items = pageItems.map((auditLog) => {
      const row = auditLog.toObject();
      return ActivityLogMapper.toDto(auditLog, this.actorFields(row.actorType, row.actorId, labelByUserId, nameByUserId));
    });

    const last = pageItems.at(-1);
    const nextCursor =
      hasMore && last ? encodeActivityLogCursor(last.occurredAt, last.id) : null;

    return { items, nextCursor };
  }

  private actorFields(
    actorType: string | null,
    actorId: string | null,
    labelByUserId: Map<string, string>,
    nameByUserId: Map<string, string | null>,
  ): { actorLabel: string; actorName: string | null } {
    if ((actorType === "user" || actorType === "mcp") && actorId) {
      return {
        actorLabel: labelByUserId.get(actorId) ?? "Unknown",
        actorName: nameByUserId.get(actorId) ?? null,
      };
    }
    if (actorType === "api-key") {
      return { actorLabel: "API key", actorName: null };
    }
    return { actorLabel: "System", actorName: null };
  }
}