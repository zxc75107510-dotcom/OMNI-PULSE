import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

// Signature verification needs Node's `crypto` module, which the Edge
// runtime doesn't provide.
export const runtime = "nodejs";

/**
 * Verifies the `x-line-signature` header against the raw request body using
 * the channel secret (HMAC-SHA256, base64-encoded).
 * https://developers.line.biz/en/reference/messaging-api/#signature-validation
 */
function verifyLineSignature(rawBody: string, signatureHeader: string | null): boolean {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!channelSecret || !signatureHeader) return false;

  const expected = crypto.createHmac("sha256", channelSecret).update(rawBody).digest();
  let provided: Buffer;
  try {
    provided = Buffer.from(signatureHeader, "base64");
  } catch {
    return false;
  }

  return expected.length === provided.length && crypto.timingSafeEqual(expected, provided);
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-line-signature");

  if (!verifyLineSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody) as { events?: unknown[] };

  // TODO: route each event (message / postback / follow / etc.) into the
  // plan-execution graph — e.g. resume a paused plan's human-in-the-loop
  // node, or start a new `runPlanExecution` from a user message. Persist
  // the raw event to `event_streams` (type: USER_MESSAGE) once a target
  // Plan is known.
  for (const event of body.events ?? []) {
    console.log("[webhook/line] received event", event);
  }

  return NextResponse.json({ ok: true });
}
