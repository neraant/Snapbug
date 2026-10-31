import { BUG_REPORT_SCREENSHOT_MAX_BYTES } from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";

import { bugReportEndpoint } from "../core/widget-endpoint.util";
import { widgetState } from "../core/widget-state";
import { REPLAY_FORM_FIELD } from "../replay/replay.const";
import { snapshotReplayEvents } from "../replay/replay-buffer";
import { buildReplayBlob } from "../replay/replay-compress.util";
import { COPY } from "../widget/widget-copy.const";
import { buildReportPayload, type ReportPayload } from "./report-payload.util";
import type { SubmitReportFailure, SubmitReportInput } from "./report-submit.types";

export async function submitReport(input: SubmitReportInput) {
  const apiKey = widgetState.apiKey;
  const host = widgetState.host;
  if (!apiKey) throw new Error("API key is not set");
  if (host === null) throw new Error("Host is not set");
  const { screenshot, diagnostics } = input;
  if (screenshot && screenshot.size > BUG_REPORT_SCREENSHOT_MAX_BYTES) {
    throw { message: COPY.screenshotTooLarge };
  }

  const replay = diagnostics.replay ? await buildReplayBlob(snapshotReplayEvents()) : null;
  const payload = buildReportPayload(apiKey, input);
  const response = await postReport(host, payload, screenshot, replay?.blob ?? null);
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

function postReport(apiHost: string, payload: ReportPayload, screenshot: Blob | null, replay: Blob | null) {
  if (!screenshot && !replay) {
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
    body: reportFormData(payload, screenshot, replay),
  });
}

function reportFormData(payload: ReportPayload, screenshot: Blob | null, replay: Blob | null) {
  const formData = new FormData();
  formData.set("apiKey", payload.apiKey);
  formData.set("title", payload.title);
  formData.set("description", payload.description);
  formData.set("severity", payload.severity);
  formData.set("url", payload.url);
  if (payload.userAgent !== undefined) formData.set("userAgent", payload.userAgent);
  if (payload.viewportWidth !== undefined) formData.set("viewportWidth", String(payload.viewportWidth));
  if (payload.viewportHeight !== undefined) formData.set("viewportHeight", String(payload.viewportHeight));
  if (payload.consoleLogs) formData.set("consoleLogs", JSON.stringify(payload.consoleLogs));
  if (payload.networkLogs) formData.set("networkLogs", JSON.stringify(payload.networkLogs));
  if (payload.reporterEmail) formData.set("reporterEmail", payload.reporterEmail);
  if (payload.customContext) formData.set("customContext", JSON.stringify(payload.customContext));
  if (screenshot) formData.set("screenshot", screenshot, "screenshot.png");
  if (replay)
    formData.set(REPLAY_FORM_FIELD, replay, replay.type === "application/gzip" ? "replay.json.gz" : "replay.json");
  return formData;
}

async function readShortId(response: Response) {
  const body = (await response.json()) as { id?: string; shortId?: unknown };
  return typeof body.shortId === "string" && body.shortId.trim().length > 0 ? body.shortId.trim() : null;
}
