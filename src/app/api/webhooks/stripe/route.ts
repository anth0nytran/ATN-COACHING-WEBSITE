import { NextRequest, NextResponse } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;
const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;
const studentRoleId = process.env.DISCORD_STUDENT_ROLE_ID;
const ownerChannelId = process.env.DISCORD_OWNER_CHANNEL_ID;

async function assignRole(discordId: string) {
  if (!discordBotToken || !guildId || !studentRoleId) return;
  await fetch(`https://discord.com/api/guilds/${guildId}/members/${discordId}/roles/${studentRoleId}`, {
    method: "PUT",
    headers: { Authorization: `Bot ${discordBotToken}` },
  });
}

async function notifyOwner(content: string) {
  if (!discordBotToken || !ownerChannelId) return;
  await fetch(`https://discord.com/api/channels/${ownerChannelId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bot ${discordBotToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!secret) return NextResponse.json({ ok: true }); // no-op if not configured
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") || "";

    // Lazy import to avoid bundling stripe on edge
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });
    const event = stripe.webhooks.constructEvent(body, sig, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const metadata = session.metadata || {};
      const discordId = metadata.discordId as string | undefined;
      const serviceId = metadata.serviceId as string | undefined;
      const dateBooked = session.created ? new Date(session.created * 1000).toISOString() : undefined;
      if (discordId) await assignRole(discordId);
      await notifyOwner(
        `Payment confirmed\n` +
        `• Student: ${metadata.username || metadata.name || "(unknown)"} (${discordId || "no-discord"})\n` +
        `• Service: ${serviceId || "?"}\n` +
        (metadata.email ? `• Email: ${metadata.email}\n` : "") +
        (dateBooked ? `• Paid at: ${dateBooked}\n` : "")
      );
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}


