import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";

const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;

export async function GET() {
  try {
    const sess = await readSession();
    const discordId = sess?.discordId;
    if (!discordBotToken || !guildId || !discordId) {
      return NextResponse.json({ member: false });
    }
    const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/${discordId}`, {
      headers: { Authorization: `Bot ${discordBotToken}` },
    });
    if (res.ok) return NextResponse.json({ member: true });
    if (res.status === 404) return NextResponse.json({ member: false });
    return NextResponse.json({ member: false }, { status: 200 });
  } catch {
    return NextResponse.json({ member: false }, { status: 200 });
  }
}


