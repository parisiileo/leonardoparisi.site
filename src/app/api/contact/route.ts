import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

/**
 * Best-effort rate limit. This is per-instance memory, so on serverless it
 * throttles a burst from one warm instance rather than acting as a global
 * quota — enough to blunt casual abuse. Move to Upstash/KV if it matters.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, code: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const kind = String(payload.kind ?? "PROJECT").trim();
  const honeypot = String(payload.company ?? "").trim();

  // A bot filled the hidden field. Accept and discard, so it learns nothing.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!name || !message || !EMAIL_RE.test(email) || message.length > 5000) {
    return NextResponse.json(
      { ok: false, code: "VALIDATION_FAILED" },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Nothing wired up yet — tell the client so it can fall back to mailto:.
  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { ok: false, code: "EMAIL_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `New ${kind.toLowerCase()} enquiry — ${name}`,
      text: `From: ${name} <${email}>\nType: ${kind}\n\n${message}`,
    }),
  });

  if (!response.ok) {
    console.error("[contact] Resend rejected the send:", await response.text());
    return NextResponse.json(
      { ok: false, code: "SEND_FAILED" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
