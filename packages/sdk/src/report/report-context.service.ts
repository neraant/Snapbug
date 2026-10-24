import { bugReportModelSchema } from "@workspace/validation/modules/bug-report/dto/bug-report.model";
import { BUG_REPORT_CUSTOM_CONTEXT_MAX_BYTES } from "@workspace/validation/modules/bug-report/dto/create-bug-report.schema";

import { widgetState } from "../core/widget-state";

const reporterEmailSchema = bugReportModelSchema.shape.reporterEmail;

export function identifyUser(options?: { email?: string }) {
  if (options === undefined) {
    widgetState.identifiedEmail = null;
    return;
  }

  const raw = typeof options.email === "string" ? options.email.trim() : "";
  if (raw.length === 0) {
    widgetState.identifiedEmail = null;
    return;
  }

  const parsed = reporterEmailSchema.safeParse(raw);
  widgetState.identifiedEmail = parsed.success ? raw : null;
}

export function setReportCustomContext(value: Record<string, unknown> | null) {
  if (value === null) {
    widgetState.customContext = null;
    return;
  }

  if (typeof value !== "object" || Array.isArray(value)) return;

  let normalized: Record<string, unknown>;
  try {
    normalized = JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
  } catch {
    return;
  }

  if (typeof normalized !== "object" || normalized === null || Array.isArray(normalized)) return;

  const serialized = JSON.stringify(normalized);
  if (serialized.length > BUG_REPORT_CUSTOM_CONTEXT_MAX_BYTES) return;

  widgetState.customContext = normalized;
}
