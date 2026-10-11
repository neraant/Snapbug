import type { AuditLogPersistedType } from "@workspace/server/shared/audit/audit-log.types";

export class AuditLog {
  readonly id: AuditLogPersistedType["id"];
  readonly action: AuditLogPersistedType["action"];
  readonly actorType: AuditLogPersistedType["actorType"];
  readonly actorId: AuditLogPersistedType["actorId"];
  readonly entityType: AuditLogPersistedType["entityType"];
  readonly entityId: AuditLogPersistedType["entityId"];
  readonly projectId: AuditLogPersistedType["projectId"];
  readonly occurredAt: AuditLogPersistedType["occurredAt"];
  readonly changes: AuditLogPersistedType["changes"];

  constructor(row: AuditLogPersistedType) {
    this.id = row.id;
    this.action = row.action;
    this.actorType = row.actorType;
    this.actorId = row.actorId;
    this.entityType = row.entityType;
    this.entityId = row.entityId;
    this.projectId = row.projectId;
    this.occurredAt = row.occurredAt;
    this.changes = row.changes;
  }

  toObject(): AuditLogPersistedType {
    return {
      id: this.id,
      action: this.action,
      actorType: this.actorType,
      actorId: this.actorId,
      entityType: this.entityType,
      entityId: this.entityId,
      projectId: this.projectId,
      occurredAt: this.occurredAt,
      changes: this.changes,
    };
  }
}
