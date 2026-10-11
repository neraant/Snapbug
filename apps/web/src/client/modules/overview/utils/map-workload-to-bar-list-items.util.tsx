import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import type { BarListItem } from "@workspace/design-system/components/ui/bar-list";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { FindWorkloadOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-workload.schema";

import { formatPersonInitials } from "@/client/modules/overview/utils/format-person-initials.util";

export function mapWorkloadToBarListItems(
  items: FindWorkloadOutputDtoType,
  formatOpenCount: (count: number) => string,
): BarListItem[] {
  return items.map((item) => ({
    key: item.userId ?? "unassigned",
    label: (
      <Typography variant="text-sm" truncate>
        {item.name}
      </Typography>
    ),
    value: (
      <Typography variant="text-sm" color="muted">
        {formatOpenCount(item.openCount)}
      </Typography>
    ),
    count: item.openCount,
    icon: (
      <Avatar size="sm" aria-label={item.name}>
        <AvatarFallback>{item.userId === null ? "?" : formatPersonInitials(item.name, item.email)}</AvatarFallback>
      </Avatar>
    ),
  }));
}
