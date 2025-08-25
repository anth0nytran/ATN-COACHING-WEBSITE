"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Star, TrendingUp, Clock, BrainCircuit, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

// Small CountUp component that starts when visible
function CountUp({ end, duration = 1600, suffix = "", prefix = "" }: { end: number; duration?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            setStarted(true);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(step);
      else setValue(end);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [started, duration, end]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

// Showcase carousel (images + local videos)
type ShowcaseItem = { type: "image" | "video"; src: string; alt?: string };

function ShowcaseCarousel({ items }: { items: ShowcaseItem[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [expandedSrc, setExpandedSrc] = useState<string | null>(null);

  const updateScale = () => {
    const container = containerRef.current;
    if (!container) return;
    const mid = container.scrollLeft + container.clientWidth / 2;
    itemRefs.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2 + container.scrollLeft;
      const dist = Math.abs(center - mid);
      const scale = Math.max(0.9, 1 - dist / 900);
      el.style.transform = `scale(${scale.toFixed(3)})`;
      el.style.opacity = String(Math.max(0.6, scale));
    });
  };

  useEffect(() => {
    updateScale();
    const c = containerRef.current;
    if (!c) return;
    const onScroll = () => updateScale();
    c.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => updateScale());
    ro.observe(c);
    return () => {
      c.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const scrollByAmount = (dir: -1 | 1) => {
    const c = containerRef.current;
    if (!c) return;
    c.scrollBy({ left: dir * (c.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button aria-label="Previous" onClick={() => scrollByAmount(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full border border-gray-700 bg-black/40 p-2 text-white hover:bg-black/60">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button aria-label="Next" onClick={() => scrollByAmount(1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full border border-gray-700 bg-black/40 p-2 text-white hover:bg-black/60">
        <ChevronRight className="w-5 h-5" />
      </button>

      <div ref={containerRef} className="scrollbar-hide overflow-x-auto snap-x snap-mandatory flex gap-6 px-2 py-2">
        {items.map((it, i) => (
          <div
            key={i}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="snap-center shrink-0 transition-transform duration-200 ease-out"
            style={{ width: "min(82vw, 720px)" }}
          >
            <div className="card-surface overflow-hidden" style={{ aspectRatio: "16/9" }}>
              {it.type === "image" ? (
                <img src={it.src} alt={it.alt || "credential"} className="h-full w-full object-contain" />
              ) : it.type === "video" ? (
                <button className="h-full w-full" onClick={() => setExpandedSrc(it.src)}>
                  <video
                    src={it.src}
                    className="h-full w-full object-contain bg-black"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    controls
                    onVolumeChange={(e) => { const v = e.currentTarget; if (!v.muted || v.volume !== 0) { v.muted = true; v.volume = 0; } }}
                    onPlay={(e) => { const v = e.currentTarget; v.muted = true; v.volume = 0; }}
                  />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {expandedSrc && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4" onClick={() => setExpandedSrc(null)}>
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <video
              src={expandedSrc}
              className="w-full h-auto max-h-[80vh] object-contain bg-black"
              controls
              autoPlay
              playsInline
              muted
              onVolumeChange={(e) => { const v = e.currentTarget; if (!v.muted || v.volume !== 0) { v.muted = true; v.volume = 0; } }}
              onPlay={(e) => { const v = e.currentTarget; v.muted = true; v.volume = 0; }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function Credentials() {
  const achievements = [
    {
      icon: Clock,
      title: "10,000+ Hours in FPS Titles",
      description:
        "From rock‑solid fundamentals—crosshair, movement, economy—to advanced timing, utility, and win‑condition play.",
      color: "text-yellow-400",
    },
    {
      icon: BrainCircuit,
      title: "IGL Across Collegiate, Semi‑Pro & Pro",
      description:
        "Built playbooks, called mid‑rounds, and ran reviews for teams at every tier—so you learn systems that win matches.",
      color: "text-green-400",
    },
    {
      icon: Trophy,
      title: "Tournament Placements & LAN Experience",
      description:
        "Stage‑tested in LAN and online brackets, including deep runs and titles—calm comms and composure under pressure.",
      color: "text-red-400",
    },
    {
      icon: GraduationCap,
      title: "100+ VODs Turned Into Results",
      description:
        "Personal breakdowns → written plans and measurable drills that turn practice into rank, not aimless grinding.",
      color: "text-blue-400",
    },
  ];

  const stats = [
    { label: "Students Coached", value: 100, suffix: "+", icon: Users },
    { label: "Average Rank Gain", value: 3, suffix: " Tiers", icon: TrendingUp },
    { label: "Success Rate", value: 95, suffix: "%", icon: Star },
    { label: "Years Experience", value: 8, suffix: "+", icon: Clock },
  ];

  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  useEffect(() => {
    let active = true;
    // 1) Load images from /public/credentials via API
    const imagesPromise: Promise<ShowcaseItem[]> = fetch("/api/credentials")
      .then((r) => (r.ok ? r.json() : []))
      .then((names: string[]) => (
        Array.isArray(names)
          ? (names.map((n) => ({ type: "image", src: `/credentials/${encodeURIComponent(n)}` } as ShowcaseItem)) as ShowcaseItem[])
          : ([] as ShowcaseItem[])
      ))
      .catch(() => [] as ShowcaseItem[]);

    // 2) Load mp4 clips from /public/videos via API
    const videosPromise: Promise<ShowcaseItem[]> = fetch("/api/videos")
      .then((r) => (r.ok ? r.json() : []))
      .then((clips: string[]) => (
        Array.isArray(clips)
          ? (clips
              .filter((f) => f.toLowerCase().endsWith(".mp4"))
              .map((f) => ({ type: "video", src: `/videos/${encodeURIComponent(f)}` } as ShowcaseItem)) as ShowcaseItem[])
          : ([] as ShowcaseItem[])
      ))
      .catch(() => [] as ShowcaseItem[]);

    Promise.all([imagesPromise, videosPromise]).then(([images, videos]) => {
      if (!active) return;
      setShowcaseItems([...images, ...videos]);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="credentials" className="section-padding">
      <div className="container-max">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Why Trust <span className="text-gradient">My Coaching?</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Real achievements, proven results, and the experience to back up every claim. I&apos;ve walked the path you&apos;re on and know exactly what it takes to succeed.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {achievements.map((achievement, index) => (
            <Reveal key={index} staggerDelayMs={index * 80}>
            <Card className="card-surface group">
              <CardHeader>
                <div className={`${achievement.color} mb-4`}>
                  <achievement.icon className="w-12 h-12" />
                </div>
                <CardTitle className="text-2xl text-white">{achievement.title}</CardTitle>
                <CardDescription className="text-gray-300 text-lg">{achievement.description}</CardDescription>
              </CardHeader>
            </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="card-surface p-8 md:p-12 mb-16 stat-bar">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-icon"><stat.icon className="w-5 h-5" /></div>
              <div className="stat-value">
                <CountUp end={stat.value} suffix={stat.suffix as string} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </Reveal>

        <Reveal className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Credentials Showcase</h3>
          <ShowcaseCarousel items={showcaseItems} />
        </Reveal>

        <Reveal className="text-center card-surface p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Work with a <span className="text-gradient">Proven Coach?</span></h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">My credentials speak for themselves. Now let&apos;s work on yours. Book a session and start your journey to the next rank.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="valorant" size="xl" className="valorant-button">Book Your Session</Button>
            <Button variant="valorant-outline" size="xl" className="valorant-button-outline">See How It Works</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
