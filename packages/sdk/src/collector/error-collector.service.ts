import { pushConsoleEntry } from "./collector-buffer";
import { formatErrorMessage, formatRejectionReason } from "./collector-format.util";

let onError: ((event: ErrorEvent) => void) | null = null;
let onUnhandledRejection: ((event: PromiseRejectionEvent) => void) | null = null;

export function startErrorCollector() {
  onError = (event: ErrorEvent) => {
    pushConsoleEntry({
      level: "error",
      message: formatErrorMessage(event),
      timestamp: new Date().toISOString(),
    });
  };
  window.addEventListener("error", onError);

  onUnhandledRejection = (event: PromiseRejectionEvent) => {
    pushConsoleEntry({
      level: "error",
      message: formatRejectionReason(event.reason),
      timestamp: new Date().toISOString(),
    });
  };
  window.addEventListener("unhandledrejection", onUnhandledRejection);
}

export function stopErrorCollector() {
  if (onError) {
    window.removeEventListener("error", onError);
    onError = null;
  }

  if (onUnhandledRejection) {
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
    onUnhandledRejection = null;
  }
}
