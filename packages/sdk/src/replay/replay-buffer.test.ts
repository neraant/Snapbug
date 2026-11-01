import type { eventWithTime } from "@rrweb/types";
import { afterEach, describe, expect, it } from "vitest";

import { clearReplayBuffer, pushReplayEvent, snapshotReplayEvents, trimReplayEvents } from "./replay-buffer";

const NOW = 1_000_000;

function event(type: number, secondsAgo: number): eventWithTime {
  return { type, data: {}, timestamp: NOW - secondsAgo * 1000 } as unknown as eventWithTime;
}

describe("trimReplayEvents", () => {
  it("starts at the latest full snapshot at or before the window cutoff", () => {
    const events = [
      event(4, 50),
      event(2, 50),
      event(3, 45),
      event(4, 38),
      event(2, 38),
      event(3, 20),
      event(4, 28),
      event(2, 28),
      event(3, 5),
    ];
    const result = trimReplayEvents(events, NOW, 30_000);
    expect(result[0]).toBe(events[4 - 1]);
    expect(result[1]).toBe(events[4]);
  });

  it("drops events older than the snapshot that anchors the window", () => {
    const events = [event(2, 40), event(3, 35), event(2, 25), event(3, 10)];
    const result = trimReplayEvents(events, NOW, 30_000);
    expect(result).toEqual([events[0], events[1], events[2], events[3]]);
  });

  it("falls back to the earliest snapshot when all are inside the window", () => {
    const events = [event(3, 12), event(2, 9), event(3, 8), event(2, 2)];
    const result = trimReplayEvents(events, NOW, 30_000);
    expect(result[0]).toBe(events[1]);
    expect(result).toHaveLength(3);
  });

  it("returns nothing without a full snapshot", () => {
    expect(trimReplayEvents([event(3, 1), event(3, 2)], NOW, 30_000)).toEqual([]);
  });

  it("includes the meta event directly preceding the chosen snapshot", () => {
    const meta = event(4, 31);
    const snapshot = event(2, 31);
    const result = trimReplayEvents([event(3, 40), meta, snapshot, event(3, 2)], NOW, 30_000);
    expect(result[0]).toBe(meta);
    expect(result[1]).toBe(snapshot);
  });
});

describe("replay buffer", () => {
  afterEach(() => clearReplayBuffer());

  it("keeps only the last segments and trims by window", () => {
    for (let segment = 0; segment < 6; segment += 1) {
      const age = (5 - segment) * 10 + 1;
      pushReplayEvent(event(4, age), true);
      pushReplayEvent(event(2, age), false);
      pushReplayEvent(event(3, age - 5), false);
    }
    const result = snapshotReplayEvents(NOW);
    expect(result[0]?.type).toBe(4);
    expect(result[1]?.type).toBe(2);
    expect(result[1]?.timestamp).toBe(NOW - 31_000);
    expect(result.every((item) => item.timestamp >= NOW - 31_000)).toBe(true);
  });

  it("clears", () => {
    pushReplayEvent(event(2, 1), true);
    clearReplayBuffer();
    expect(snapshotReplayEvents(NOW)).toEqual([]);
  });
});
