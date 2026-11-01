import {
  defaultTeamFilters,
  teamFiltersStorageEvent,
  teamFiltersStorageKeyPrefix,
} from "@/client/modules/team/consts/team-filter.const";
import type { TeamFilters } from "@/client/modules/team/types/team-filter.type";

const snapshotByOrganizationId = new Map<string, { raw: string | null; filters: TeamFilters }>();

export function teamFiltersStorageKey(organizationId: string) {
  return `${teamFiltersStorageKeyPrefix}:${organizationId}`;
}

export function subscribeToTeamFilters(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key?.startsWith(`${teamFiltersStorageKeyPrefix}:`)) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(teamFiltersStorageEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(teamFiltersStorageEvent, onStoreChange);
  };
}

export function readStoredTeamFilters(organizationId: string): TeamFilters {
  if (typeof window === "undefined") {
    return defaultTeamFilters;
  }

  let raw: string | null = null;

  try {
    raw = window.localStorage.getItem(teamFiltersStorageKey(organizationId));
  } catch {
    return defaultTeamFilters;
  }

  const cached = snapshotByOrganizationId.get(organizationId);
  if (cached && cached.raw === raw) {
    return cached.filters;
  }

  const filters = parseStoredTeamFilters(raw);
  snapshotByOrganizationId.set(organizationId, { raw, filters });
  return filters;
}

export function writeStoredTeamFilters(organizationId: string, filters: TeamFilters) {
  const raw = JSON.stringify({ search: filters.search });
  const cached = snapshotByOrganizationId.get(organizationId);
  if (cached?.raw === raw) {
    return;
  }

  try {
    window.localStorage.setItem(teamFiltersStorageKey(organizationId), raw);
  } catch {
    return;
  }

  snapshotByOrganizationId.set(organizationId, { raw, filters });
  window.dispatchEvent(new Event(teamFiltersStorageEvent));
}

function parseStoredTeamFilters(raw: string | null): TeamFilters {
  if (!raw) {
    return defaultTeamFilters;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return defaultTeamFilters;
    }

    const search = (parsed as Record<string, unknown>).search;
    return typeof search === "string" ? { search } : defaultTeamFilters;
  } catch {
    return defaultTeamFilters;
  }
}
