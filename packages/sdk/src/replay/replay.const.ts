/** Only the last 30 seconds of session replay are attached to a report. */
export const REPLAY_WINDOW_MS = 30_000;
/** rrweb takes a fresh full snapshot every 10 s so the window can start at a recent snapshot. */
export const REPLAY_CHECKOUT_INTERVAL_MS = 10_000;
/** Max replay payload (gzip or raw JSON). Larger replays are omitted, the report is still sent. */
export const REPLAY_MAX_BYTES = 3_000_000;
/** Keep 3 segments: with a 10 s checkout this always covers the 30 s window. */
export const REPLAY_MAX_SEGMENTS = 4;
export const REPLAY_FORM_FIELD = "replay";
export const REPLAY_FILE_NAME = "replay.json.gz";
