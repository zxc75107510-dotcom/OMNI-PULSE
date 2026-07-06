import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

// Signature verification needs Node's `crypto` module, which the Edge
// runtime doesn't provide.
export const runtime = "nodejs";

/**
 * Meta's webhook verification handshake — echoes back `hub.challenge` when
 * `hub.verify_token` matches the value configured in the Meta App dashboard.
 * https://developers.facebook.com/docs/graph-api/webhooks/getting-started
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && challenge && token === process.env.IG_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "verification failed" }, { status: 403 });
}

/**
 * Verifies the `x-hub-signature-256` header against the raw body using the
 * Meta app secret (HMAC-SHA256, hex-encoded, `sha256=` prefixed).
 * https://developers.facebook.com/docs/messenger-platform/webhooks#security
 */
function verifyInstagramSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.IG_APP_SECRET;
  if (!appSecret || !signatureHeader?.startsWith("sha256=")) return false;

  const expected = crypto.createHmac("sha256", appSecret).update(rawBody).digest();
  let provided: Buffer;
  try {
    provided = Buffer.from(signatureHeader.slice("sha256=".length), "hex");
  } catch {
    return false;
  }

  return expected.length === provided.length && crypto.timingSafeEqual(expected, provided);
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyInstagramSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody) as { entry?: unknown[] };

  // TODO: parse `messaging` entries per the Instagram Messaging webhook
  // payload and route into the plan-execution graph (see webhook/line for
  // the equivalent TODO on the LINE side).
  for (const entry of body.entry ?? []) {
    console.log("[webhook/instagram] received entry", entry);
  }

  return NextResponse.json({ ok: true });
}
