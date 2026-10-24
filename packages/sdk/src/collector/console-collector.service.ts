import type { BugReportConsoleLogEntryType } from "@workspace/validation/modules/bug-report/dto/bug-report-log-entry.schema";

import { pushConsoleEntry } from "./collector-buffer";
import { formatConsoleArgs } from "./collector-format.util";

type ConsoleLevel = BugReportConsoleLogEntryType["level"];

const CONSOLE_LEVELS: ConsoleLevel[] = ["log", "info", "warn", "error"];

let consoleMethods: Partial<Record<ConsoleLevel, typeof console.log>> | null = null;

export function startConsoleCollector() {
  consoleMethods = {};
  for (const level of CONSOLE_LEVELS) {
    const original = console[level].bind(console);
    consoleMethods[level] = original;
    console[level] = (...args: unknown[]) => {
      pushConsole(level, args);
      original(...args);
    };
  }
}

export function stopConsoleCollector() {
  if (!consoleMethods) return;

  for (const level of CONSOLE_LEVELS) {
    const original = consoleMethods[level];
    if (original) console[level] = original;
  }
  consoleMethods = null;
}

function pushConsole(level: ConsoleLevel, args: unknown[]) {
  pushConsoleEntry({ level, message: formatConsoleArgs(args), timestamp: new Date().toISOString() });
}
