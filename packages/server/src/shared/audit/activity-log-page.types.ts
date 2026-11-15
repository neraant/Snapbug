import type {
  ActivityLogDateRangeType,
  ActivityLogEntityTypeFilterType,
} from "@workspace/validation/modules/audit/dto/find-activity-logs-input.schema";

export type FindActivityLogsPageInput = {
  organizationId: string;
  limit: number;
  cursor?: string;
  search?: string;
  actorId?: string;
  entityType?: ActivityLogEntityTypeFilterType;
  range?: ActivityLogDateRangeType;
};