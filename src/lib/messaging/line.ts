const LINE_API_BASE = "https://api.line.me/v2/bot/message";

async function callLineMessagingApi(path: "reply" | "push", body: unknown): Promise<void> {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn(`[line] LINE_CHANNEL_ACCESS_TOKEN not set — skipping ${path}`);
    return;
  }

  const response = await fetch(`${LINE_API_BASE}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`LINE ${path} API failed: ${response.status} ${errorBody}`);
  }
}

/** Uses the one-shot `replyToken` from an incoming webhook event — fastest way to ack. */
export function replyToLine(replyToken: string, text: string): Promise<void> {
  return callLineMessagingApi("reply", {
    replyToken,
    messages: [{ type: "text", text }],
  });
}

/** Sends an unprompted message to a user, e.g. progress updates after a reply token has expired. */
export function pushToLine(userId: string, text: string): Promise<void> {
  return callLineMessagingApi("push", {
    to: userId,
    messages: [{ type: "text", text }],
  });
}
