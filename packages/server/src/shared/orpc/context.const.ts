import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";

export interface OrpcContext {
  user: { id: string; email: string; name: string | null } | null;
  ip: string;
  actor: AuditActor;
  requestOrigin: string | null;
}
