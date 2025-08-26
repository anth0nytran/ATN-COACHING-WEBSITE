import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";

export async function GET() {
  try {
    const sess = await readSession();
    return NextResponse.json({ discordId: sess?.discordId || null, username: sess?.username || null });
  } catch {
    return NextResponse.json({ discordId: null, username: null });
  }
}


