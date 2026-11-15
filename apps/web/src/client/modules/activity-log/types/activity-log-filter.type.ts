import type { ActivityLogDateRangeType } from "@workspace/validation/modules/audit/dto/find-activity-logs-input.schema";
import type { ActivityLogEntityTypeFilterType } from "@workspace/validation/modules/audit/dto/find-activity-logs-input.schema";

export type ActivityLogFilters = {
  search: string;
  actorId?: string;
  entityType?: ActivityLogEntityTypeFilterType;
  range: ActivityLogDateRangeType;
};