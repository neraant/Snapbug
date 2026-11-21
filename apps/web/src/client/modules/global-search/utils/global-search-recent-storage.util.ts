import type { SearchOutputDtoType } from "@workspace/validation/modules/search/dto/search.schema";

import {
  globalSearchRecentMaxItems,
  globalSearchRecentStorageKey,
} from "@/client/modules/global-search/consts/global-search.const";

type SearchProjectResult = SearchOutputDtoType["projects"][number];
type SearchTicketResult = SearchOutputDtoType["tickets"][number];

export type GlobalSearchRecentProject = SearchProjectResult & { kind: "project" };
export type GlobalSearchRecentTicket = SearchTicketResult & { kind: "ticket" };

export type GlobalSearchRecentItem = GlobalSearchRecentProject | GlobalSearchRecentTicket;

function isRecentItem(value: unknown): value is GlobalSearchRecentItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  if (record.kind === "project") {
    return typeof record.id === "string" && typeof record.name === "string" && typeof record.slug === "string";
  }

  if (record.kind === "ticket") {
    return typeof record.id === "string" && typeof record.shortId === "string" && typeof record.title === "string";
  }

  return false;
}

export function readGlobalSearchRecentItems(): GlobalSearchRecentItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(globalSearchRecentStorageKey);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isRecentItem).slice(0, globalSearchRecentMaxItems);
  } catch {
    return [];
  }
}

export function pushGlobalSearchRecentItem(item: GlobalSearchRecentItem): void {
  if (typeof window === "undefined") {
    return;
  }

  const current = readGlobalSearchRecentItems().filter((entry) => entry.id !== item.id);
  const next = [item, ...current].slice(0, globalSearchRecentMaxItems);

  window.localStorage.setItem(globalSearchRecentStorageKey, JSON.stringify(next));
}
