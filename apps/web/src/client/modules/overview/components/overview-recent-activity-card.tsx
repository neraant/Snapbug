import { Row } from "@workspace/design-system/components/layout/row";
import { FeedList } from "@workspace/design-system/components/ui/feed-list";
import { MetricCard } from "@workspace/design-system/components/ui/metric-card";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import { ArrowRightIcon } from "lucide-react";

import { texts } from "@/client/modules/overview/consts/texts.const";
import { mapRecentActivityToFeedItems } from "@/client/modules/overview/utils/map-recent-activity-to-feed-items.util";
import { useFindBugReportRecent } from "@/client/shared/queries/use-find-bug-report-recent";

type OverviewRecentActivityCardProps = {
  projectId: string | null;
  className?: string;
};

export function OverviewRecentActivityCard({ projectId, className }: OverviewRecentActivityCardProps) {
  const { data: items } = useFindBugReportRecent({ projectId: projectId ?? undefined });

  return (
    <MetricCard className={cn(className)}>
      <MetricCard.Header
        title={texts.activity.recent.title}
        description={texts.activity.recent.description}
        action={
          <Row align="center" gap="xs" wrap={false}>
            <Typography variant="text-sm" color="muted">
              {texts.activity.recent.viewAll}
            </Typography>
            <ArrowRightIcon aria-hidden className="size-3.5 text-muted-foreground" />
          </Row>
        }
      />
      <MetricCard.Content>
        <FeedList items={mapRecentActivityToFeedItems(items)} emptyLabel={texts.activity.recent.empty} />
      </MetricCard.Content>
    </MetricCard>
  );
}
