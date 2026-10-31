import type { eventWithTime } from "@rrweb/types";

export const TICKET_DETAIL_REPLAY_CONTROLLER_HEIGHT = 80;
export const TICKET_DETAIL_REPLAY_VIEWPORT_HEIGHT = 320;
export const TICKET_DETAIL_REPLAY_MIN_WIDTH = 320;
export const TICKET_DETAIL_REPLAY_PLAYER_SKELETON_HEIGHT =
  TICKET_DETAIL_REPLAY_VIEWPORT_HEIGHT + TICKET_DETAIL_REPLAY_CONTROLLER_HEIGHT;

export function buildTicketDetailReplayPlayerProps(events: eventWithTime[], containerWidth: number) {
  return {
    events,
    showController: true,
    autoPlay: false,
    skipInactive: false,
    width: Math.max(containerWidth, TICKET_DETAIL_REPLAY_MIN_WIDTH),
    height: TICKET_DETAIL_REPLAY_VIEWPORT_HEIGHT,
    inactiveColor: "var(--muted)",
    timelineMarkerColor: "var(--primary)",
  } as const;
}
