import type { eventWithTime } from "@rrweb/types";
import { useEffect, useState } from "react";

import { loadBugReportReplayEvents } from "@/client/modules/ticket-detail/utils/load-bug-report-replay-events.util";

type TicketDetailReplayLoadState = "idle" | "loading" | "ready" | "error";

type TicketDetailReplayFetchResult = {
  shortId: string;
  events: eventWithTime[] | null;
  loadState: Exclude<TicketDetailReplayLoadState, "idle" | "loading">;
};

export function useTicketDetailReplay(shortId: string, enabled: boolean) {
  const [fetchResult, setFetchResult] = useState<TicketDetailReplayFetchResult | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

    loadBugReportReplayEvents(shortId, controller.signal)
      .then((loadedEvents) => {
        if (controller.signal.aborted) {
          return;
        }

        setFetchResult({ shortId, events: loadedEvents, loadState: "ready" });
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return;
        }

        setFetchResult({ shortId, events: null, loadState: "error" });
      });

    return () => controller.abort();
  }, [enabled, shortId]);

  if (!enabled) {
    return { events: null, loadState: "idle" as const };
  }

  if (!fetchResult || fetchResult.shortId !== shortId) {
    return { events: null, loadState: "loading" as const };
  }

  return { events: fetchResult.events, loadState: fetchResult.loadState };
}
