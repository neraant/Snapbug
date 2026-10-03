import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { bugReportTable } from "@workspace/database/schema";
import type { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { desc, inArray } from "drizzle-orm";

export class BugReportRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  async findManyByProjectIds(projectIds: string[]): Promise<BugReport[]> {
    const bugReports = await this.db
      .select()
      .from(bugReportTable)
      .where(inArray(bugReportTable.projectId, projectIds))
      .orderBy(desc(bugReportTable.createdAt));
    return bugReports.map((bugReport) => BugReportMapper.fromPersistence(bugReport));
  }

  async save(bugReport: BugReport): Promise<void> {
    try {
      await this.db.insert(bugReportTable).values(BugReportMapper.toPersistence(bugReport));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
