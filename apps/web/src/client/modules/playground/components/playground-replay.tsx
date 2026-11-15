import "rrweb-player/dist/style.css";
import "@workspace/design-system/rrweb-replay-player.css";

import type { eventWithTime } from "@rrweb/types";
import { CirclePlayIcon } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import rrwebPlayer from "rrweb-player";

import { texts } from "@/client/modules/playground/consts/texts.const";

const replayHeight = 320;

type PlaygroundReplayPlayerProps = {
  events: eventWithTime[];
};

type RrwebPlayerInstance = InstanceType<typeof rrwebPlayer>;

export function PlaygroundReplayPlayer({ events }: PlaygroundReplayPlayerProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<RrwebPlayerInstance | null>(null);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    setShowPlayOverlay(true);
    const player = new rrwebPlayer({
      target,
      props: {
        events,
        showController: true,
        autoPlay: false,
        skipInactive: false,
        width: Math.max(target.clientWidth, 320),
        height: replayHeight,
      },
    });
    playerRef.current = player;

    return () => {
      player.pause();
      playerRef.current = null;
      target.replaceChildren();
    };
  }, [events]);

  return (
    <div
      className="rrweb-replay-player-shell"
      style={{ "--rrweb-replay-viewport-height": `${replayHeight}px` } as CSSProperties}
    >
      <div ref={targetRef} className="rrweb-replay-player" />
      {showPlayOverlay ? (
        <button
          type="button"
          className="rrweb-replay-player-shell__play-overlay"
          aria-label={texts.capture.playSession}
          onClick={() => {
            playerRef.current?.play();
            setShowPlayOverlay(false);
          }}
        >
          <CirclePlayIcon aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
