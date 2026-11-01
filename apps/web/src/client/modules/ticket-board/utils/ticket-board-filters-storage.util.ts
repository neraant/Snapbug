import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import type { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

import {
  defaultTicketBoardFilters,
  ticketBoardFiltersStorageEvent,
  ticketBoardFiltersStorageKeyPrefix,
  ticketBoardPeriodDays,
  ticketBoardStatuses,
} from "@/client/modules/ticket-board/consts/ticket-board.const";
import type {
  TicketBoardFilters,
  TicketBoardPeriodDays,
} from "@/client/modules/ticket-board/types/ticket-board-filter.type";

const snapshotByOrganizationId = new Map<string, { raw: string | null; filters: TicketBoardFilters }>();

export function ticketBoardFiltersStorageKey(organizationId: string) {
  return `${ticketBoardFiltersStorageKeyPrefix}:${organizationId}`;
}

export function subscribeToTicketBoardFilters(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key?.startsWith(`${ticketBoardFiltersStorageKeyPrefix}:`)) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(ticketBoardFiltersStorageEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(ticketBoardFiltersStorageEvent, onStoreChange);
  };
}

export function readStoredTicketBoardFilters(organizationId: string): TicketBoardFilters {
  if (typeof window === "undefined") {
    return defaultTicketBoardFilters;
  }

  let raw: string | null = null;

  try {
    raw = window.localStorage.getItem(ticketBoardFiltersStorageKey(organizationId));
  } catch {
    return defaultTicketBoardFilters;
  }

  const cached = snapshotByOrganizationId.get(organizationId);
  if (cached && cached.raw === raw) {
    return cached.filters;
  }

  const filters = parseStoredTicketBoardFilters(raw);
  snapshotByOrganizationId.set(organizationId, { raw, filters });
  return filters;
}

export function writeStoredTicketBoardFilters(organizationId: string, filters: TicketBoardFilters) {
  const raw = JSON.stringify({
    search: filters.search,
    severities: filters.severities,
    statuses: filters.statuses,
    periodDays: filters.periodDays,
  });
  const cached = snapshotByOrganizationId.get(organizationId);
  if (cached?.raw === raw) {
    return;
  }

  try {
    window.localStorage.setItem(ticketBoardFiltersStorageKey(organizationId), raw);
  } catch {
    return;
  }

  snapshotByOrganizationId.set(organizationId, { raw, filters });
  window.dispatchEvent(new Event(ticketBoardFiltersStorageEvent));
}

function parseStoredTicketBoardFilters(raw: string | null): TicketBoardFilters {
  if (!raw) {
    return defaultTicketBoardFilters;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return defaultTicketBoardFilters;
    }

    const record = parsed as Record<string, unknown>;
    const search = typeof record.search === "string" ? record.search : "";
    const severities = parseStoredSeverities(record);
    const statuses = parseStoredStatuses(record.statuses);
    const periodDays = isTicketBoardPeriodDays(record.periodDays) ? record.periodDays : ticketBoardPeriodDays.all;

    if (search.length === 0 && severities.length === 0 && statuses.length === 0 && periodDays === null) {
      return defaultTicketBoardFilters;
    }

    return { search, severities, statuses, periodDays };
  } catch {
    return defaultTicketBoardFilters;
  }
}

function parseStoredSeverities(record: Record<string, unknown>): BugReportSeverity[] {
  if (Array.isArray(record.severities)) {
    return record.severities.filter((entry): entry is BugReportSeverity => isBugReportSeverity(entry));
  }

  if (isBugReportSeverity(record.severity)) {
    return [record.severity];
  }

  return [];
}

function parseStoredStatuses(value: unknown): BugReportStatus[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is BugReportStatus => isBugReportStatus(entry));
}

function isBugReportStatus(value: unknown): value is BugReportStatus {
  return ticketBoardStatuses.some((status) => status === value);
}

function isBugReportSeverity(value: unknown): value is BugReportSeverity {
  return (
    value === BugReportSeverity.LOW ||
    value === BugReportSeverity.MEDIUM ||
    value === BugReportSeverity.HIGH ||
    value === BugReportSeverity.CRITICAL
  );
}

function isTicketBoardPeriodDays(value: unknown): value is TicketBoardPeriodDays {
  return (
    value === ticketBoardPeriodDays.all ||
    value === ticketBoardPeriodDays.last7 ||
    value === ticketBoardPeriodDays.last30 ||
    value === ticketBoardPeriodDays.last90
  );
}
