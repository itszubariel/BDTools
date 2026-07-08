import type { VercelRequest, VercelResponse } from "@vercel/node";

interface DiscordEmbedField {
  name: string;
  value: string;
  inline: boolean;
}

interface DiscordEmbedFooter {
  text: string;
}

interface DiscordEmbed {
  title: string;
  color: number;
  fields: DiscordEmbedField[];
  footer: DiscordEmbedFooter;
  timestamp: string;
}

interface DiscordWebhookPayload {
  embeds: DiscordEmbed[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[contact] 🔔 Handler triggered");

  // --- Method check ---
  if (req.method !== "POST") {
    console.warn(`[contact] ⚠️  Invalid HTTP method: ${req.method}`);
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  // --- Env check ---
  const webhookURL = process.env.WEBHOOK_URL;
  if (!webhookURL) {
    console.error("[contact] ❌ Missing WEBHOOK_URL environment variable");
    return res
      .status(500)
      .json({ error: "Server misconfiguration: webhook URL not set." });
  }

  // --- Parse body ---
  let data: unknown;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (err) {
    console.error(
      "[contact] ❌ Failed to parse request body:",
      (err as Error).message,
    );
    return res.status(400).json({ error: "Invalid JSON body." });
  }

  // --- Validate required fields ---
  const { discord, email, topic, subject, msg } = data as {
    discord?: string;
    email?: string;
    topic?: string;
    subject?: string;
    msg?: string;
  };

  if (!subject || !msg) {
    console.warn(
      "[contact] ⚠️  Missing required fields — subject and msg are required",
    );
    return res.status(400).json({ error: "Subject and message are required." });
  }

  console.log(
    `[contact] 📨 Incoming contact form — subject: "${subject}", topic: "${topic || "N/A"}", from: "${discord || "anonymous"}"`,
  );

  const payload: DiscordWebhookPayload = {
    embeds: [
      {
        title: `New Contact Message — ${subject}`,
        color: 0x4f46e5,
        fields: [
          { name: "Discord", value: discord || "N/A", inline: true },
          { name: "Email", value: email || "N/A", inline: true },
          { name: "Topic", value: topic || "N/A", inline: false },
          { name: "Message", value: msg || "N/A", inline: false },
        ],
        footer: { text: "BDTools Contact Form" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  // --- Send to Discord ---
  console.log("[contact] 🚀 Sending payload to Discord webhook...");
  let response: Response;
  try {
    response = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error(
      "[contact] ❌ Network error sending to Discord webhook:",
      (err as Error).message,
    );
    return res
      .status(500)
      .json({ error: "Failed to reach Discord. Please try again." });
  }

  if (!response.ok) {
    let errorText = "";
    try {
      errorText = await response.text();
    } catch (_) {}
    console.error(
      `[contact] ❌ Discord webhook rejected the request (HTTP ${response.status}): ${errorText}`,
    );
    return res
      .status(502)
      .json({
        error: `Discord webhook failed with status ${response.status}.`,
      });
  }

  console.log(
    "[contact] 🎉 Contact form message delivered to Discord successfully",
  );
  return res.status(200).json({ success: true });
}
