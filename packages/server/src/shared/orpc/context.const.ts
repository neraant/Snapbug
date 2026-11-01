import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";
import type { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export interface OrpcContext {
  user: { id: string; email: string; name: string | null; role?: UserRole } | null;
  organizationId: string | null;
  ip: string;
  actor: AuditActor;
  requestOrigin: string | null;
}
