"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star } from "lucide-react";
import { scrollToElement } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-[70dvh] flex items-center justify-center overflow-hidden pt-24 pb-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-950">
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom right, rgba(239, 68, 68, 0.12), transparent, rgba(59, 130, 246, 0.12))", filter: "blur(8px)" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.08),transparent_55%)]" style={{ filter: "blur(6px)" }} />
        {/* Bottom fade to blend into next section */}
        <div className="absolute inset-x-0 bottom-0 h-40" style={{
          background: "linear-gradient(to bottom, rgba(17,17,19,0) 0%, rgba(17,17,19,0.6) 40%, rgba(17,17,19,1) 100%)"
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container-max text-center px-4">
        {/* Tagline */}
        <div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Stuck in <span className="text-gradient">Elo Hell?</span>
          <br />
          Get Out With <span className="text-gradient">Proven</span> Coaching
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Stop wasting hours grinding. Learn from an experienced radiant player with <span className="text-red-400 font-semibold"> 10,000+ FPS hours</span> and real results coaching players from any rank.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            variant="valorant"
            size="xl"
            onClick={() => scrollToElement("services")}
            className="group valorant-button"
          >
            Book Your Session
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            variant="valorant-outline"
            size="xl"
            onClick={() => scrollToElement("credentials")}
            className="valorant-button-outline"
          >
            <Play className="mr-2 w-5 h-5" />
            See My Credentials
          </Button>
        </div>

        {/* Social Proof */}
        <AnimatedSocialProof />
      </div>

      {/* Scroll Indicator removed per request */}
    </section>
  );
}

// Animated Social Proof block: left avatars pulse + "Join our Discord"; right stars fill and number counts up to 5.0
function AnimatedSocialProof() {
  const [rating, setRating] = useState(0);
  const [filledStars, setFilledStars] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            // Animate rating 0 -> 5.0 over 1.2s
            const duration = 1200;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              const value = 5 * eased;
              setRating(parseFloat(value.toFixed(1)));
              setFilledStars(Math.min(5, Math.floor(value + 0.001)));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
      <a
        href="https://discord.gg/ajPmnzjaEF"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center space-x-2"
      >
        <Image src="/discord.png" alt="Discord" width={20} height={20} className="w-5 h-5" />
        <span className="group-hover:text-white transition-colors">Join our Discord</span>
      </a>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < filledStars ? "text-yellow-400" : "text-gray-600"}`}
              fill={i < filledStars ? "currentColor" : "none"}
            />
          ))}
        </div>
        <span>
          {rating.toFixed(1)} rating from students
        </span>
      </div>
    </div>
  );
}
