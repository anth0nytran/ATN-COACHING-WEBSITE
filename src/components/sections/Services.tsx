"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, TrendingUp, PlayCircle, Users, Target, Rocket, Calendar, CircleHelp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Reveal from "./Reveal";

import servicesData from "@/data/services.json";

// Simple hover tooltip
function InfoTooltip({ items }: { items: string[] }) {
  return (
    <div className="relative group inline-flex items-center">
      <CircleHelp className="w-4 h-4 text-gray-400 group-hover:text-gray-200" />
      <div className="pointer-events-none absolute left-1/2 top-6 z-50 w-72 -translate-x-1/2 rounded-md border border-gray-700 bg-[#111318] p-3 text-left opacity-0 shadow-xl transition-all duration-150 group-hover:translate-y-1 group-hover:opacity-100">
        <ul className="space-y-1.5 text-xs text-gray-200">
          {items.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const metricsForService: Record<string, string[]> = {
  "vod-review": ["per VOD", "individual"],
  "intro-coaching": ["1 hr live", "individual"],
  "standard-coaching": ["2 hr live", "individual"],
  "duo-queue": ["per game", "duo queue"],
  "weekly-program": ["per week", "program"],
  "rank-accelerator": ["5–6 sessions", "bootcamp"],
};

const tooltipByService: Record<string, string[]> = {
  "vod-review": [
    "Get a pro’s eyes on your VOD and pinpoint the 1–2 habits quietly draining MMR",
    "Leave with a 3‑step action plan you can run in your very next ranked game",
    "Understand the ‘why’ behind deaths—timing, spacing, utility—not just the clip",
    "Low‑risk way to try Valorant coaching and see fast, measurable improvement",
  ],
  "intro-coaching": [
    "Live, 1‑on‑1 Valorant coaching laser‑focused on your biggest bottleneck",
    "Pre‑aim heads with smarter crosshair placement instead of reacting late",
    "Turn map confusion into a simple pathing plan you can follow every round",
    "Perfect if you’re Gold–Plat and want visible wins this week, not ‘someday’",
    "Walk away with drills tailored to your mechanics and schedule",
  ],
  "standard-coaching": [
    "Two focused hours to overhaul decision‑making, micro, and clutch confidence",
    "We’ll reveal your top ‘rank blockers’ and replace them with winning routines",
    "Open a written improvement plan before every session so progress compounds",
    "Built for Diamond–Immortal goals—expect clarity, not guesswork",
    "Know exactly what to practice and how to track it between sessions",
  ],
  "duo-queue": [
    "Climb while you learn—every round comes with live callouts and the ‘why’",
    "Borrow my IGL brain for rotations, timings, and eco/clutch composure",
    "Level‑up comms that actually win rounds (no filler chatter)",
    "Real‑time feedback means fewer throw rounds and more closes",
    "Best if you learn by doing and want momentum now",
  ],
  "weekly-program": [
    "A 7‑day rhythm so you always know exactly what to train next",
    "Weekly deep breakdowns + one VOD to keep you honest and improving",
    "Custom aim + utility routines for your agent pool (no generic drills)",
    "Accountability check‑ins so you stop guessing and start ranking up",
    "Steady gains without burnout—designed for sustainable progress",
  ],
  "rank-accelerator": [
    "5–6 duo sessions engineered for rapid rank gains—no fluff, just climb",
    "After each match you’ll get targeted fixes to lock in improvement fast",
    "Pressure‑proofing: mindset + drills for eco swings and clutch rounds",
    "Build durable habits that keep you at higher elo, not a one‑week spike",
    "Best value if Immortal+ is the goal and you want momentum immediately",
  ],
};

export function Services() {
  const handleBookService = async (serviceId: string) => {
    try {
      const hasSession = document.cookie.split(";").some((c) => c.trim().startsWith("sid="));
      if (!hasSession) {
        const returnTo = encodeURIComponent(`/checkout-auto?serviceId=${encodeURIComponent(serviceId)}${process.env.NODE_ENV !== "production" ? "&bypass=1" : ""}`);
        window.location.href = `/api/auth/login?returnTo=${returnTo}`;
        return;
      }
      window.location.href = `/checkout-auto?serviceId=${encodeURIComponent(serviceId)}${process.env.NODE_ENV !== "production" ? "&bypass=1" : ""}`;
    } catch {
      // no-op UI for now
    }
  };

  const handleJoinDiscord = () => {
    const invite = process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.com";
    window.open(invite, "_blank");
  };

  const iconForService = (id: string) => {
    if (id.includes("vod")) return <PlayCircle className="w-6 h-6" style={{ color: "#60a5fa" }} />;
    if (id.includes("duo")) return <Users className="w-6 h-6" style={{ color: "#34d399" }} />;
    if (id.includes("weekly")) return <Calendar className="w-6 h-6" style={{ color: "#f59e0b" }} />;
    if (id.includes("bootcamp") || id.includes("accelerator")) return <Rocket className="w-6 h-6" style={{ color: "#f472b6" }} />;
    return <Target className="w-6 h-6" style={{ color: "#ef4444" }} />;
  };

  return (
    <section id="services" className="section-padding">
      <div className="container-max">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Choose Your <span className="text-gradient">Coaching Path</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">From quick VOD reviews to intensive bootcamps, I have a coaching option that fits your goals and budget.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {servicesData.services.map((service, idx) => {
            const metrics = metricsForService[service.id] || [];
            const tips = tooltipByService[service.id] || [];
            return (
              <Reveal key={service.id} staggerDelayMs={idx * 60}>
              <Card className={`card-surface ${service.popular ? "relative" : ""}`} style={service.popular ? { outline: "1px solid rgba(239,68,68,0.6)" } : undefined}>
                {service.popular && (<div className="popular-ribbon">Most Popular</div>)}
                <CardHeader>
                  <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(148,163,184,0.25)" }}>{iconForService(service.id)}</div>
                  <CardTitle className="text-2xl text-white mb-1">{service.title}</CardTitle>
                  <CardDescription className="text-gray-300 clamp-2">{service.subtitle}</CardDescription>
                  {(metrics.length > 0 || tips.length > 0) && (
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                      {metrics.length > 0 && (<span>{metrics.join(" • ")}</span>)}
                      {tips.length > 0 && <InfoTooltip items={tips} />}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{formatPrice(service.price)}</span>
                    {service.originalPrice && service.originalPrice > service.price && (<span className="text-base text-gray-400 line-through">{formatPrice(service.originalPrice)}</span>)}
                  </div>
                  <ul className="space-y-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3"><Check className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" /><span className="text-gray-300 leading-relaxed">{feature}</span></li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button variant="valorant" size="lg" className="w-full valorant-button" onClick={() => handleBookService(service.id)}>Book This Service</Button>
                </CardFooter>
              </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="text-center mb-6">
          <div className="limited-bar mb-6">Limited Time Bundles</div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Save More with <span className="text-gradient">Coaching Bundles</span></h3>
          <p className="text-lg text-gray-300">Commit to improvement and save money with discounted packages</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {servicesData.bundles.map((bundle, idx) => {
            const bundleTips = tooltipByService[bundle.id] || [];
            return (
              <Reveal key={bundle.id} staggerDelayMs={idx * 60}>
              <Card className="card-surface">
                <CardHeader>
                  <div className="mb-3 inline-flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(148,163,184,0.25)" }}>{idx % 2 === 0 ? <Rocket className="w-6 h-6" style={{ color: "#f97316" }} /> : <Users className="w-6 h-6" style={{ color: "#22d3ee" }} />}</div>
                  <CardTitle className="text-xl text-white">{bundle.title}</CardTitle>
                  <CardDescription className="text-gray-300 clamp-2">{bundle.subtitle}</CardDescription>
                  {bundleTips.length > 0 && (
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                      <InfoTooltip items={bundleTips} />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-white mb-1">{formatPrice(bundle.price)}</div>
                    {bundle.originalPrice && bundle.originalPrice > bundle.price && (<div className="text-sm text-gray-400">Save {formatPrice(bundle.originalPrice - bundle.price)}!</div>)}
                  </div>
                  <p className="text-gray-300 text-sm text-center clamp-2">{bundle.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="valorant" size="lg" className="w-full valorant-button" onClick={() => handleBookService(bundle.id)}>Get Bundle</Button>
                </CardFooter>
              </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="text-center card-surface p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Start Your <span className="text-gradient">Rank Journey?</span></h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">Join our Discord community for free tips, VOD reviews, and connect with other players on the same improvement path.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="valorant" size="xl" className="valorant-button" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}><TrendingUp className="mr-2 w-5 h-5" />Book Your First Session</Button>
            <Button variant="valorant-outline" size="xl" className="valorant-button-outline" onClick={handleJoinDiscord}><Star className="mr-2 w-5 h-5" />Join Discord Community</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
