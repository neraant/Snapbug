import {
  defaultProjectFilters,
  projectFiltersStorageEvent,
  projectFiltersStorageKeyPrefix,
} from "@/client/modules/project/consts/project-filter.const";
import type { ProjectFilters } from "@/client/modules/project/types/project-filter.type";

const snapshotByOrganizationId = new Map<string, { raw: string | null; filters: ProjectFilters }>();

export function projectFiltersStorageKey(organizationId: string) {
  return `${projectFiltersStorageKeyPrefix}:${organizationId}`;
}

export function subscribeToProjectFilters(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key?.startsWith(`${projectFiltersStorageKeyPrefix}:`)) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(projectFiltersStorageEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(projectFiltersStorageEvent, onStoreChange);
  };
}

export function readStoredProjectFilters(organizationId: string): ProjectFilters {
  if (typeof window === "undefined") {
    return defaultProjectFilters;
  }

  let raw: string | null = null;

  try {
    raw = window.localStorage.getItem(projectFiltersStorageKey(organizationId));
  } catch {
    return defaultProjectFilters;
  }

  const cached = snapshotByOrganizationId.get(organizationId);
  if (cached && cached.raw === raw) {
    return cached.filters;
  }

  const filters = parseStoredProjectFilters(raw);
  snapshotByOrganizationId.set(organizationId, { raw, filters });
  return filters;
}

export function writeStoredProjectFilters(organizationId: string, filters: ProjectFilters) {
  const raw = JSON.stringify({ search: filters.search });
  const cached = snapshotByOrganizationId.get(organizationId);
  if (cached?.raw === raw) {
    return;
  }

  try {
    window.localStorage.setItem(projectFiltersStorageKey(organizationId), raw);
  } catch {
    return;
  }

  snapshotByOrganizationId.set(organizationId, { raw, filters });
  window.dispatchEvent(new Event(projectFiltersStorageEvent));
}

function parseStoredProjectFilters(raw: string | null): ProjectFilters {
  if (!raw) {
    return defaultProjectFilters;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return defaultProjectFilters;
    }

    const search = (parsed as Record<string, unknown>).search;
    return typeof search === "string" ? { search } : defaultProjectFilters;
  } catch {
    return defaultProjectFilters;
  }
}
