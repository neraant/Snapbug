import type {
  BugReportConsoleLogEntryType,
  BugReportNetworkLogEntryType,
} from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";
import { projectWidgetSettingModelDefaults } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

import { snapshotCollectorBuffers } from "../collector/collector-buffer";
import { widgetState } from "../core/widget-state";
import { scrubAutomaticData, scrubCustomContext } from "../privacy/privacy-scrub.service";
import { isValidReporterEmail } from "./report-context.service";
import type { ReportSeverity, SubmitReportInput } from "./report-submit.types";

export type ReportPayload = {
  apiKey: string;
  title: string;
  description: string;
  severity: ReportSeverity;
  url: string;
  userAgent?: string;
  viewportWidth?: number;
  viewportHeight?: number;
  consoleLogs?: BugReportConsoleLogEntryType[];
  networkLogs?: BugReportNetworkLogEntryType[];
  reporterEmail?: string;
  customContext?: Record<string, unknown>;
};

export function buildReportPayload(apiKey: string, input: SubmitReportInput): ReportPayload {
  const { diagnostics } = input;
  const privacy = widgetState.privacy ?? projectWidgetSettingModelDefaults.privacy;
  const { consoleLogs, networkLogs } = snapshotCollectorBuffers();
  const scrubbed = scrubAutomaticData(privacy, {
    url: location.href,
    consoleLogs: diagnostics.console ? consoleLogs : [],
    networkLogs: diagnostics.network ? networkLogs : [],
  });
  const customContext = widgetState.customContext;
  const scrubbedContext = customContext !== null ? scrubCustomContext(customContext) : undefined;
  const reporterEmail = resolveReporterEmail(input.email);

  return {
    apiKey,
    title: input.title,
    description: input.description,
    severity: input.severity,
    url: scrubbed.url,
    ...(diagnostics.environment
      ? {
          userAgent: navigator.userAgent,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        }
      : {}),
    ...(scrubbed.consoleLogs.length > 0 ? { consoleLogs: scrubbed.consoleLogs } : {}),
    ...(scrubbed.networkLogs.length > 0 ? { networkLogs: scrubbed.networkLogs } : {}),
    ...(reporterEmail ? { reporterEmail } : {}),
    ...(scrubbedContext !== undefined ? { customContext: scrubbedContext } : {}),
  };
}

/** Form value wins over identify(); invalid form values fall back to the identified email. */
function resolveReporterEmail(formEmail: string) {
  const trimmed = formEmail.trim();
  if (trimmed.length > 0 && isValidReporterEmail(trimmed)) return trimmed;
  return widgetState.identifiedEmail;
}
