import { BugReportMapper } from "@workspace/server/modules/bug-report/entity/bug-report.mapper";
import type { ApiKeyPort } from "@workspace/server/modules/bug-report/port/api-key.port";
import type { FileStoragePort } from "@workspace/server/modules/bug-report/port/file-storage.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import type { BugReportService } from "@workspace/server/modules/bug-report/service/bug-report.service";
import type { WidgetIngestOriginService } from "@workspace/server/modules/bug-report/service/widget-ingest-origin.service";
import type { WidgetUserAgentService } from "@workspace/server/modules/bug-report/service/widget-user-agent.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { BadRequestError, UnauthorizedError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import {
  BUG_REPORT_REPLAY_ALLOWED_MIME_TYPES,
  BUG_REPORT_REPLAY_MAX_BYTES,
} from "@workspace/validation/modules/bug-report/consts/bug-report-replay.const";
import {
  BUG_REPORT_SCREENSHOT_ALLOWED_MIME_TYPES,
  BUG_REPORT_SCREENSHOT_MAX_BYTES,
} from "@workspace/validation/modules/bug-report/consts/bug-report-screenshot.const";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import type {
  CreateBugReportInputDtoType,
  CreateBugReportOutputDtoType,
} from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";
import { projectWidgetSettingModelDefaults } from "@workspace/validation/modules/project/dto/project-widget-setting.model";
import { randomUUID } from "crypto";

export type CreateBugReportScreenshotInput = {
  data: Uint8Array;
  mimeType: string;
};

export type CreateBugReportReplayInput = {
  data: Uint8Array;
  mimeType: string;
};

export class CreateBugReportUseCase {
  constructor(
    private readonly apiKeyPort: ApiKeyPort,
    private readonly projectPort: ProjectPort,
    private readonly bugReportService: BugReportService,
    private readonly withTransaction: WithTransactionType,
    private readonly widgetIngestOriginService: WidgetIngestOriginService,
    private readonly widgetUserAgentService: WidgetUserAgentService,
    private readonly fileStoragePort: FileStoragePort,
  ) {}

  async execute(
    input: CreateBugReportInputDtoType,
    actor: AuditActor | null,
    requestOrigin: string | null,
    screenshot?: CreateBugReportScreenshotInput,
    replay?: CreateBugReportReplayInput,
  ): Promise<CreateBugReportOutputDtoType> {
    if (screenshot) {
      this.assertValidScreenshot(screenshot);
    }
    if (replay) {
      this.assertValidReplay(replay);
    }

    const project = await this.apiKeyPort.findProjectByKey({ key: input.apiKey });
    if (!project) throw new UnauthorizedError(ERROR_CODES.INVALID_API_KEY);

    const widgetSetting = await this.projectPort.findWidgetSetting(project.id);
    const allowedDomains = widgetSetting?.allowedDomains ?? projectWidgetSettingModelDefaults.allowedDomains;
    this.widgetIngestOriginService.assertAllowed(allowedDomains, requestOrigin);

    const parsedUserAgent = this.widgetUserAgentService.parse(input.userAgent);
    const severity = CreateBugReportUseCase.mapReporterSeverity(input.severity);

    let screenshotKey: string | null = null;
    let replayKey: string | null = null;
    let reportId: string | undefined;

    if (screenshot || replay) {
      reportId = randomUUID();
    }

    if (screenshot && reportId) {
      screenshotKey = await this.fileStoragePort.saveBugReportScreenshot({
        reportId,
        bytes: screenshot.data,
        contentType: screenshot.mimeType,
      });
    }

    if (replay && reportId) {
      replayKey = await this.fileStoragePort.saveBugReportReplay({
        reportId,
        bytes: replay.data,
        contentType: replay.mimeType,
      });
    }

    try {
      const bugReport = await this.withTransaction(async (tx) => {
        const bugReportService = this.bugReportService.withTx(tx).withActor(actor);

        return await bugReportService.createWithAudit(
          {
            organizationId: project.organizationId,
            projectId: project.id,
            ...(reportId ? { id: reportId } : {}),
            title: input.title,
            description: input.description,
            url: input.url,
            userAgent: input.userAgent ?? null,
            browser: parsedUserAgent.browser,
            os: parsedUserAgent.os,
            device: parsedUserAgent.device,
            viewportWidth: input.viewportWidth ?? null,
            viewportHeight: input.viewportHeight ?? null,
            ...(screenshotKey ? { screenshotKey } : {}),
            ...(replayKey ? { replayKey } : {}),
            severity,
            consoleLogs: input.consoleLogs ?? null,
            networkLogs: input.networkLogs ?? null,
            reporterEmail: input.reporterEmail ?? null,
            customContext: input.customContext ?? null,
          },
          "Create bug report",
        );
      });

      return BugReportMapper.toDto(bugReport);
    } catch (error) {
      if (screenshotKey) {
        try {
          await this.fileStoragePort.delete(screenshotKey);
        } catch {
          // ignore cleanup failures
        }
      }
      if (replayKey) {
        try {
          await this.fileStoragePort.delete(replayKey);
        } catch {
          // ignore cleanup failures
        }
      }
      throw error;
    }
  }

  private static mapReporterSeverity(severity: CreateBugReportInputDtoType["severity"]): BugReportSeverity {
    if (!severity) return BugReportSeverity.MEDIUM;
    if (severity === "low") return BugReportSeverity.LOW;
    if (severity === "high") return BugReportSeverity.HIGH;
    return BugReportSeverity.CRITICAL;
  }

  private assertValidScreenshot(screenshot: CreateBugReportScreenshotInput): void {
    if (screenshot.data.byteLength > BUG_REPORT_SCREENSHOT_MAX_BYTES) {
      throw new BadRequestError(
        ERROR_CODES.SCREENSHOT_TOO_LARGE,
        `Screenshot must be at most ${BUG_REPORT_SCREENSHOT_MAX_BYTES} bytes`,
      );
    }

    const allowedMime = new Set<string>(BUG_REPORT_SCREENSHOT_ALLOWED_MIME_TYPES);
    if (!allowedMime.has(screenshot.mimeType)) {
      throw new BadRequestError(ERROR_CODES.INVALID_SCREENSHOT, "Screenshot must be PNG or JPEG");
    }
  }

  private assertValidReplay(replay: CreateBugReportReplayInput): void {
    if (replay.data.byteLength > BUG_REPORT_REPLAY_MAX_BYTES) {
      throw new BadRequestError(
        ERROR_CODES.REPLAY_TOO_LARGE,
        `Replay must be at most ${BUG_REPORT_REPLAY_MAX_BYTES} bytes`,
      );
    }

    const allowedMime = new Set<string>(BUG_REPORT_REPLAY_ALLOWED_MIME_TYPES);
    if (!allowedMime.has(replay.mimeType)) {
      throw new BadRequestError(ERROR_CODES.INVALID_REPLAY, "Replay must be gzip or JSON");
    }
  }
}
