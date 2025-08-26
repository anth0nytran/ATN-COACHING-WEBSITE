import { NextRequest, NextResponse } from "next/server";

const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const ownerChannelId = process.env.DISCORD_OWNER_CHANNEL_ID;

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
    const payload = await req.json();
    const inviteeEmail = payload?.payload?.invitee?.email as string | undefined;
    const startTime = payload?.payload?.event?.start_time as string | undefined;
    const discordId = payload?.payload?.questions_and_answers?.find?.((q: any) => q.question?.toLowerCase?.().includes("discord"))?.answer as string | undefined;
    const serviceName = payload?.payload?.event_type?.name as string | undefined;
    const answers = (payload?.payload?.questions_and_answers as any[] | undefined)?.map?.((q) => `${q?.question}: ${q?.answer}`)?.join(" | ") || undefined;
    const line = `Booking scheduled\n` +
      `• Service: ${serviceName || "?"}\n` +
      `• Time: ${startTime || "(time?)"}\n` +
      `• Invitee: ${inviteeEmail || "(email?)"}\n` +
      (discordId ? `• Discord: ${discordId}\n` : "") +
      (answers ? `• Answers: ${answers}` : "");
    await notifyOwner(line);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}


