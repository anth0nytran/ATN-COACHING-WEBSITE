"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getStoredLead, getStoredUtm, logEvent, saveLeadLocally } from "@/lib/analytics";
import servicesData from "@/data/services.json";

type ServiceItem = {
  id: string;
  title: string;
  price?: number;
  originalPrice?: number;
  subtitle?: string;
  type?: string;
  popular?: boolean;
  features?: string[];
  description?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  services?: string[];
};

type ServicesData = {
  services: ServiceItem[];
  monthly: ServiceItem[];
  bundles: ServiceItem[];
};

function CheckoutAutoInner() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [discordId, setDiscordId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<{ email?: string; discord?: string; member?: string }>({});
  const [checkingMember, setCheckingMember] = useState<boolean>(false);
  const serviceId = params.get("serviceId");
  const bypass = params.get("bypass");
  const requireDiscord = ((process.env.NEXT_PUBLIC_REQUIRE_DISCORD_MEMBERSHIP || "0").toLowerCase() === "1") ||
    ((process.env.NEXT_PUBLIC_REQUIRE_DISCORD_MEMBERSHIP || "").toLowerCase() === "true");

  // On mount, prefill from stored lead if available and load Discord session/membership
  useEffect(() => {
    try {
      const lead = getStoredLead();
      if (lead?.email) setEmail(lead.email);
    } catch {}
    (async () => {
      try {
        const sess = await fetch("/api/session").then((r) => r.json()).catch(() => null);
        if (sess) {
          setDiscordId(sess.discordId || null);
          setUsername(sess.username || null);
        }
      } catch {}
      try {
        const m = await fetch("/api/discord/membership").then((r) => r.json()).catch(() => null);
        if (m && typeof m.member === "boolean") setIsMember(m.member);
      } catch {}
    })();
  }, []);

  const offer = useMemo(() => {
    const all = servicesData as ServicesData;
    const find = (arr?: ServiceItem[]) => (arr || []).find((x) => x.id === serviceId);
    return find(all.services) || find(all.monthly) || find(all.bundles) || null;
  }, [serviceId]);

  async function beginCheckout() {
    if (!serviceId) {
      setError("Missing serviceId");
      return;
    }
    // Save lead locally and send analytics
    saveLeadLocally(email || undefined, undefined);
    // Send lead to backend (fire-and-forget)
    try {
      const utm = getStoredUtm();
      fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email || undefined, utm, username }) });
    } catch {}
    logEvent("checkout_start", { serviceId });
    try {
      const url = bypass ? `/api/checkout?bypass=${encodeURIComponent(bypass)}` : "/api/checkout";
      const utm = getStoredUtm();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, bypass, email: email || undefined, name: username || undefined, utm }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        setError((data?.error as string) || "Failed to create checkout session");
        logEvent("checkout_error", { serviceId, reason: data?.error || "unknown" });
      }
    } catch {
      setError("Failed to create checkout session");
      logEvent("checkout_error", { serviceId, reason: "network" });
    }
  }

  function validateAndContinue() {
    const nextErrors: { email?: string; discord?: string; member?: string } = {};
    if (!email) nextErrors.email = "Email is required";
    if (requireDiscord && !discordId) nextErrors.discord = "Discord sign-in is required";
    if (requireDiscord && !isMember) nextErrors.member = "You need to join the Discord server";
    setErrors(nextErrors);
    const ok = Object.keys(nextErrors).length === 0;
    if (ok) {
      setSubmitted(true);
      beginCheckout();
    }
  }

  const invite = process.env.NEXT_PUBLIC_DISCORD_INVITE || "";
  const returnTo = useMemo(() => {
    const base = `/checkout-auto?serviceId=${encodeURIComponent(serviceId || "")}`;
    return bypass ? `${base}&bypass=${encodeURIComponent(bypass)}` : base;
  }, [serviceId, bypass]);

  return (
    <section className="section-padding relative">
      {/* Subtle animated orbs background */}
      <div className="fx-orbs opacity-40" aria-hidden>
        <div className="orb orb--red" />
        <div className="orb orb--orange" />
        <div className="orb orb--blue" />
      </div>
      <div className="container-max text-white relative z-10">
        {!error ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:items-start max-w-5xl mx-auto">
            <div className="card-surface p-6 rounded-2xl transition-transform duration-200 hover:-translate-y-0.5">
              <div className="text-sm uppercase tracking-wide text-gray-400 mb-1">Step 1</div>
              <h2 className="text-2xl font-bold text-white">Connect Discord</h2>
              <p className="text-gray-300 text-sm mt-1">We use Discord to verify purchases and schedule coaching.</p>
              <div className="mt-4">
                {discordId ? (
                  <div className="rounded-md border border-green-600/40 bg-green-950/30 text-green-300 text-sm px-3 py-2">
                    Connected as <span className="font-semibold">{username || discordId}</span>
                  </div>
                ) : (
                  <a href={`/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`} className="valorant-button">Sign in with Discord</a>
                )}
              </div>
              {discordId ? (
                <div className="mt-4 rounded-md border border-gray-700 bg-gray-900/60 p-3">
                  <div className="text-sm text-gray-300">Server access</div>
                  <div className="mt-1">
                    {isMember ? (
                      <span className="text-green-400 text-sm">Already a member ✓</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <a href={invite} target="_blank" rel="noreferrer" className="valorant-button-outline text-sm">Join Discord Server</a>
                        <button
                          onClick={async () => {
                            setCheckingMember(true);
                            try {
                              const m = await fetch("/api/discord/membership").then((r) => r.json()).catch(() => null);
                              if (m && typeof m.member === "boolean") setIsMember(m.member);
                            } finally { setCheckingMember(false); }
                          }}
                          className="text-xs rounded-md px-3 py-2 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
                        >
                          {checkingMember ? "Checking…" : "I joined, refresh"}
                        </button>
                      </div>
                    )}
                  </div>
                  {!requireDiscord ? (
                    <div className="mt-3 text-xs text-gray-400">Discord is optional right now; you can still proceed to payment.</div>
                  ) : (
                    <div className="mt-3 text-xs text-gray-400">Joining the server is required to continue.</div>
                  )}
                  {errors.discord || errors.member ? (
                    <div className="mt-3 rounded-md border border-red-600 bg-red-950/40 text-red-300 text-xs px-3 py-2">
                      {errors.discord || errors.member}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="card-surface p-6 rounded-2xl transition-transform duration-200 hover:-translate-y-0.5">
              <div className="text-sm uppercase tracking-wide text-gray-400 mb-1">Step 2</div>
              <h3 className="text-2xl font-bold text-white">Your Email</h3>
              <p className="text-gray-300 text-sm mt-1">We’ll send your receipt and next‑step instructions here.</p>
              <div className="mt-4 space-y-3">
                <label className="block text-sm text-gray-300">
                  <span className="sr-only">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full rounded-md bg-gray-900 border px-3 py-2 text-sm text-white ${errors.email ? "border-red-600" : "border-gray-700"}`}
                  />
                </label>
                {errors.email ? (
                  <div className="rounded-md border border-red-600 bg-red-950/40 text-red-300 text-xs px-3 py-2">{errors.email}</div>
                ) : null}
                <div className="rounded-md border border-gray-800 bg-gray-900/60 p-3">
                  <div className="text-sm text-gray-300">You’re about to purchase</div>
                  <div className="text-white font-semibold mt-1">{offer?.title || serviceId || "Selected service"}</div>
                  {offer?.price != null ? (
                    <div className="text-red-400 font-bold">${offer.price}</div>
                  ) : null}
                </div>
                <button
                  onClick={validateAndContinue}
                  className="w-full valorant-button"
                >
                  Continue to Payment
                </button>
                <div className="text-xs text-gray-400">Secure checkout via Stripe. Apple Pay/Google Pay available on supported devices.</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4">{error}</div>
            <Link className="valorant-button" href="/#services">Back to Services</Link>
          </div>
        )}

        {submitted && !error ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(180deg, rgba(17,24,39,0.98) 0%, rgba(17,24,39,0.94) 100%)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
              <div className="text-white font-semibold">Preparing secure checkout…</div>
              <div className="text-gray-300 text-sm mt-1">Please wait, this takes a moment.</div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function CheckoutAutoPage() {
  return (
    <Suspense fallback={<section className="section-padding"><div className="container-max text-center text-white">Preparing checkout…</div></section>}>
      <CheckoutAutoInner />
    </Suspense>
  );
}


