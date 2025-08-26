"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

type ConfirmResponse = {
  ok: boolean;
  customer?: { email?: string; name?: string };
  orderNumber?: string;
  metadata?: { serviceId?: string };
};

function SuccessInner() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);
  const [email, setEmail] = useState<string | undefined>();
  const [orderNumber, setOrderNumber] = useState<string | undefined>();
  const [serviceId, setServiceId] = useState<string | undefined>();
  // Simplified: no scheduling detection or membership polling

  useEffect(() => {
    const id = params.get("session_id");
    if (!id) {
      setLoading(false);
      return;
    }
    const sid = params.get("serviceId");
    const bypass = id === "bypass" ? "&bypass=1" : "";
    const svc = sid ? `&serviceId=${encodeURIComponent(sid)}` : "";
    fetch(`/api/checkout/confirm?session_id=${encodeURIComponent(id)}${bypass}${svc}`)
      .then((r) => r.json())
      .then((data: ConfirmResponse) => {
        setOk(Boolean(data?.ok));
        setEmail(data?.customer?.email);
        setServiceId(data?.metadata?.serviceId || sid || undefined);
        setOrderNumber(data?.orderNumber);
      })
      .finally(() => setLoading(false));
  }, [params]);

  // No-op effects removed

  const productCopy = useMemo(() => {
    if (!serviceId) return null;
    switch (serviceId) {
      case "vod-review":
        return { title: "VOD Review", details: "One-off expert breakdown with actionable steps." };
      case "intro-coaching":
        return { title: "Intro Coaching (1 hr)", details: "Live 1-on-1 session focused on your biggest bottleneck." };
      case "standard-coaching":
        return { title: "Standard Coaching (2 hrs)", details: "Deep dive coaching with written improvement plan." };
      case "duo-queue":
        return { title: "Duo Queue (per game)", details: "Play ranked with live guidance every decision." };
      case "weekly-program":
        return { title: "Weekly Program", details: "Structured 7‑day plan with sessions and VOD review." };
      case "rank-accelerator":
        return { title: "Rank Accelerator", details: "5–6 session bootcamp engineered for fast gains." };
      case "vod-bundle":
        return { title: "VOD Bundle (3x)", details: "Three VOD reviews to track compounding progress." };
      case "duo-bundle":
        return { title: "Duo Bundle (3x)", details: "Three duo sessions for skill and elo momentum." };
      case "mega-duo-bundle":
        return { title: "Mega Duo Bundle (10x)", details: "Ten duo sessions for maximum long‑term value." };
      default:
        return null;
    }
  }, [serviceId]);

  if (loading) return <div className="section-padding"><div className="container-max text-center text-white">Verifying payment…</div></div>;
  if (!ok) return <div className="section-padding"><div className="container-max text-center text-white">Payment not verified. If you were charged, contact support.</div></div>;

  const nonSchedulable = new Set(["vod-bundle", "duo-bundle", "mega-duo-bundle"]);

  // Compile-time inlined envs; avoid dynamic process.env access on the client
  const CALENDLY_DEFAULT = process.env.NEXT_PUBLIC_CALENDLY_URL;
  const CALENDLY_MAP: Record<string, string | undefined> = {
    "vod-review": process.env.NEXT_PUBLIC_CALENDLY_URL_VOD_REVIEW,
    "intro-coaching": process.env.NEXT_PUBLIC_CALENDLY_URL_INTRO_COACHING,
    "standard-coaching": process.env.NEXT_PUBLIC_CALENDLY_URL_STANDARD_COACHING,
    "duo-queue": process.env.NEXT_PUBLIC_CALENDLY_URL_DUO_QUEUE,
    "weekly-program": process.env.NEXT_PUBLIC_CALENDLY_URL_WEEKLY_PROGRAM,
    "rank-accelerator": process.env.NEXT_PUBLIC_CALENDLY_URL_RANK_ACCELERATOR,
    // Bundles intentionally omitted (no scheduling)
  };

  function getCalendlyUrlFor(id?: string): string {
    if (!id) return CALENDLY_DEFAULT || "";
    if (nonSchedulable.has(id)) return ""; // bundles skip Calendly entirely
    return CALENDLY_MAP[id] || CALENDLY_DEFAULT || "";
  }
  const calendlyUrl = getCalendlyUrlFor(serviceId);
  const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE || "";

  return (
    <section className="section-padding relative">
      {/* Animated background */}
      <div className="fx-orbs" aria-hidden>
        <div className="orb orb--red" />
        <div className="orb orb--orange" />
        <div className="orb orb--blue" />
      </div>
      <div className="container-max relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Thank you for your purchase</h1>
          <p className="text-gray-300">Your order has been confirmed{orderNumber ? ` • Order #${orderNumber}` : ""}. Next steps below →</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-10">
          <div className="md:min-h-[760px] flex md:items-center">
            <div>
              {productCopy && (
                <div className="mb-4">
                  <div className="text-sm uppercase tracking-wide text-gray-400">You purchased</div>
                  <div className="text-white text-2xl font-semibold">{productCopy.title}</div>
                  <div className="text-gray-300 mt-1">{productCopy.details}</div>
                </div>
              )}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Next steps</h2>
              <p className="text-gray-300 mb-5">Schedule a session and join the Discord so we can prep resources for you.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-200"><CheckCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <span>Pick a date that fits your schedule. Use the same email as checkout.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-200"><CheckCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <span>Join our Discord to get access to coaching channels and updates{discordInvite ? (<>
                    {" "}<a className="underline text-red-400 hover:text-red-300" href={discordInvite} target="_blank" rel="noreferrer">Join now</a>
                  </>) : null}.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="relative">
            {calendlyUrl ? (
              <div id="schedule" className="p-0 overflow-hidden float-panel">
                <div style={{ width: "100%", display: "grid", placeItems: "center", background: "transparent" }}>
                  <iframe
                    title="Calendly"
                    src={(() => {
                      const host = typeof window !== "undefined" ? window.location.hostname : "";
                      const params = new URLSearchParams();
                      params.set("hide_event_type_details", "1");
                      params.set("hide_gdpr_banner", "1");
                      params.set("embed_type", "Inline");
                      if (host) params.set("embed_domain", host);
                      params.set("background_color", "0d0f14");
                      params.set("text_color", "e5e7eb");
                      params.set("primary_color", "ef4444");
                      if (email) params.set("email", email);
                      return `${calendlyUrl}?${params.toString()}`;
                    })()}
                    style={{ width: "min(640px, 100%)", height: 760, border: 0, background: "transparent" }}
                  />
                </div>
              </div>
            ) : (
              <div className="card-surface p-8 text-center text-gray-300">No scheduling required for this purchase. Check your email and join Discord.</div>
            )}
          </div>
        </div>

        {/* Discord CTA moved to header; keep a simple footer link as backup */}
        {discordInvite && (
          <div className="text-center text-gray-400">Need help? <a className="underline" href={discordInvite} target="_blank" rel="noreferrer">Join Discord</a></div>
        )}
      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<section className="section-padding"><div className="container-max text-center text-white">Loading…</div></section>}>
      <SuccessInner />
    </Suspense>
  );
}


