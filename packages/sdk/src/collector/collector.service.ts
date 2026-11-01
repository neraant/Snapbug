import { startReplayCollector, stopReplayCollector } from "../replay/replay-collector.service";
import { clearCollectorBuffers } from "./collector-buffer";
import { startConsoleCollector, stopConsoleCollector } from "./console-collector.service";
import { startErrorCollector, stopErrorCollector } from "./error-collector.service";
import { startNetworkCollector, stopNetworkCollector } from "./network-collector.service";

let started = false;

export function startCollectors() {
  if (started || typeof window === "undefined") return;
  started = true;

  startConsoleCollector();
  startErrorCollector();
  startNetworkCollector();
  startReplayCollector();
}

export function stopCollectors() {
  if (!started || typeof window === "undefined") return;
  started = false;

  stopConsoleCollector();
  stopErrorCollector();
  stopNetworkCollector();
  stopReplayCollector();
  clearCollectorBuffers();
}
