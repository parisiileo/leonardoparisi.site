import { NextResponse } from "next/server";
import { hashIp, take } from "@/lib/rateLimit";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Two windows: a short one to stop a burst, a long one to stop a slow drip.
const LIMITS = [
  { suffix: "burst", max: 3, windowSeconds: 60 },
  { suffix: "daily", max: 15, windowSeconds: 60 * 60 * 24 },
];

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = hashIp(ip);

  for (const limit of LIMITS) {
    if (!take(`contact:${limit.suffix}:${ipHash}`, limit.max, limit.windowSeconds)) {
      return NextResponse.json(
        { ok: false, code: "RATE_LIMITED" },
        { status: 429 },
      );
    }
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
  const kind = String(payload.kind ?? "PROJECT")
    .trim()
    .slice(0, 60);
  const locale = String(payload.locale ?? "en")
    .trim()
    .slice(0, 8);
  const honeypot = String(payload.company ?? "").trim();

  // A bot filled the hidden field. Accept and discard, so it learns nothing.
  if (honeypot) return NextResponse.json({ ok: true });

  if (
    !name ||
    name.length > 120 ||
    !message ||
    message.length > 5000 ||
    email.length > 254 ||
    !EMAIL_RE.test(email)
  ) {
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
      // Hitting reply in the mail client answers the visitor directly.
      reply_to: email,
      subject: `New ${kind.toLowerCase()} enquiry — ${name}`,
      text: [
        `From: ${name} <${email}>`,
        `Type: ${kind}`,
        `Locale: ${locale}`,
        "",
        message,
      ].join("\n"),
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
