import { Panel } from "@workspace/design-system/components/ui/panel";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { CirclePlayIcon } from "lucide-react";
import dynamic from "next/dynamic";

import { useFindBugReport } from "@/client/modules/shared/queries/use-find-bug-report";
import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import { useTicketDetailReplay } from "@/client/modules/ticket-detail/hooks/use-ticket-detail-replay";
import { TICKET_DETAIL_REPLAY_PLAYER_SKELETON_HEIGHT } from "@/client/modules/ticket-detail/utils/build-ticket-detail-replay-player-props.util";

const TicketDetailReplayPlayer = dynamic(
  () =>
    import("@/client/modules/ticket-detail/components/ticket-detail-replay-player").then(
      (module) => module.TicketDetailReplayPlayer,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full" style={{ height: TICKET_DETAIL_REPLAY_PLAYER_SKELETON_HEIGHT }} />,
  },
);

type TicketDetailReplaySectionProps = {
  shortId: string;
};

export function TicketDetailReplaySection({ shortId }: TicketDetailReplaySectionProps) {
  const { data: ticket } = useFindBugReport({ shortId });
  const { events, loadState } = useTicketDetailReplay(shortId, ticket.hasReplay);

  return (
    <Panel width="full" minWidth="0">
      <Panel.Header title={texts.replay.title} icon={CirclePlayIcon} />
      <Panel.Content>
        {!ticket.hasReplay ? (
          <Typography variant="text-sm" color="muted">
            {texts.replay.empty}
          </Typography>
        ) : null}
        {ticket.hasReplay && loadState === "loading" ? (
          <Skeleton className="w-full" style={{ height: TICKET_DETAIL_REPLAY_PLAYER_SKELETON_HEIGHT }} />
        ) : null}
        {ticket.hasReplay && loadState === "error" ? (
          <Typography variant="text-sm" color="destructive">
            {texts.replay.loadFailed}
          </Typography>
        ) : null}
        {ticket.hasReplay && loadState === "ready" && events ? <TicketDetailReplayPlayer events={events} /> : null}
      </Panel.Content>
    </Panel>
  );
}

function TicketDetailReplaySectionFallback() {
  return (
    <Panel width="full" minWidth="0">
      <Panel.Header title={texts.replay.title} icon={CirclePlayIcon} />
      <Panel.Content>
        <Skeleton className="w-full" style={{ height: TICKET_DETAIL_REPLAY_PLAYER_SKELETON_HEIGHT }} />
      </Panel.Content>
    </Panel>
  );
}

TicketDetailReplaySection.Fallback = TicketDetailReplaySectionFallback;
