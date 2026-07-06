import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runPlanExecution } from "@/lib/langgraph";
import { sendInstagramMessage } from "@/lib/messaging";
import { summarizePlanOutcome } from "@/lib/plan-summary";

// Signature verification (and Prisma) need Node's runtime, which the Edge
// runtime doesn't provide.
export const runtime = "nodejs";

interface InstagramMessagingEvent {
  sender?: { id?: string };
  message?: { text?: string; is_echo?: boolean };
}

interface InstagramEntry {
  messaging?: InstagramMessagingEvent[];
}

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

  const body = JSON.parse(rawBody) as { entry?: InstagramEntry[] };

  for (const entry of body.entry ?? []) {
    for (const messagingEvent of entry.messaging ?? []) {
      const senderId = messagingEvent.sender?.id;
      const goal = messagingEvent.message?.text?.trim();

      // `is_echo` events are our own outbound messages bounced back through
      // the same webhook — skip them or every reply would spawn a new Plan.
      if (!senderId || !goal || messagingEvent.message?.is_echo) {
        // TODO: handle postback / quick-reply / other event types once the
        // human-in-the-loop resume path exists.
        continue;
      }

      const plan = await prisma.plan.create({
        data: {
          title: goal.length > 80 ? `${goal.slice(0, 77)}...` : goal,
          goal,
          metadata: { source: "instagram", senderId },
        },
      });

      await prisma.eventStream.create({
        data: {
          planId: plan.id,
          type: "PLAN_CREATED",
          level: "INFO",
          message: "Plan created from Instagram message",
          actor: "user",
        },
      });

      try {
        await sendInstagramMessage(senderId, `收到!正在把「${goal}」拆解成任務⋯`);
      } catch (error) {
        console.error(`[webhook/instagram] ack send failed for plan ${plan.id}`, error);
      }

      // Ack quickly; run the graph in the background and push a follow-up
      // message once it settles rather than blocking the webhook response
      // on the full plan execution.
      runPlanExecution({ planId: plan.id, goal })
        .then(async () => {
          const summary = await summarizePlanOutcome(plan.id, goal);
          await prisma.eventStream.create({
            data: {
              planId: plan.id,
              type: "AGENT_MESSAGE",
              level: "INFO",
              message: summary,
              actor: "agent",
            },
          });
          await sendInstagramMessage(senderId, summary);
        })
        .catch(async (error: unknown) => {
          console.error(`[webhook/instagram] plan execution failed for plan ${plan.id}`, error);
          const message = `處理「${goal}」時發生錯誤:${
            error instanceof Error ? error.message : "unknown error"
          }`;
          await prisma.eventStream
            .create({
              data: { planId: plan.id, type: "ERROR", level: "ERROR", message, actor: "agent" },
            })
            .catch(() => {});
          await sendInstagramMessage(senderId, message).catch(() => {});
        });
    }
  }

  return NextResponse.json({ ok: true });
}
