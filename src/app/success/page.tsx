"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
  const [serviceId, setServiceId] = useState<string | undefined>();
  // Simplified: no scheduling or auto-redirects

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
        setServiceId(data?.metadata?.serviceId || sid || undefined);
      })
      .finally(() => setLoading(false));
  }, [params]);

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

  // Calendly removed from new flow
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Thank you for your purchase</h1>
          <p className="text-gray-300">Your payment was received successfully. Next steps below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 card-surface p-6 md:p-8">
            {productCopy && (
              <div className="mb-6">
                <div className="text-sm uppercase tracking-wide text-gray-400">You purchased</div>
                <div className="text-white text-2xl font-semibold">{productCopy.title}</div>
                <div className="text-gray-300 mt-1">{productCopy.details}</div>
              </div>
            )}

            <div className="mb-6 p-5 md:p-6 rounded-xl" style={{
              background: "linear-gradient(90deg, rgba(239,68,68,0.16) 0%, rgba(249,115,22,0.14) 100%)",
              border: "1px solid rgba(239,68,68,0.35)",
              boxShadow: "0 14px 28px rgba(239,68,68,0.12)",
            }}>
              <div className="text-sm uppercase tracking-wide text-red-300 font-extrabold">Scheduling</div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">All scheduling is done in Discord</h2>
              <p className="text-gray-100/90 mt-2">Join the server to access the scheduling text channels. This is where you’ll pick a time, share VODs, and receive updates.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {discordInvite && (<a className="valorant-button" href={discordInvite} target="_blank" rel="noreferrer">Join Discord</a>)}
                <Link href="/" className="valorant-button-outline">Back to Home</Link>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Next steps</h2>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-red-500 mt-0.5" /><span>Check your email for the receipt.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-red-500 mt-0.5" /><span>Join the Discord to get access to new channels and schedule your session.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-red-500 mt-0.5" /><span>Having trouble? Open a support ticket in Discord with a screenshot of this page so we can fix it ASAP.</span></li>
            </ul>

            {/* Buttons removed per request; keeping primary CTA in Scheduling callout above */}
          </div>

          <aside className="card-surface p-6 md:p-8 relative">
            <div
              className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl bg-gradient-to-b from-red-500 via-orange-400 to-red-500"
              aria-hidden
            />
            <h3 className="text-lg font-bold text-white mb-3">Important information</h3>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
              <li>All purchases are final; no refunds.</li>
              <li>Missed sessions without notice may be forfeited.</li>
              <li>Please use the same email you purchased with for any scheduling or verification.</li>
              <li>Typical response time: within 24 hours (Mon–Sat).</li>
              <li>If you don’t schedule ASAP, priority times are not guaranteed and may be lost.</li>
              <li>Need help? Create a support ticket in Discord with a screenshot of the issue.</li>
            </ul>
          </aside>
        </div>
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


