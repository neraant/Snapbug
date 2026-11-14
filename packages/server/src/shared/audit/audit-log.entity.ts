import type { AuditLogPersistedType } from "@workspace/server/shared/audit/audit-log.types";

export class AuditLog {
  readonly id: AuditLogPersistedType["id"];
  readonly action: AuditLogPersistedType["action"];
  readonly actorType: AuditLogPersistedType["actorType"];
  readonly actorId: AuditLogPersistedType["actorId"];
  readonly entityType: AuditLogPersistedType["entityType"];
  readonly entityId: AuditLogPersistedType["entityId"];
  readonly organizationId: AuditLogPersistedType["organizationId"];
  readonly projectId: AuditLogPersistedType["projectId"];
  readonly source: AuditLogPersistedType["source"];
  readonly occurredAt: AuditLogPersistedType["occurredAt"];
  readonly changes: AuditLogPersistedType["changes"];

  constructor(row: AuditLogPersistedType) {
    this.id = row.id;
    this.action = row.action;
    this.actorType = row.actorType;
    this.actorId = row.actorId;
    this.entityType = row.entityType;
    this.entityId = row.entityId;
    this.organizationId = row.organizationId;
    this.projectId = row.projectId;
    this.source = row.source;
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
      organizationId: this.organizationId,
      projectId: this.projectId,
      source: this.source,
      occurredAt: this.occurredAt,
      changes: this.changes,
    };
  }
}
