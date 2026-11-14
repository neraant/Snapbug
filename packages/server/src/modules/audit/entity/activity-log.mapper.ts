import type { AuditLog } from "@workspace/server/shared/audit/audit-log.entity";
import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";

export abstract class ActivityLogMapper {
  static toDto(auditLog: AuditLog, actorLabel: string): ActivityLogType {
    const row = auditLog.toObject();

    return {
      id: row.id,
      occurredAt: row.occurredAt.toISOString(),
      actorLabel,
      entityType: row.entityType,
      entityId: row.entityId,
      action: row.action,
      source: row.source,
      changes: Object.entries(row.changes).map(([field, change]) => ({
        field,
        from: ActivityLogMapper.formatValue(change.from),
        to: ActivityLogMapper.formatValue(change.to),
      })),
    };
  }

  static formatValue(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return JSON.stringify(value);
  }
}
