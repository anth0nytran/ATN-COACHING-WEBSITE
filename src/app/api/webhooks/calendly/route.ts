import { NextRequest, NextResponse } from "next/server";

const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const ownerChannelId = process.env.DISCORD_OWNER_CHANNEL_ID;
const discordAutomationEnabled = ((process.env.DISCORD_AUTOMATION || "").toLowerCase() === "1" || (process.env.DISCORD_AUTOMATION || "").toLowerCase() === "true");

async function notifyOwner(content: string) {
  if (!discordAutomationEnabled) return;
  if (!discordBotToken || !ownerChannelId) return;
  await fetch(`https://discord.com/api/channels/${ownerChannelId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bot ${discordBotToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json() as {
      payload?: {
        invitee?: { email?: string };
        event?: { start_time?: string };
        event_type?: { name?: string };
        questions_and_answers?: Array<{ question?: string; answer?: string }>;
      };
    };
    const inviteeEmail = payload?.payload?.invitee?.email as string | undefined;
    const startTime = payload?.payload?.event?.start_time as string | undefined;
    const discordId = payload?.payload?.questions_and_answers?.find?.((q) => q?.question?.toLowerCase?.().includes("discord"))?.answer as string | undefined;
    const serviceName = payload?.payload?.event_type?.name as string | undefined;
    const qaList = payload?.payload?.questions_and_answers || [];
    const answers = qaList.length > 0 ? qaList.map((q) => `${q?.question}: ${q?.answer}`).join(" | ") : undefined;
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


