import type { BarListItem } from "@workspace/design-system/components/ui/bar-list";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { FindBreakdownsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-breakdowns.schema";

export function mapPagesToBarListItems(
  pages: FindBreakdownsOutputDtoType["pages"],
  formatBugCount: (count: number) => string,
): BarListItem[] {
  return pages.map((page) => ({
    key: page.label,
    label: (
      <Typography variant="text-xs" font="mono">
        {page.label}
      </Typography>
    ),
    value: (
      <Typography variant="text-xs" color="primary">
        {formatBugCount(page.count)}
      </Typography>
    ),
    count: page.count,
  }));
}
