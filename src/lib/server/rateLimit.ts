// src/lib/server/rateLimit.ts — simple in-memory rate limiter (per-instance)
// For production scale, replace with Upstash/Redis.

const buckets = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult { allowed: boolean; remaining: number; resetAt: number; }

export function rateLimit(key: string, maxRequests: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }
  if (bucket.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }
  bucket.count++;
  return { allowed: true, remaining: maxRequests - bucket.count, resetAt: bucket.resetAt };
}

export function getClientIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
