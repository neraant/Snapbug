import { Column } from "@workspace/design-system/components/layout/column";
import { Grid } from "@workspace/design-system/components/layout/grid";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";

import { TicketDetailDiagnosticsCard } from "@/client/modules/ticket-detail/components/ticket-detail-diagnostics-card";
import { TicketDetailHeader } from "@/client/modules/ticket-detail/components/ticket-detail-header";
import { TicketDetailIssueSection } from "@/client/modules/ticket-detail/components/ticket-detail-issue-section";
import { TicketDetailReplaySection } from "@/client/modules/ticket-detail/components/ticket-detail-replay-section";
import { TicketDetailScreenshotSection } from "@/client/modules/ticket-detail/components/ticket-detail-screenshot-section";
import { TicketDetailSidebar } from "@/client/modules/ticket-detail/components/ticket-detail-sidebar";
import { TICKET_DETAIL_REPLAY_PLAYER_SKELETON_HEIGHT } from "@/client/modules/ticket-detail/utils/build-ticket-detail-replay-player-props.util";

type TicketDetailProps = {
  shortId: string;
};

export function TicketDetail({ shortId }: TicketDetailProps) {
  return (
    <Column gap="none" width="full" minWidth="0" className="min-h-0 flex-1 overflow-y-auto">
      <Column gap="lg" padding="lg" width="full" minWidth="0">
        <TicketDetailHeader shortId={shortId} />
      </Column>
      <Separator />
      <Column gap="lg" padding="lg" minWidth="0" width="full">
        <Grid columns="responsive-3" gap="lg">
          <Column gap="lg" minWidth="0" width="full" className="min-w-0 lg:col-span-2">
            <TicketDetailIssueSection shortId={shortId} />
            <TicketDetailScreenshotSection shortId={shortId} />
            <TicketDetailReplaySection shortId={shortId} />
            <TicketDetailDiagnosticsCard shortId={shortId} />
          </Column>
          <TicketDetailSidebar shortId={shortId} />
        </Grid>
      </Column>
    </Column>
  );
}

function TicketDetailFallback() {
  return (
    <Column gap="lg" padding="lg" width="full">
      <Skeleton className="h-24 w-full" />
      <Grid columns="responsive-3" gap="lg">
        <Column gap="lg" className="min-w-0 lg:col-span-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="w-full" style={{ height: TICKET_DETAIL_REPLAY_PLAYER_SKELETON_HEIGHT }} />
          <Skeleton className="h-64 w-full" />
        </Column>
        <Skeleton className="h-96 w-full lg:max-w-sm" />
      </Grid>
    </Column>
  );
}

TicketDetail.Fallback = TicketDetailFallback;
