import type { BugReportConsoleLogEntryType } from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";
import type { BugReportNetworkLogEntryType } from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";
import type { ProjectWidgetSettingModelType } from "@workspace/validation/modules/project/dto/project-widget-setting.model";

import { collectRedactionFragments, redactFragments } from "./privacy-fragment.util";
import { scrubJsonValue, scrubUrlQueryValues } from "./privacy-json.util";

export function scrubAutomaticData(
  privacy: ProjectWidgetSettingModelType["privacy"],
  data: {
    url: string;
    consoleLogs: BugReportConsoleLogEntryType[];
    networkLogs: BugReportNetworkLogEntryType[];
    contextText?: string;
  },
): typeof data {
  const fragments = collectRedactionFragments(privacy, data.contextText);

  let url = data.url;
  if (privacy.maskText) {
    url = scrubUrlQueryValues(url);
  }
  if (fragments.length > 0) {
    url = redactFragments(url, fragments);
  }

  const consoleLogs = data.consoleLogs.map((entry) => ({
    ...entry,
    message: fragments.length > 0 ? redactFragments(entry.message, fragments) : entry.message,
  }));

  const networkLogs = data.networkLogs.map((entry) => {
    let networkUrl = entry.url;
    if (privacy.maskText) {
      networkUrl = scrubUrlQueryValues(networkUrl);
    }
    if (fragments.length > 0) {
      networkUrl = redactFragments(networkUrl, fragments);
    }
    return { ...entry, url: networkUrl };
  });

  return { ...data, url, consoleLogs, networkLogs };
}

export function scrubCustomContext(value: Record<string, unknown>): Record<string, unknown> {
  return scrubJsonValue(value) as Record<string, unknown>;
}
