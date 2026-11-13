import { AuditLog } from "@workspace/server/shared/audit/audit-log.entity";
import type { AuditLogRepository } from "@workspace/server/shared/audit/audit-log.repository";
import type { AuditActor, AuditLogChangesType, AuditSource } from "@workspace/server/shared/audit/audit-log.types";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
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
    projectId: string | null;
    organizationId?: string;
    actor: AuditActor | null;
    oldSnapshot: Record<string, unknown> | null;
    newSnapshot: Record<string, unknown>;
  }): Promise<void> {
    const changes = this.diffSnapshots(input.oldSnapshot, input.newSnapshot);
    if (Object.keys(changes).length === 0) return;

    const organizationId = await this.resolveOrganizationId(input.organizationId, input.projectId);
    const auditLog = new AuditLog({
      id: randomUUID(),
      action: input.action,
      actorType: input.actor?.type ?? null,
      actorId: input.actor?.id ?? null,
      entityType: input.entityType,
      entityId: input.entityId,
      organizationId,
      projectId: input.projectId,
      source: this.sourceFor(input.actor),
      occurredAt: new Date(),
      changes,
    });

    await this.auditLogRepository.append(auditLog);
  }

  private sourceFor(actor: AuditActor | null): AuditSource {
    return actor?.type === "mcp" ? "mcp" : "web";
  }

  private async resolveOrganizationId(organizationId: string | undefined, projectId: string | null): Promise<string> {
    if (organizationId) return organizationId;
    if (!projectId) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, "Activity log is missing an organization");
    }

    const resolved = await this.auditLogRepository.findOrganizationIdByProjectId(projectId);
    if (!resolved) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, "Activity log is missing an organization");
    }

    return resolved;
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
