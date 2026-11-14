import type { auditActorTypes, auditSources } from "@workspace/database/schema/audit-log.const";

export type AuditActorType = (typeof auditActorTypes)[number];
export type AuditSource = (typeof auditSources)[number];

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
  organizationId: string;
  projectId: string | null;
  source: AuditSource;
  occurredAt: Date;
  changes: AuditLogChangesType;
};

export type OpenMetricsAtInstant = {
  open: number;
  criticalHigh: number;
};
