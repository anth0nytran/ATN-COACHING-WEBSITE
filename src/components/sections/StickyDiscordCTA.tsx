"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function usePersistentDismiss(key: string) {
  const [hidden, setHidden] = React.useState<boolean>(false);
  React.useEffect(() => {
    try {
      const v = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      setHidden(v === "1");
    } catch {
      setHidden(false);
    }
  }, [key]);
  const dismiss = React.useCallback(() => {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(key, "1");
    } catch {
      // noop
    }
    setHidden(true);
  }, [key]);
  return { hidden, dismiss };
}

export default function StickyDiscordCTA() {
  const { hidden, dismiss } = usePersistentDismiss("sticky:discord-cta:v1");
  const invite = process.env.NEXT_PUBLIC_DISCORD_INVITE || "";
  if (hidden || !invite) return null;

  return (
    <div
      role="dialog"
      aria-label="Join our Discord community"
      className="fixed inset-x-0 bottom-0 z-50"
      style={{ pointerEvents: "none" }}
    >
      <div className="mx-auto max-w-6xl px-4 pb-4" style={{ pointerEvents: "auto" }}>
        <div
          className="relative overflow-hidden rounded-2xl border"
          style={{
            background:
              "linear-gradient(90deg, rgba(239,68,68,0.14) 0%, rgba(249,115,22,0.12) 50%, rgba(59,130,246,0.10) 100%)",
            borderColor: "rgba(239,68,68,0.35)",
            boxShadow:
              "0 10px 30px rgba(239,68,68,0.25), 0 6px 12px rgba(0,0,0,0.35)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-red-500 via-orange-400 to-red-500" aria-hidden />

          <div className="p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-white text-lg md:text-xl font-extrabold tracking-tight">
                  Join our Discord community
                </div>
                <div className="text-gray-200 mt-1 text-sm md:text-base">
                  Free VOD reviews, step-by-step guides, aim drills, plus weekly tips & tricks.
                </div>
                <ul className="mt-2 text-gray-300 text-xs md:text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 list-disc list-inside">
                  <li>Community VOD review queue</li>
                  <li>Rank-up guides & playbooks</li>
                  <li>Aim routines used by high‑elo players</li>
                  <li>Meta notes, lineups, and updates</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href={invite} target="_blank" rel="noreferrer">
                  <Button variant="valorant" size="lg" aria-label="Join Discord community">
                    Join Discord
                  </Button>
                </Link>
                <button
                  aria-label="Dismiss"
                  onClick={dismiss}
                  className="rounded-md px-3 py-2 text-xs md:text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


