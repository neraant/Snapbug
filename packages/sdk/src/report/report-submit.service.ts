import type {
  BugReportConsoleLogEntryType,
  BugReportNetworkLogEntryType,
} from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";
import { BUG_REPORT_SCREENSHOT_MAX_BYTES } from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";
import { projectWidgetSettingModelDefaults } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

import { snapshotCollectorBuffers } from "../collector/collector-buffer";
import { bugReportEndpoint } from "../core/widget-endpoint.util";
import { widgetState } from "../core/widget-state";
import { scrubAutomaticData, scrubCustomContext } from "../privacy/privacy-scrub.service";
import { COPY } from "../widget/widget-copy.const";
import type { SubmitReportFailure } from "./report-submit.types";

type ReportPayload = {
  apiKey: string;
  title: string;
  description: string;
  url: string;
  userAgent: string;
  viewportWidth: number;
  viewportHeight: number;
  consoleLogs?: BugReportConsoleLogEntryType[];
  networkLogs?: BugReportNetworkLogEntryType[];
  reporterEmail?: string;
  customContext?: Record<string, unknown>;
};

export async function submitReport(title: string, description: string, screenshot: Blob | null) {
  const apiKey = widgetState.apiKey;
  const host = widgetState.host;
  if (!apiKey) throw new Error("API key is not set");
  if (host === null) throw new Error("Host is not set");
  if (screenshot && screenshot.size > BUG_REPORT_SCREENSHOT_MAX_BYTES) {
    throw { message: COPY.screenshotTooLarge };
  }

  const response = await postReport(host, buildReportPayload(apiKey, title, description), screenshot);
  if (!response.ok) {
    const failure = await readSubmitReportFailure(response);
    if (failure) throw failure;
    throw new Error("Failed to submit report");
  }

  return readShortId(response);
}

export async function readSubmitReportFailure(response: Response): Promise<SubmitReportFailure | null> {
  try {
    const body = (await response.json()) as {
      message?: unknown;
    };
    if (typeof body.message !== "string" || body.message.trim().length === 0) return null;

    return { message: body.message.trim() };
  } catch {
    return null;
  }
}

function buildReportPayload(apiKey: string, title: string, description: string): ReportPayload {
  const privacy = widgetState.privacy ?? projectWidgetSettingModelDefaults.privacy;
  const { consoleLogs, networkLogs } = snapshotCollectorBuffers();
  const scrubbed = scrubAutomaticData(privacy, {
    url: location.href,
    consoleLogs,
    networkLogs,
  });
  const customContext = widgetState.customContext;
  const scrubbedContext = customContext !== null ? scrubCustomContext(customContext) : undefined;
  const identifiedEmail = widgetState.identifiedEmail;

  return {
    apiKey,
    title,
    description,
    url: scrubbed.url,
    userAgent: navigator.userAgent,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    ...(scrubbed.consoleLogs.length > 0 ? { consoleLogs: scrubbed.consoleLogs } : {}),
    ...(scrubbed.networkLogs.length > 0 ? { networkLogs: scrubbed.networkLogs } : {}),
    ...(identifiedEmail ? { reporterEmail: identifiedEmail } : {}),
    ...(scrubbedContext !== undefined ? { customContext: scrubbedContext } : {}),
  };
}

function postReport(apiHost: string, payload: ReportPayload, screenshot: Blob | null) {
  if (!screenshot) {
    return fetch(bugReportEndpoint(apiHost), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  return fetch(bugReportEndpoint(apiHost), {
    method: "POST",
    body: reportFormData(payload, screenshot),
  });
}

function reportFormData(payload: ReportPayload, screenshot: Blob) {
  const formData = new FormData();
  formData.set("apiKey", payload.apiKey);
  formData.set("title", payload.title);
  formData.set("description", payload.description);
  formData.set("url", payload.url);
  formData.set("userAgent", payload.userAgent);
  formData.set("viewportWidth", String(payload.viewportWidth));
  formData.set("viewportHeight", String(payload.viewportHeight));
  if (payload.consoleLogs) formData.set("consoleLogs", JSON.stringify(payload.consoleLogs));
  if (payload.networkLogs) formData.set("networkLogs", JSON.stringify(payload.networkLogs));
  if (payload.reporterEmail) formData.set("reporterEmail", payload.reporterEmail);
  if (payload.customContext) formData.set("customContext", JSON.stringify(payload.customContext));
  formData.set("screenshot", screenshot, "screenshot.png");
  return formData;
}

async function readShortId(response: Response) {
  const body = (await response.json()) as { id?: string; shortId?: unknown };
  return typeof body.shortId === "string" && body.shortId.trim().length > 0 ? body.shortId.trim() : null;
}
