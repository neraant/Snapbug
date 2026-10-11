import { AuditLog } from "@workspace/server/shared/audit/audit-log.entity";
import type { AuditLogRepository } from "@workspace/server/shared/audit/audit-log.repository";
import type { AuditActor, AuditLogChangesType } from "@workspace/server/shared/audit/audit-log.types";
import { randomUUID } from "crypto";

export class AuditLogService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  withTx(tx: unknown): AuditLogService {
    return new AuditLogService(this.auditLogRepository.withTx(tx as Parameters<AuditLogRepository["withTx"]>[0]));
  }

  async save(input: {
    action: string;
    entityType: string;
    entityId: string;
    projectId: string;
    actor: AuditActor | null;
    oldSnapshot: Record<string, unknown> | null;
    newSnapshot: Record<string, unknown>;
  }): Promise<void> {
    const changes = this.diffSnapshots(input.oldSnapshot, input.newSnapshot);
    if (Object.keys(changes).length === 0) return;

    const auditLog = new AuditLog({
      id: randomUUID(),
      action: input.action,
      actorType: input.actor?.type ?? null,
      actorId: input.actor?.id ?? null,
      entityType: input.entityType,
      entityId: input.entityId,
      projectId: input.projectId,
      occurredAt: new Date(),
      changes,
    });

    await this.auditLogRepository.append(auditLog);
  }

  private diffSnapshots(
    oldSnapshot: Record<string, unknown> | null,
    newSnapshot: Record<string, unknown>,
  ): AuditLogChangesType {
    const changes: AuditLogChangesType = {};

    for (const [field, to] of Object.entries(newSnapshot)) {
      const from = oldSnapshot?.[field] ?? null;
      if (!this.valuesEqual(from, to)) {
        changes[field] = { from, to };
      }
    }

    return changes;
  }

  private valuesEqual(left: unknown, right: unknown): boolean {
    if (left instanceof Date && right instanceof Date) {
      return left.getTime() === right.getTime();
    }
    return Object.is(left, right);
  }
}
