import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runPlanExecution } from "@/lib/langgraph";

// Signature verification (and Prisma) need Node's runtime, which the Edge
// runtime doesn't provide.
export const runtime = "nodejs";

interface LineEvent {
  type: string;
  message?: { type: string; text?: string };
  source?: { userId?: string };
}

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

  const body = JSON.parse(rawBody) as { events?: LineEvent[] };

  for (const event of body.events ?? []) {
    if (event.type !== "message" || event.message?.type !== "text") {
      // TODO: handle postback / follow / other event types once the
      // human-in-the-loop resume path exists.
      console.log("[webhook/line] ignoring non-text event", event.type);
      continue;
    }

    const goal = event.message.text?.trim();
    if (!goal) continue;

    const plan = await prisma.plan.create({
      data: {
        title: goal.length > 80 ? `${goal.slice(0, 77)}...` : goal,
        goal,
        metadata: { source: "line", userId: event.source?.userId ?? null },
      },
    });

    await prisma.eventStream.create({
      data: {
        planId: plan.id,
        type: "PLAN_CREATED",
        level: "INFO",
        message: "Plan created from LINE message",
        actor: "user",
      },
    });

    // Ack LINE quickly; run the graph in the background rather than
    // blocking the webhook response on the full plan execution.
    runPlanExecution({ planId: plan.id, goal }).catch((error: unknown) => {
      console.error(`[webhook/line] plan execution failed for plan ${plan.id}`, error);
    });
  }

  return NextResponse.json({ ok: true });
}
