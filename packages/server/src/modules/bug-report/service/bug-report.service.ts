import type { DbClient } from "@workspace/database";
import type { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import { BugReportFactory } from "@workspace/server/modules/bug-report/entity/bug-report.factory";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { CreateBugReportType } from "@workspace/server/modules/bug-report/entity/bug-report.types";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type { AuditLogService } from "@workspace/server/shared/audit/audit-log.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";

const BUG_REPORT_ENTITY_TYPE = "bug-report";

export class BugReportService {
  constructor(
    private readonly bugReportRepository: BugReportRepository,
    private readonly auditLogService: AuditLogService,
    private readonly actor: AuditActor | null = null,
  ) {}

  withTx(tx: DbClient): BugReportService {
    return new BugReportService(this.bugReportRepository.withTx(tx), this.auditLogService.withTx(tx), this.actor);
  }

  withActor(actor: AuditActor | null): BugReportService {
    return new BugReportService(this.bugReportRepository, this.auditLogService, actor);
  }

  async createWithAudit(
    input: Omit<CreateBugReportType, "shortId"> & { organizationId: string },
    action: string,
  ): Promise<BugReport> {
    const shortId = await this.bugReportRepository.allocateShortId(input.organizationId);
    const bugReport = BugReportFactory.create({ ...input, shortId });
    await this.saveWithAudit(bugReport, action);
    return bugReport;
  }

  async saveWithAudit(bugReport: BugReport, action: string): Promise<void> {
    const previous = await this.bugReportRepository.findById(bugReport.id);
    await this.bugReportRepository.save(bugReport);
    const saved = await this.bugReportRepository.findById(bugReport.id);
    if (!saved) return;

    await this.auditLogService.save({
      action,
      entityType: BUG_REPORT_ENTITY_TYPE,
      entityId: saved.id,
      projectId: saved.projectId,
      actor: this.actor,
      oldSnapshot: previous ? BugReportMapper.toAudit(previous) : null,
      newSnapshot: BugReportMapper.toAudit(saved),
    });
  }
}
