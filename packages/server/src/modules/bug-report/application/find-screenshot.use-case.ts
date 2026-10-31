import type { FileStoragePort } from "@workspace/server/modules/bug-report/port/file-storage.port";
import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import type { BugReportRepository } from "@workspace/server/modules/bug-report/repository/bug-report.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { FindScreenshotInputDtoType } from "@workspace/validation/modules/bug-report/dto/find-screenshot.schema";

export type FindScreenshotResult = {
  bytes: Uint8Array;
  contentType: string;
};

export class FindScreenshotUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly bugReportRepository: BugReportRepository,
    private readonly fileStoragePort: FileStoragePort,
  ) {}

  async execute(input: FindScreenshotInputDtoType, userId: string): Promise<FindScreenshotResult> {
    const membership = await this.membershipPort.findByUser(userId);
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const bugReport = await this.bugReportRepository.findByShortIdAndOrganizationId(
      input.shortId,
      membership.organizationId,
    );
    if (!bugReport) throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);

    const screenshotKey = bugReport.screenshotKey;
    if (!screenshotKey) throw new NotFoundError(ERROR_CODES.BUG_REPORT_NOT_FOUND);

    return await this.fileStoragePort.readBugReportScreenshot(screenshotKey);
  }
}
