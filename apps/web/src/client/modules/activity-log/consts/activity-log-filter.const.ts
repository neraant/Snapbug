import type { ActivityLogFilters } from "@/client/modules/activity-log/types/activity-log-filter.type";

export const activityLogSearchParamKey = {
  event: "event",
  search: "q",
  actor: "actor",
  type: "type",
  range: "range",
} as const;

export const defaultActivityLogFilters: ActivityLogFilters = {
  search: "",
  range: "all",
};