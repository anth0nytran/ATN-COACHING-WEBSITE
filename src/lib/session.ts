import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "sid"; // signed session
const STATE_COOKIE = "oauth_state";
const RETURN_COOKIE = "oauth_return";

export type SessionData = {
  discordId: string;
  username?: string;
};

function getSecret(): string | undefined {
  return process.env.SESSION_SECRET;
}

export function sign(value: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const h = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${h}`;
}

export function verify(signed: string | undefined | null): string | null {
  if (!signed) return null;
  const secret = getSecret();
  if (!secret) return null;
  const idx = signed.lastIndexOf(".");
  if (idx <= 0) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const h = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(h)) ? value : null;
}

export async function setSessionCookie(data: SessionData, maxAgeSec = 60 * 60 * 24 * 7) {
  const raw = JSON.stringify(data);
  const s = sign(raw);
  if (!s) return;
  const store = await cookies();
  store.set(COOKIE_NAME, s, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSec,
  });
}

export async function readSession(): Promise<SessionData | null> {
  const store = await cookies();
  const c = store.get(COOKIE_NAME)?.value;
  const raw = verify(c || null);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
}

export async function setOAuthState(state: string, returnTo?: string, maxAgeSec = 600) {
  const store = await cookies();
  store.set(STATE_COOKIE, state, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: maxAgeSec });
  if (returnTo) store.set(RETURN_COOKIE, returnTo, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: maxAgeSec });
}

export async function readOAuthState(): Promise<{ state?: string; returnTo?: string }> {
  const store = await cookies();
  const s = store.get(STATE_COOKIE)?.value;
  const r = store.get(RETURN_COOKIE)?.value;
  return { state: s, returnTo: r };
}

export async function clearOAuthCookies() {
  const store = await cookies();
  store.set(STATE_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  store.set(RETURN_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
}


