import { NextRequest, NextResponse } from "next/server";
import { clearOAuthCookies, readOAuthState, setSessionCookie } from "@/lib/session";

const clientId = process.env.DISCORD_CLIENT_ID!;
const clientSecret = process.env.DISCORD_CLIENT_SECRET!;
const redirectUri = process.env.DISCORD_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const { state: savedState, returnTo } = await readOAuthState();
    if (!code || !state || !savedState || state !== savedState) {
      await clearOAuthCookies();
      return NextResponse.redirect(new URL("/", req.url));
    }

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });
    const token = await tokenRes.json();
    const accessToken = token.access_token as string | undefined;
    if (!accessToken) {
      await clearOAuthCookies();
      return NextResponse.redirect(new URL("/", req.url));
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await userRes.json();
    const discordId = user?.id as string | undefined;
    const username = user?.username as string | undefined;
    if (!discordId) {
      await clearOAuthCookies();
      return NextResponse.redirect(new URL("/", req.url));
    }

    await setSessionCookie({ discordId, username });
    await clearOAuthCookies();
    return NextResponse.redirect(new URL(returnTo || "/", req.url));
  } catch {
    await clearOAuthCookies();
    return NextResponse.redirect(new URL("/", req.url));
  }
}


