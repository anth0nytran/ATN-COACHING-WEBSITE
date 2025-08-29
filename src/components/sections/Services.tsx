"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Reveal from "./Reveal";
import servicesData from "@/data/services.json";
import { logEvent } from "@/lib/analytics";

function startCheckout(serviceId: string) {
  try {
    // Track CTA clicks before starting the checkout flow
    logEvent("cta_click", { serviceId });
    const bypass = process.env.NODE_ENV !== "production" ? "?bypass=1" : "";
    // Use existing auto checkout route to maintain current flow
    window.location.href = `/checkout-auto?serviceId=${encodeURIComponent(serviceId)}${bypass}`;
  } catch {
    // noop
  }
}

type CatalogItem = { id: string; price?: number; originalPrice?: number };
type Catalog = { services?: CatalogItem[]; monthly?: CatalogItem[]; bundles?: CatalogItem[] };

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

function formatTimeParts(ms: number): { days: number; hours: number; minutes: number; seconds: number; label: string } {
  const safeMs = ms > 0 ? ms : 0;
  const totalSeconds = Math.floor(safeMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const label = `${days > 0 ? `${days}d ` : ""}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return { days, hours, minutes, seconds, label };
}

function usePersistentCountdown(storageKey: string, durationMs: number) {
  const [endAt, setEndAt] = React.useState<number | null>(null);
  const [now, setNow] = React.useState<number>(Date.now());

  React.useEffect(() => {
    const key = `countdown:${storageKey}`;
    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      let end = stored ? parseInt(stored, 10) : NaN;
      if (!end || Number.isNaN(end) || end < Date.now()) {
        end = Date.now() + durationMs;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, String(end));
        }
      }
      setEndAt(end);
    } catch {
      setEndAt(Date.now() + durationMs);
    }

    const id = typeof window !== "undefined" ? window.setInterval(() => setNow(Date.now()), 1000) : undefined;
    return () => {
      if (id) window.clearInterval(id);
    };
  }, [storageKey, durationMs]);

  const timeLeftMs = endAt ? Math.max(0, endAt - now) : durationMs;
  const parts = formatTimeParts(timeLeftMs);
  return { timeLeftMs, hasEnded: timeLeftMs <= 0, parts, label: parts.label };
}

export function Services() {
  const data = servicesData as unknown as Catalog;
  const priceFor = (id: string): { price?: number; originalPrice?: number } => {
    const inServices = (data.services ?? []).find((x) => x.id === id);
    const inMonthly = (data.monthly ?? []).find((x) => x.id === id);
    const inBundles = (data.bundles ?? []).find((x) => x.id === id);
    const item = inServices ?? inMonthly ?? inBundles;
    return { price: item?.price, originalPrice: item?.originalPrice };
  };

  const PriceTag = ({ id, suffix }: { id: string; suffix?: string }) => {
    const { price, originalPrice } = priceFor(id);
    return (
      <div className="flex items-baseline gap-2">
        {originalPrice && price && originalPrice > price ? (
          <span className="text-gray-400 line-through text-base">${originalPrice}{suffix || ""}</span>
        ) : null}
        {price != null && (
          <span className="text-red-400 font-extrabold text-xl md:text-2xl">${price}{suffix || ""}</span>
        )}
      </div>
    );
  };
  const iglCountdown = usePersistentCountdown("igl-series-offer-14d", FOURTEEN_DAYS_MS);
  // Detect canceled checkouts when users return from Stripe and track the event once
  React.useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      const canceled = url.searchParams.get("canceled");
      if (canceled === "1") {
        logEvent("checkout_cancel");
        // Remove the flag so the event doesn't fire again on refresh
        url.searchParams.delete("canceled");
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      }
    } catch {
      // noop
    }
  }, []);
  return (
    <section id="services" className="section-padding">
      <div className="container-max">
        <Reveal className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Pick Your <span className="text-gradient">Coaching Path</span></h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">Streamlined options to help you improve faster—single passes for quick wins, monthly plans for momentum, and bundles for value.</p>
          {/* Sale banner removed per request */}
        </Reveal>

        {/* 1) Single Pass */}
        <Reveal className="guide-section mb-8">
          <div className="guide-kicker">Single Pass</div>
          <h3 className="guide-h2">Quick, focused coaching for immediate improvement.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:[grid-auto-rows:1fr]">
            <div className="card-surface p-6 h-full flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xl font-bold text-white">1 Live VOD Review</h4>
                <PriceTag id="live-vod-review" />
              </div>
              <p className="text-gray-300 mt-2">We’ll go through one of your games together live and break down your mistakes, decision‑making, and positioning.</p>
              <ul className="mt-3 space-y-1 text-gray-200">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-red-500" aria-hidden /><span>Leave with 2–3 instant improvements</span></li>
              </ul>
              <div className="mt-4 pt-2 md:mt-auto"><Button aria-label="Get Started - Live VOD Review" variant="valorant" onClick={() => startCheckout("live-vod-review")}>Get Started</Button></div>
            </div>
            <div className="card-surface p-6 h-full flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xl font-bold text-white">Quick 1‑Hour 1:1 Session</h4>
                <PriceTag id="quick-1h-1on1" />
              </div>
              <p className="text-gray-300 mt-2">One‑on‑one coaching tailored to your rank and goals. Includes a short live VOD breakdown plus feedback on gameplay, aim routine, and mindset.</p>
              <ul className="mt-3 space-y-1 text-gray-200">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-red-500" aria-hidden /><span>Personalized, fast impact</span></li>
              </ul>
              <div className="mt-4 pt-2 md:mt-auto"><Button aria-label="Book 1:1 Session" variant="valorant" onClick={() => startCheckout("quick-1h-1on1")}>Book 1:1</Button></div>
            </div>
          </div>
        </Reveal>

        {/* 2) Monthly Packages */}
        <Reveal className="guide-section mb-8">
          <div className="guide-kicker">Monthly Packages (Most Popular)</div>
          <h3 className="guide-h2">Consistent coaching designed to help you climb every month.</h3>
          <p className="text-gray-300 mb-4">A mix of live sessions and Pro Analysis Reports (pre‑recorded reviews with notes & improvement plans).</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:[grid-auto-rows:1fr]">
            <div className="card-surface p-6 relative h-full flex flex-col transition-transform duration-200 hover:-translate-y-1">
              <h4 className="text-white font-bold text-lg">Bronze / Climber</h4>
              <div className="mt-1"><PriceTag id="monthly-bronze" suffix="/month" /></div>
              <ul className="mt-3 space-y-2 text-gray-200 list-disc list-inside">
                <li>1 × 1‑on‑1 live session (60 min)</li>
                <li>1 × Pro Analysis Report (pre‑recorded VOD review + improvement plan)</li>
                <li>Custom aim & warmup routine</li>
                <li>Access to exclusive Discord tips & Q&A</li>
              </ul>
              <p className="text-gray-400 mt-3">Noticeable improvements in fundamentals, aim, and positioning without heavy time commitment.</p>
              <div className="mt-4 pt-2 md:mt-auto"><Button aria-label="Choose Bronze" variant="valorant-outline" onClick={() => startCheckout("monthly-bronze")}>Choose Bronze</Button></div>
            </div>
            <div className="card-surface p-6 relative h-full flex flex-col transition-transform duration-200 hover:-translate-y-1 popular-flare">
              <div className="popular-ribbon">Most Popular</div>
              <h4 className="text-white font-bold text-lg">Silver / Rank‑Up</h4>
              <div className="mt-1"><PriceTag id="monthly-silver" suffix="/month" /></div>
              <ul className="mt-3 space-y-2 text-gray-200 list-disc list-inside">
                <li>2 × 1‑on‑1 live sessions (60 min each)</li>
                <li>2 × Pro Analysis Reports per month with timestamped notes</li>
                <li>Agent‑specific deep dives & strategies</li>
                <li>Optional small‑group scrims</li>
                <li>Personalized weekly goals</li>
              </ul>
              <p className="text-gray-400 mt-3">Climb faster with structured live coaching plus ongoing improvement reports to keep you on track.</p>
              <div className="mt-4 pt-2 md:mt-auto"><Button aria-label="Choose Silver" variant="valorant" onClick={() => startCheckout("monthly-silver")}>Choose Silver</Button></div>
            </div>
            <div className="card-surface p-6 relative h-full flex flex-col transition-transform duration-200 hover:-translate-y-1">
              <h4 className="text-white font-bold text-lg">Gold / Elite</h4>
              <div className="mt-1"><PriceTag id="monthly-gold" suffix="/month" /></div>
              <ul className="mt-3 space-y-2 text-gray-200 list-disc list-inside">
                <li>Weekly 1‑on‑1 live sessions</li>
                <li>Unlimited Pro Analysis Reports</li>
                <li>Custom agent & team strategy guides</li>
                <li>Priority scrim & coaching access</li>
                <li>Mindset & IGL coaching</li>
                <li>Personalized improvement roadmap</li>
              </ul>
              <p className="text-gray-400 mt-3">Train like a semi‑pro with constant feedback, a tailored roadmap, and insider‑level strategies.</p>
              <div className="mt-4 pt-2 md:mt-auto"><Button aria-label="Choose Gold" variant="valorant-outline" onClick={() => startCheckout("monthly-gold")}>Choose Gold</Button></div>
            </div>
          </div>
        </Reveal>

        {/* 3) Bundles */}
        <Reveal className="guide-section">
          <div className="guide-kicker">Bundles</div>
          <h3 className="guide-h2">Special packs for extra value or live mentoring experiences.</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-200 md:[grid-auto-rows:1fr]">
            <div className="frame-outline p-6 h-full flex flex-col">
              <div className="font-semibold text-white">Duo Queue Bundle (2)</div>
              <div className="mt-1"><PriceTag id="duo-queue-bundle" /></div>
              <p className="text-gray-300 mt-2">Queue live with me. I’ll mentor you in real‑time while we play, coaching your comms, positioning, and decision‑making as it happens.</p>
              <div className="mt-4 pt-2 md:mt-auto"><Button aria-label="Choose Duo Queue Bundle" variant="valorant-outline" onClick={() => startCheckout("duo-queue-bundle")}>Choose Bundle</Button></div>
            </div>
            <div className="frame-outline p-6 h-full flex flex-col">
              <div className="font-semibold text-white">VOD Review Pack (5)</div>
              <div className="mt-1"><PriceTag id="vod-pack-5" /></div>
              <p className="text-gray-300 mt-2">5 × Pro Analysis Reports. Submit multiple games and get detailed breakdowns + improvement drills for each to track growth over time.</p>
              <div className="mt-4 pt-2 md:mt-auto"><Button aria-label="Choose VOD Review Pack" variant="valorant-outline" onClick={() => startCheckout("vod-pack-5")}>Choose Pack</Button></div>
            </div>
            <div className="frame-outline p-6 h-full flex flex-col relative ring-2 ring-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.25)] bg-[radial-gradient(80%_60%_at_80%_0%,rgba(239,68,68,0.12),transparent)]">
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wide rounded bg-red-600 text-white shadow ring-1 ring-red-300/40">Limited Time</span>
              </div>
              <div className="font-semibold text-white">IGL Series</div>
              <div className="mt-1"><PriceTag id="igl-series" /></div>
              <div className="mt-2 text-xs md:text-sm text-red-300 font-semibold" aria-live="polite">Ends in {iglCountdown.label}</div>
              <p className="text-gray-300 mt-2">2‑hour session on how to IGL your ranked teammates: calling structure, round plans, and mid‑rounding. Learn what makes a good IGL and how to lead clean executes in ranked.</p>
              <ul className="mt-3 space-y-1 text-gray-200">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-red-500" aria-hidden /><span>Lead confident executes with clear calls</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-red-500" aria-hidden /><span>Round planning and mid‑rounding frameworks</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-red-500" aria-hidden /><span>Clutch protocols and team comms templates</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-red-500" aria-hidden /><span>Limited slots for hands‑on feedback</span></li>
              </ul>
              <div className="mt-4 pt-2 md:mt-auto"><Button aria-label="Claim Limited IGL Series Offer" variant="valorant" onClick={() => startCheckout("igl-series")}>Claim Limited Offer</Button></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
