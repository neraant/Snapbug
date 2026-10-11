import type { auditActorTypes } from "@workspace/database/schema/audit-log.const";

export type AuditActorType = (typeof auditActorTypes)[number];

export type AuditActor = {
  type: AuditActorType;
  id: string | null;
};

export type AuditLogChangesType = Record<string, { from: unknown; to: unknown }>;

export type AuditLogPersistedType = {
  id: string;
  action: string;
  actorType: AuditActorType | null;
  actorId: string | null;
  entityType: string;
  entityId: string;
  projectId: string;
  occurredAt: Date;
  changes: AuditLogChangesType;
};

export type OpenMetricsAtInstant = {
  open: number;
  criticalHigh: number;
};
