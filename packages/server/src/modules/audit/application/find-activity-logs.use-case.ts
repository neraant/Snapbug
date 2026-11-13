import { ActivityLogMapper } from "@workspace/server/modules/audit/entity/activity-log.mapper";
import type { MembershipPort } from "@workspace/server/modules/audit/port/membership.port";
import type { UserPort } from "@workspace/server/modules/audit/port/user.port";
import type { AuditLogRepository } from "@workspace/server/shared/audit/audit-log.repository";
import { ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { FindActivityLogsOutputDtoType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class FindActivityLogsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly userPort: UserPort,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(userId: string, organizationId: string | null): Promise<FindActivityLogsOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);
    if (membership.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_CODES.ADMIN_REQUIRED, "Administrator access is required");
    }

    const auditLogs = await this.auditLogRepository.findManyByOrganizationId(organizationId);
    const actorIds = [
      ...new Set(
        auditLogs.flatMap((auditLog) => (auditLog.actorType === "user" && auditLog.actorId ? [auditLog.actorId] : [])),
      ),
    ];
    const users = actorIds.length === 0 ? [] : await this.userPort.findManyByIds(actorIds);
    const labelByUserId = new Map(users.map((user) => [user.id, user.email]));

    return auditLogs.map((auditLog) =>
      ActivityLogMapper.toDto(auditLog, this.actorLabel(auditLog.actorType, auditLog.actorId, labelByUserId)),
    );
  }

  private actorLabel(actorType: string | null, actorId: string | null, labelByUserId: Map<string, string>): string {
    if (actorType === "mcp") return "MCP";
    if (actorType === "api-key") return "API key";
    if (actorType === "user" && actorId) return labelByUserId.get(actorId) ?? "Unknown";
    return "Unknown";
  }
}
