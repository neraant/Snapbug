import type { StackedBarSegment } from "@workspace/design-system/components/ui/stacked-bar";
import type { FindBreakdownsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-breakdowns.schema";

import { statusBreakdownColor } from "@/client/modules/overview/consts/status-breakdown.const";

export function mapStatusToStackedBarSegments(status: FindBreakdownsOutputDtoType["status"]): StackedBarSegment[] {
  return status.map((row) => ({
    key: row.status,
    value: row.count,
    color: statusBreakdownColor[row.status],
  }));
}
