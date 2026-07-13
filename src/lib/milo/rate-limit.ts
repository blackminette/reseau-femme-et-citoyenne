const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type MiloRateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const requestsByChild = new Map<string, RateLimitEntry>();

function clearExpiredEntries(now: number): void {
  for (const [childId, entry] of requestsByChild) {
    if (entry.resetAt <= now) requestsByChild.delete(childId);
  }
}

// This rate limit protects one running Node.js instance from accidental loops
// and casual abuse. A shared deployment needs a central limiter to cover every
// instance consistently.
export function checkMiloRateLimit(
  childId: string,
  now = Date.now(),
): MiloRateLimitResult {
  clearExpiredEntries(now);

  const existing = requestsByChild.get(childId);

  if (!existing) {
    requestsByChild.set(childId, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1_000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export const miloRateLimitConfig = {
  windowMs: WINDOW_MS,
  maximumRequests: MAX_REQUESTS_PER_WINDOW,
} as const;
