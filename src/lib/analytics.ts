"use client";

import { track as vercelTrack } from "@vercel/analytics";

type AnalyticsParams = Record<string, unknown> | undefined;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

const UTM_KEY = "utm:params:v1";
let cachedUtm: UtmParams | null = null;

function normalizeUtm(url?: URL): UtmParams | null {
  try {
    const u = url || (typeof window !== "undefined" ? new URL(window.location.href) : undefined);
    if (!u) return null;
    const get = (k: string) => (u.searchParams.get(k) || undefined) as string | undefined;
    const params: UtmParams = {
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      utm_term: get("utm_term"),
      utm_content: get("utm_content"),
    };
    const hasAny = Object.values(params).some(Boolean);
    return hasAny ? params : null;
  } catch {
    return null;
  }
}

export function saveUtmFromUrlIfPresent(): void {
  try {
    const params = normalizeUtm();
    if (!params) return;
    cachedUtm = params;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(UTM_KEY, JSON.stringify(params));
    }
  } catch {
    // ignore
  }
}

export function getStoredUtm(): UtmParams | null {
  if (cachedUtm) return cachedUtm;
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(UTM_KEY);
    if (raw) {
      cachedUtm = JSON.parse(raw) as UtmParams;
      return cachedUtm;
    }
    // If not stored, try to capture from current URL
    const fromUrl = normalizeUtm();
    if (fromUrl) {
      cachedUtm = fromUrl;
      window.localStorage.setItem(UTM_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Sends an analytics event to GA4 if available, and also to Vercel Analytics (no-op on free).
 * Automatically augments events with stored UTM parameters when available.
 */
export function logEvent(eventName: string, params?: AnalyticsParams): void {
  const utm = getStoredUtm();
  const withUtm = utm ? { ...(params || {}), ...utm } : (params || {});

  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, withUtm);
    }
  } catch {
    // ignore
  }

  try {
    if (typeof vercelTrack === "function") {
      vercelTrack(eventName, withUtm as Record<string, string | number | boolean | undefined>);
    }
  } catch {
    // ignore
  }
}

export function getStoredLead(): { email?: string; discord?: string } | null {
  try {
    if (typeof window === "undefined") return null;
    const email = window.localStorage.getItem("lead:email") || undefined;
    const discord = window.localStorage.getItem("lead:discord") || undefined;
    if (email || discord) return { email, discord };
  } catch {}
  return null;
}

export function saveLeadLocally(email?: string, discord?: string): void {
  try {
    if (typeof window === "undefined") return;
    if (email) window.localStorage.setItem("lead:email", email);
    if (discord) window.localStorage.setItem("lead:discord", discord);
  } catch {}
}


