import type { BugReport } from "@workspace/server/modules/bug-report/entity/bug-report.entity";
import type { FileStoragePort } from "@workspace/server/modules/bug-report/port/file-storage.port";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { FindReplayInputDtoType } from "@workspace/validation/modules/bug-report/dto/find-replay.schema";

function resolveReplayStorageKey(bugReport: BugReport): string | null {
  if (bugReport.replayKey) return bugReport.replayKey;
  if (!bugReport.hasReplay) return null;
  return `bug-reports/${bugReport.id}/replay.json.gz`;
}

export type FindReplayResult = {
  bytes: Uint8Array;
  contentType: string;
};

export class FindReplayUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly bugReportRepository: BugReportRepository,
    private readonly fileStoragePort: FileStoragePort,
  ) {}

  async execute(input: FindReplayInputDtoType, userId: string): Promise<FindReplayResult> {
    const membership = await this.membershipPort.findByUser(userId);
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const bugReport = await this.bugReportRepository.findByShortIdAndOrganizationId(
      input.shortId,
      membership.organizationId,
    );
    if (!bugReport) throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);

    const replayKey = resolveReplayStorageKey(bugReport);
    if (!replayKey) throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);

    return await this.fileStoragePort.readBugReportReplay(replayKey);
  }
}
