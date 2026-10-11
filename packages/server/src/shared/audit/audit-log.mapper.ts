import { AuditLog } from "@workspace/server/shared/audit/audit-log.entity";
import type { AuditLogPersistedType } from "@workspace/server/shared/audit/audit-log.types";

export abstract class AuditLogMapper {
  static fromPersistence(row: AuditLogPersistedType): AuditLog {
    return new AuditLog(row);
  }

  static toPersistence(auditLog: AuditLog): AuditLogPersistedType {
    return auditLog.toObject();
  }
}
