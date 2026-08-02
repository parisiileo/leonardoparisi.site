import { createHash } from "node:crypto";

/**
 * In-process rate limiting for the contact endpoint.
 *
 * With no database in the stack there is nowhere shared to count from, so
 * this throttles per warm serverless instance rather than globally. That is
 * genuinely useful — a flood arrives on few instances and gets cut off — but
 * it is not a hard quota. If abuse ever becomes real, the upgrade is a shared
 * counter (Upstash Redis free tier) or a Vercel firewall rule; nothing else
 * in the route would have to change.
 */

type Window = { hits: number[]; };

const buckets = new Map<string, Window>();

// Keeps a burst of unique keys from growing the map without bound.
const MAX_KEYS = 5_000;

/** SHA-256 of the address with a server-side salt: the raw IP is never kept. */
export function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${ip}:${process.env.CONTACT_IP_SALT ?? "imleo-fallback-salt"}`)
    .digest("hex");
}

/** True when the caller is within the limit; records the hit when it is. */
export function take(key: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const cutoff = now - windowSeconds * 1000;

  if (buckets.size > MAX_KEYS) buckets.clear();

  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((time) => time > cutoff);

  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    return false;
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return true;
}
