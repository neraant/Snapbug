import type { eventWithTime } from "@rrweb/types";

import { REPLAY_MAX_SEGMENTS, REPLAY_WINDOW_MS } from "./replay.const";

const FULL_SNAPSHOT_TYPE = 2;
const META_TYPE = 4;

type ReplaySegment = eventWithTime[];

let segments: ReplaySegment[] = [];

/** Each checkout starts a new segment that begins with Meta + FullSnapshot. */
export function pushReplayEvent(event: eventWithTime, isCheckout?: boolean) {
  const last = segments[segments.length - 1];
  if (!last || isCheckout === true) {
    segments.push([event]);
    if (segments.length > REPLAY_MAX_SEGMENTS) segments = segments.slice(-REPLAY_MAX_SEGMENTS);
    return;
  }
  last.push(event);
}

export function clearReplayBuffer() {
  segments = [];
}

export function snapshotReplayEvents(now: number = Date.now()): eventWithTime[] {
  return trimReplayEvents(segments.flat(), now, REPLAY_WINDOW_MS);
}

/**
 * Returns events that cover the last `windowMs`. Playback must start from a full snapshot,
 * so we start at the latest snapshot at or before the cutoff (or the earliest one if none is old enough).
 */
export function trimReplayEvents(events: eventWithTime[], now: number, windowMs: number): eventWithTime[] {
  const cutoff = now - windowMs;
  let start = -1;
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    if (!event || event.type !== FULL_SNAPSHOT_TYPE) continue;
    if (start === -1 || event.timestamp <= cutoff) start = index;
    if (event.timestamp > cutoff) break;
  }
  if (start === -1) return [];

  const previous = events[start - 1];
  if (previous && previous.type === META_TYPE) start -= 1;
  return events.slice(start);
}
