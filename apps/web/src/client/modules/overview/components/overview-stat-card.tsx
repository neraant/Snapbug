import { StatCard } from "@workspace/design-system/components/ui/stat-card";
import type { LucideIcon } from "lucide-react";
import { AlertTriangleIcon, ClockIcon, FlameIcon, ZapIcon } from "lucide-react";

import { texts } from "@/client/modules/overview/consts/texts.const";
import type { OverviewStatItem } from "@/client/modules/overview/types/overview-stat.type";

const iconByStatId: Record<OverviewStatItem["id"], LucideIcon> = {
  newReport: ZapIcon,
  openIssue: AlertTriangleIcon,
  criticalHighOpen: FlameIcon,
  medianTimeToResolve: ClockIcon,
};

type OverviewStatCardProps = {
  item: OverviewStatItem;
  periodDays: number;
};

export function OverviewStatCard({ item, periodDays }: OverviewStatCardProps) {
  const copy = texts.stat.card[item.id];
  const Icon = iconByStatId[item.id];

  return (
    <StatCard>
      <StatCard.Main>
        <StatCard.Header title={copy.title} icon={<Icon aria-hidden />} />
        <StatCard.Value value={item.value} hint={"valueHint" in copy ? copy.valueHint : undefined} />
      </StatCard.Main>

      <StatCard.Footer>
        <StatCard.Delta
          changePercent={item.changePercent}
          polarity={item.polarity}
          comparisonLabel={texts.stat.comparisonPeriod(periodDays)}
          trailing={<StatCard.Sparkline data={item.sparkline} stroke={item.sparklineStroke} />}
        />
      </StatCard.Footer>
    </StatCard>
  );
}
