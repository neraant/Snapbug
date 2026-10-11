export const bugReportShortIdPrefix = "SNB-";

export function formatBugReportShortId(sequence: number): string {
  return `${bugReportShortIdPrefix}${sequence}`;
}
