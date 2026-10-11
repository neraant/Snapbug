import type { BarListItem } from "@workspace/design-system/components/ui/bar-list";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { FindBreakdownsOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-breakdowns.schema";
import type { LucideIcon } from "lucide-react";

export function mapEnvironmentToBarListItems(
  environment: FindBreakdownsOutputDtoType["browser"],
  icon: LucideIcon,
  formatShare: (count: number, total: number) => string,
): BarListItem[] {
  const Icon = icon;

  return environment.items.map((item) => ({
    key: item.label,
    label: (
      <Typography variant="text-xs" className="truncate">
        {item.label}
      </Typography>
    ),
    value: (
      <Typography variant="text-xs" color="muted">
        {formatShare(item.count, environment.total)}
      </Typography>
    ),
    count: item.count,
    icon: <Icon className="size-3.5" aria-hidden />,
  }));
}
