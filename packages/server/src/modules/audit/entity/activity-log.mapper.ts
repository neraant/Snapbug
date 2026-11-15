import type { AuditLog } from "@workspace/server/shared/audit/audit-log.entity";
import type { ActivityLogType } from "@workspace/validation/modules/audit/dto/find-activity-logs.schema";

type ActivityLogActorFields = {
  actorLabel: string;
  actorName: string | null;
};

export abstract class ActivityLogMapper {
  static toDto(auditLog: AuditLog, actor: ActivityLogActorFields): ActivityLogType {
    const row = auditLog.toObject();

    return {
      id: row.id,
      occurredAt: row.occurredAt.toISOString(),
      actorId: row.actorId,
      actorName: actor.actorName,
      actorLabel: actor.actorLabel,
      entityType: row.entityType,
      entityId: row.entityId,
      entityLabel: ActivityLogMapper.entityLabel(row.entityType, row.entityId, row.changes),
      projectId: row.projectId,
      action: row.action,
      source: row.source,
      changes: Object.entries(row.changes).map(([field, change]) => ({
        field,
        from: ActivityLogMapper.formatValue(change.from),
        to: ActivityLogMapper.formatValue(change.to),
      })),
    };
  }

  static entityLabel(
    entityType: string,
    entityId: string,
    changes: AuditLog["changes"],
  ): string {
    const readChangeValue = (field: string): string | null => {
      const change = changes[field];
      const candidate = change?.to ?? change?.from;
      if (typeof candidate === "string" && candidate.trim().length > 0) return candidate.trim();
      return null;
    };

    if (entityType === "invitation") {
      return readChangeValue("email") ?? entityId.slice(0, 8);
    }

    if (entityType === "bug-report") {
      return readChangeValue("title") ?? entityId.slice(0, 8);
    }

    return readChangeValue("name") ?? readChangeValue("email") ?? readChangeValue("title") ?? entityId.slice(0, 8);
  }

  static formatValue(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return JSON.stringify(value);
  }
}
