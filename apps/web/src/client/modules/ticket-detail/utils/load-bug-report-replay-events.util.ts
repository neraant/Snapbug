import { buildBugReportReplayUrl } from "@/client/modules/ticket-detail/utils/build-bug-report-replay-url.util";
import { parseBugReportReplayBlob } from "@/client/modules/ticket-detail/utils/parse-bug-report-replay-blob.util";

export async function loadBugReportReplayEvents(shortId: string, signal?: AbortSignal) {
  const response = await fetch(buildBugReportReplayUrl(shortId), {
    credentials: "same-origin",
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to load replay");
  }

  const blob = await response.blob();
  return parseBugReportReplayBlob(blob);
}
