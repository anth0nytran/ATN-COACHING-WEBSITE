import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { setOAuthState } from "@/lib/session";

const clientId = process.env.DISCORD_CLIENT_ID;
const redirectUri = process.env.DISCORD_REDIRECT_URI;

export async function GET(req: NextRequest) {
  if (!clientId || !redirectUri) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  const { searchParams } = new URL(req.url);
  const returnTo = searchParams.get("returnTo") || "/";

  const state = crypto.randomBytes(16).toString("hex");
  await setOAuthState(state, returnTo);

  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "identify");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "consent");

  return NextResponse.redirect(url);
}


