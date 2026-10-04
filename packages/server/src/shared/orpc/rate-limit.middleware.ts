import { os } from "@orpc/server";
import { RateLimitedError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { OrpcContext } from "@workspace/server/shared/orpc/context.const";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const IP_LIMIT = 5;
const IP_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const EMAIL_LIMIT = 3;
const EMAIL_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function hit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

export const rateLimitMiddleware = os
  .$context<OrpcContext>()
  .middleware(async ({ context, next }, input: { email: string }) => {
    const email = input.email.trim().toLowerCase();

    const ipAllowed = hit(`ip:${context.ip}`, IP_LIMIT, IP_WINDOW_MS);
    const emailAllowed = hit(`email:${email}`, EMAIL_LIMIT, EMAIL_WINDOW_MS);

    if (!ipAllowed || !emailAllowed) {
      throw new RateLimitedError(ERROR_CODES.RATE_LIMITED);
    }

    return next();
  });
