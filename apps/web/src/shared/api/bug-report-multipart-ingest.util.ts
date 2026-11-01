import { container } from "@workspace/server/container";
import type { CreateBugReportScreenshotInput } from "@workspace/server/modules/bug-report/application/create-bug-report.use-case";
import type { CreateBugReportReplayInput } from "@workspace/server/modules/bug-report/application/create-bug-report.use-case";
import { AppError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";
import {
  BUG_REPORT_REPLAY_ALLOWED_MIME_TYPES,
  BUG_REPORT_REPLAY_MAX_BYTES,
} from "@workspace/validation/modules/bug-report/consts/bug-report-replay.const";
import {
  BUG_REPORT_SCREENSHOT_ALLOWED_MIME_TYPES,
  BUG_REPORT_SCREENSHOT_MAX_BYTES,
} from "@workspace/validation/modules/bug-report/consts/bug-report-screenshot.const";
import {
  BUG_REPORT_CONSOLE_LOG_MAX_ENTRIES,
  BUG_REPORT_NETWORK_LOG_MAX_ENTRIES,
  bugReportConsoleLogEntrySchema,
  bugReportNetworkLogEntrySchema,
} from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";
import {
  BUG_REPORT_REPLAY_FORM_FIELD,
  BUG_REPORT_SCREENSHOT_FORM_FIELD,
  bugReportCustomContextInputSchema,
  createBugReportInputDtoSchema,
  type CreateBugReportInputDtoType,
  createBugReportMultipartFieldsSchema,
} from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";
import { z } from "zod";

function appErrorStatus(code: AppError["code"]): number {
  switch (code) {
    case "BAD_REQUEST":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "TOO_MANY_REQUESTS":
      return 429;
    default:
      return 500;
  }
}

function errorResponse(error: unknown): Response {
  if (error instanceof AppError) {
    return Response.json(
      { message: error.message, data: { errorCode: error.errorCode } },
      { status: appErrorStatus(error.code) },
    );
  }

  if (error instanceof z.ZodError) {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }

  return Response.json({ message: "Internal server error" }, { status: 500 });
}

function parseOptionalLogJson<T>(
  raw: string | undefined,
  itemSchema: z.ZodType<T>,
  maxEntries: number,
): T[] | undefined {
  if (raw === undefined || raw.trim().length === 0) return undefined;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new z.ZodError([]);
  }

  return z.array(itemSchema).max(maxEntries).parse(parsed);
}

function parseOptionalContextJson(raw: string | undefined): Record<string, unknown> | undefined {
  if (raw === undefined || raw.trim().length === 0) return undefined;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new z.ZodError([]);
  }

  return bugReportCustomContextInputSchema.parse(parsed);
}

async function parseScreenshot(file: File): Promise<CreateBugReportScreenshotInput> {
  if (file.size > BUG_REPORT_SCREENSHOT_MAX_BYTES) {
    throw new AppError(
      "BAD_REQUEST",
      ERROR_CODES.SCREENSHOT_TOO_LARGE,
      `Screenshot must be at most ${BUG_REPORT_SCREENSHOT_MAX_BYTES} bytes`,
    );
  }

  const mimeType = file.type.trim().length > 0 ? file.type : "image/png";
  if (
    !BUG_REPORT_SCREENSHOT_ALLOWED_MIME_TYPES.includes(
      mimeType as (typeof BUG_REPORT_SCREENSHOT_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    throw new AppError("BAD_REQUEST", ERROR_CODES.INVALID_SCREENSHOT, "Screenshot must be PNG or JPEG");
  }

  return { data: new Uint8Array(await file.arrayBuffer()), mimeType };
}

async function parseReplay(file: File): Promise<CreateBugReportReplayInput> {
  if (file.size > BUG_REPORT_REPLAY_MAX_BYTES) {
    throw new AppError(
      "BAD_REQUEST",
      ERROR_CODES.REPLAY_TOO_LARGE,
      `Replay must be at most ${BUG_REPORT_REPLAY_MAX_BYTES} bytes`,
    );
  }

  const mimeType = file.type.trim().length > 0 ? file.type : "application/gzip";
  if (
    !BUG_REPORT_REPLAY_ALLOWED_MIME_TYPES.includes(mimeType as (typeof BUG_REPORT_REPLAY_ALLOWED_MIME_TYPES)[number])
  ) {
    throw new AppError("BAD_REQUEST", ERROR_CODES.INVALID_REPLAY, "Replay must be gzip or JSON");
  }

  return { data: new Uint8Array(await file.arrayBuffer()), mimeType };
}

async function buildInput(formData: FormData): Promise<{
  input: CreateBugReportInputDtoType;
  screenshot?: CreateBugReportScreenshotInput;
  replay?: CreateBugReportReplayInput;
}> {
  const screenshotFile = formData.get(BUG_REPORT_SCREENSHOT_FORM_FIELD);
  let screenshot: CreateBugReportScreenshotInput | undefined;
  if (screenshotFile instanceof File && screenshotFile.size > 0) {
    screenshot = await parseScreenshot(screenshotFile);
  }

  const replayFile = formData.get(BUG_REPORT_REPLAY_FORM_FIELD);
  let replay: CreateBugReportReplayInput | undefined;
  if (replayFile instanceof File && replayFile.size > 0) {
    replay = await parseReplay(replayFile);
  }

  const fields = createBugReportMultipartFieldsSchema.parse({
    apiKey: formData.get("apiKey"),
    title: formData.get("title"),
    description: formData.get("description"),
    url: formData.get("url"),
    userAgent: formData.get("userAgent") ?? undefined,
    viewportWidth: formData.get("viewportWidth") ?? undefined,
    viewportHeight: formData.get("viewportHeight") ?? undefined,
    consoleLogsJson: formData.get("consoleLogs") ?? undefined,
    networkLogsJson: formData.get("networkLogs") ?? undefined,
    reporterEmail: formData.get("reporterEmail") ?? undefined,
    customContextJson: formData.get("customContext") ?? undefined,
    severity: formData.get("severity") ?? undefined,
  });

  const consoleLogs = parseOptionalLogJson(
    fields.consoleLogsJson,
    bugReportConsoleLogEntrySchema,
    BUG_REPORT_CONSOLE_LOG_MAX_ENTRIES,
  );
  const networkLogs = parseOptionalLogJson(
    fields.networkLogsJson,
    bugReportNetworkLogEntrySchema,
    BUG_REPORT_NETWORK_LOG_MAX_ENTRIES,
  );
  const customContext = parseOptionalContextJson(fields.customContextJson);

  const input = createBugReportInputDtoSchema.parse({
    apiKey: fields.apiKey,
    title: fields.title,
    description: fields.description,
    url: fields.url,
    userAgent: fields.userAgent,
    viewportWidth: fields.viewportWidth,
    viewportHeight: fields.viewportHeight,
    reporterEmail: fields.reporterEmail,
    customContext,
    consoleLogs,
    networkLogs,
    severity: fields.severity,
  });

  return { input, screenshot, replay };
}

export async function ingestBugReportMultipart(request: Request, context: OrpcContext): Promise<Response> {
  try {
    const formData = await request.formData();
    const { input, screenshot, replay } = await buildInput(formData);
    const result = await container.bugReport.createBugReport.execute(
      input,
      context.actor,
      context.requestOrigin,
      screenshot,
      replay,
    );
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
