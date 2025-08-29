import { NextRequest, NextResponse } from "next/server";

const ownerChannelId = process.env.DISCORD_OWNER_CHANNEL_ID;
const discordBotToken = process.env.DISCORD_BOT_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, discord, utm, username } = body as { email?: string; discord?: string; utm?: Record<string, string | undefined>; username?: string };
    if (!email && !discord) return NextResponse.json({ ok: false }, { status: 400 });

    if (ownerChannelId && discordBotToken) {
      const content =
        `New lead\n` +
        (email ? `• Email: ${email}\n` : "") +
        (username ? `• Discord: ${username}${discord ? ` (${discord})` : ""}\n` : (discord ? `• Discord: ${discord}\n` : "")) +
        (utm?.utm_source ? `• Source: ${utm.utm_source}/${utm?.utm_medium || ""}\n` : "");
      try {
        await fetch(`https://discord.com/api/channels/${ownerChannelId}/messages`, {
          method: "POST",
          headers: { Authorization: `Bot ${discordBotToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}


