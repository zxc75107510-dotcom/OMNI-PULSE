const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

/** Sends a DM reply via the Instagram/Messenger Send API using the page access token. */
export async function sendInstagramMessage(recipientId: string, text: string): Promise<void> {
  const accessToken = process.env.IG_PAGE_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn("[instagram] IG_PAGE_ACCESS_TOKEN not set — skipping send");
    return;
  }

  const response = await fetch(
    `${GRAPH_API_BASE}/me/messages?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Instagram send failed: ${response.status} ${errorBody}`);
  }
}
