import { BarList } from "@workspace/design-system/components/ui/bar-list";
import { Panel } from "@workspace/design-system/components/ui/panel";
import { cn } from "@workspace/design-system/lib/utils";

import { texts } from "@/client/modules/overview/consts/texts.const";
import { mapWorkloadToBarListItems } from "@/client/modules/overview/utils/map-workload-to-bar-list-items.util";
import { useFindBugReportWorkload } from "@/client/modules/shared/queries/use-find-bug-report-workload";

type OverviewTeamWorkloadCardProps = {
  projectId: string | null;
  className?: string;
};

export function OverviewTeamWorkloadCard({ projectId, className }: OverviewTeamWorkloadCardProps) {
  const { data: items } = useFindBugReportWorkload({ projectId: projectId ?? undefined });

  return (
    <Panel className={cn(className)}>
      <Panel.Header title={texts.activity.workload.title} description={texts.activity.workload.description} />
      <Panel.Content>
        <BarList
          items={mapWorkloadToBarListItems(items, texts.activity.workload.formatOpenCount)}
          scale="max"
          emptyLabel={texts.activity.workload.empty}
        />
      </Panel.Content>
    </Panel>
  );
}
