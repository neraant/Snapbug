import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { auditLogTable } from "@workspace/database/schema";
import type { AuditLog } from "@workspace/server/shared/audit/audit-log.entity";
import { AuditLogMapper } from "@workspace/server/shared/audit/audit-log.mapper";
import type { OpenMetricsAtInstant } from "@workspace/server/shared/audit/audit-log.types";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";
import { and, asc, desc, eq, inArray, lte } from "drizzle-orm";

const BUG_REPORT_ENTITY_TYPE = "bug-report";
const openStatuses = new Set<string>([BugReportStatus.NEW, BugReportStatus.IN_PROGRESS]);
const criticalHighSeverities = new Set<string>([BugReportSeverity.HIGH, BugReportSeverity.CRITICAL]);

type EntityReplayState = {
  status?: string;
  severity?: string;
};

export class AuditLogRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): AuditLogRepository {
    return new AuditLogRepository(tx);
  }

  async findManyByOrganizationId(organizationId: string): Promise<AuditLog[]> {
    const rows = await this.db
      .select()
      .from(auditLogTable)
      .where(eq(auditLogTable.organizationId, organizationId))
      .orderBy(desc(auditLogTable.occurredAt), desc(auditLogTable.id));

    return rows.map((row) => AuditLogMapper.fromPersistence(row));
  }

  async append(auditLog: AuditLog): Promise<void> {
    try {
      await this.db.insert(auditLogTable).values(AuditLogMapper.toPersistence(auditLog));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async replayOpenBugReportMetrics(projectIds: string[], instants: Date[]): Promise<OpenMetricsAtInstant[]> {
    if (instants.length === 0) return [];

    const indexedInstants = instants
      .map((instant, index) => ({ instant, index }))
      .sort((a, b) => a.instant.getTime() - b.instant.getTime());
    const maxInstant = indexedInstants[indexedInstants.length - 1]!.instant;

    const rows = await this.db
      .select({
        entityId: auditLogTable.entityId,
        occurredAt: auditLogTable.occurredAt,
        changes: auditLogTable.changes,
      })
      .from(auditLogTable)
      .where(
        and(
          inArray(auditLogTable.projectId, projectIds),
          lte(auditLogTable.occurredAt, maxInstant),
          eq(auditLogTable.entityType, BUG_REPORT_ENTITY_TYPE),
        ),
      )
      .orderBy(asc(auditLogTable.occurredAt), asc(auditLogTable.id));

    const results: OpenMetricsAtInstant[] = instants.map(() => ({ open: 0, criticalHigh: 0 }));
    const entityStates = new Map<string, EntityReplayState>();
    let logCursor = 0;

    const snapshotMetrics = () => {
      let open = 0;
      let criticalHigh = 0;
      for (const state of entityStates.values()) {
        if (!state.status || !openStatuses.has(state.status)) continue;
        open += 1;
        if (state.severity && criticalHighSeverities.has(state.severity)) {
          criticalHigh += 1;
        }
      }
      return { open, criticalHigh };
    };

    const applyLog = (row: (typeof rows)[number]) => {
      const state = entityStates.get(row.entityId) ?? {};
      for (const [field, change] of Object.entries(row.changes)) {
        if (field === "status" && change.to !== undefined) {
          state.status = change.to as string;
        }
        if (field === "severity" && change.to !== undefined) {
          state.severity = change.to as string;
        }
      }
      entityStates.set(row.entityId, state);
    };

    for (const { instant, index } of indexedInstants) {
      while (logCursor < rows.length && rows[logCursor]!.occurredAt.getTime() <= instant.getTime()) {
        applyLog(rows[logCursor]!);
        logCursor += 1;
      }
      results[index] = snapshotMetrics();
    }

    return results;
  }
}
