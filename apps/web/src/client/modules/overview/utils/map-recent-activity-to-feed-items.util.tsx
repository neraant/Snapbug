import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Badge, type BadgeVariant } from "@workspace/design-system/components/ui/badge";
import type { FeedListItem } from "@workspace/design-system/components/ui/feed-list";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import type { FindRecentOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-recent.schema";

import { texts } from "@/client/modules/overview/consts/texts.const";
import { formatActivityDate } from "@/client/modules/overview/utils/format-activity-date.util";
import { formatPersonInitials } from "@/client/modules/overview/utils/format-person-initials.util";

const severityBadgeVariant: Record<BugReportSeverity, BadgeVariant> = {
  [BugReportSeverity.CRITICAL]: "severityCritical",
  [BugReportSeverity.HIGH]: "severityHigh",
  [BugReportSeverity.MEDIUM]: "severityMedium",
  [BugReportSeverity.LOW]: "severityLow",
};

export function mapRecentActivityToFeedItems(items: FindRecentOutputDtoType): FeedListItem[] {
  return items.map((item) => {
    const details = [item.projectName, item.browser].filter((part): part is string => Boolean(part));

    return {
      key: item.id,
      leading: (
        <Badge variant={severityBadgeVariant[item.severity]}>
          {texts.activity.recent.severityLabels[item.severity]}
        </Badge>
      ),
      title: (
        <Typography variant="text-sm" weight="medium" truncate>
          {item.title}
        </Typography>
      ),
      meta: (
        <Typography variant="text-xs" color="muted" truncate>
          <Typography as="span" variant="text-xs" font="mono" color="inherit">
            {item.shortId}
          </Typography>
          {details.length > 0 ? ` · ${details.join(" · ")}` : null}
        </Typography>
      ),
      trailing: (
        <Typography variant="text-xs" color="muted">
          {formatActivityDate(item.createdAt)}
        </Typography>
      ),
      accessory: (
        <Avatar size="sm" aria-label={item.assignee?.name ?? item.assignee?.email ?? texts.activity.recent.unassigned}>
          <AvatarFallback>
            {formatPersonInitials(item.assignee?.name ?? null, item.assignee?.email ?? null)}
          </AvatarFallback>
        </Avatar>
      ),
    };
  });
}
