import type { DbClient } from "@workspace/database";
import { FindManyForSearchUseCase } from "@workspace/server/modules/bug-report/application/find-many-for-search.use-case";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import type {
  BugReportPort,
  BugReportSearchRowType,
} from "@workspace/server/modules/search/port/bug-report.port";

export class SearchBugReportAdapter implements BugReportPort {
  private readonly findManyForSearchUseCase: FindManyForSearchUseCase;

  constructor(private readonly bugReportRepository: BugReportRepository) {
    this.findManyForSearchUseCase = new FindManyForSearchUseCase(bugReportRepository);
  }

  withTx(tx: unknown): SearchBugReportAdapter {
    return new SearchBugReportAdapter(this.bugReportRepository.withTx(tx as DbClient));
  }

  async findManyForSearch(projectIds: string[], query: string, limit: number): Promise<BugReportSearchRowType[]> {
    return await this.findManyForSearchUseCase.execute(projectIds, query, limit);
  }
}