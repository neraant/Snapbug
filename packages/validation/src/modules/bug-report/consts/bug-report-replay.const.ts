/** Max replay payload size (gzip or raw JSON). Vercel request body limit is 4.5 MB; screenshot may use up to 2 MB. */
export const BUG_REPORT_REPLAY_MAX_BYTES = 3_000_000;

export const BUG_REPORT_REPLAY_ALLOWED_MIME_TYPES = ["application/gzip", "application/json"] as const;
