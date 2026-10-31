import "rrweb-player/dist/style.css";
import "@/client/modules/ticket-detail/styles/ticket-detail-replay-player.css";

import type { eventWithTime } from "@rrweb/types";
import { CirclePlayIcon } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import rrwebPlayer from "rrweb-player";

import { texts } from "@/client/modules/ticket-detail/consts/texts.const";
import {
  buildTicketDetailReplayPlayerProps,
  TICKET_DETAIL_REPLAY_CONTROLLER_HEIGHT,
  TICKET_DETAIL_REPLAY_VIEWPORT_HEIGHT,
} from "@/client/modules/ticket-detail/utils/build-ticket-detail-replay-player-props.util";

type TicketDetailReplayPlayerProps = {
  events: eventWithTime[];
};

type RrwebPlayerInstance = InstanceType<typeof rrwebPlayer>;

type PlayerStateDetail = {
  payload?: string;
};

function resolvePlayerState(detail: unknown) {
  if (typeof detail === "string") {
    return detail;
  }

  if (typeof detail === "object" && detail !== null && "payload" in detail) {
    return (detail as PlayerStateDetail).payload;
  }

  return undefined;
}

export function TicketDetailReplayPlayer({ events }: TicketDetailReplayPlayerProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<RrwebPlayerInstance | null>(null);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) {
      return;
    }

    setShowPlayOverlay(true);

    const player = new rrwebPlayer({
      target,
      props: buildTicketDetailReplayPlayerProps(events, target.clientWidth),
    });
    playerRef.current = player;

    player.addEventListener("ui-update-player-state", (detail) => {
      if (resolvePlayerState(detail) === "playing") {
        setShowPlayOverlay(false);
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      player.triggerResize();
    });
    resizeObserver.observe(target);

    return () => {
      resizeObserver.disconnect();
      player.pause();
      playerRef.current = null;
      target.replaceChildren();
    };
  }, [events]);

  const startPlayback = () => {
    playerRef.current?.play();
    setShowPlayOverlay(false);
  };

  return (
    <div
      className="ticket-detail-replay-player-shell"
      style={
        {
          "--ticket-detail-replay-controller-height": `${TICKET_DETAIL_REPLAY_CONTROLLER_HEIGHT}px`,
          "--ticket-detail-replay-viewport-height": `${TICKET_DETAIL_REPLAY_VIEWPORT_HEIGHT}px`,
        } as CSSProperties
      }
    >
      <div ref={targetRef} className="ticket-detail-replay-player" />
      {showPlayOverlay ? (
        <button
          type="button"
          className="ticket-detail-replay-player-shell__play-overlay"
          aria-label={texts.replay.playSession}
          onClick={startPlayback}
        >
          <span className="ticket-detail-replay-player-shell__play-icon">
            <CirclePlayIcon aria-hidden />
          </span>
        </button>
      ) : null}
    </div>
  );
}
