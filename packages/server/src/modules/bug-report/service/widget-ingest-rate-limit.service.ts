import { createHash } from "crypto";

type Bucket = { count: number; resetAt: number };

/** Submits allowed for one project key inside the window. In-process only. */
export const WIDGET_INGEST_RATE_LIMIT = 30;
export const WIDGET_INGEST_RATE_WINDOW_MS = 60_000;

export class WidgetIngestRateLimitService {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly limit = WIDGET_INGEST_RATE_LIMIT,
    private readonly windowMs = WIDGET_INGEST_RATE_WINDOW_MS,
    private readonly now: () => number = Date.now,
  ) {}

  /** Returns false when this key is over the limit. A different key has its own bucket. */
  consume(apiKey: string): boolean {
    const now = this.now();
    const key = createHash("sha256").update(apiKey).digest("hex");
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
      this.dropExpired(now);
      return true;
    }

    if (bucket.count >= this.limit) return false;

    bucket.count += 1;
    return true;
  }

  private dropExpired(now: number): void {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }
  }
}
