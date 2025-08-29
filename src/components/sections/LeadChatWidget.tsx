"use client";

import React from "react";
import { logEvent, getStoredUtm, saveLeadLocally } from "@/lib/analytics";

export default function LeadChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    // Auto-open subtly after 6s once per session
    try {
      if (typeof window === "undefined") return;
      const key = "lead-chat:auto:v1";
      const shown = window.sessionStorage.getItem(key) === "1";
      if (shown) return;
      const id = window.setTimeout(() => {
        setOpen(true);
        window.sessionStorage.setItem(key, "1");
        logEvent("lead_widget_open");
      }, 6000);
      return () => window.clearTimeout(id);
    } catch {}
  }, []);

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40">
      {!open ? (
        <button
          onClick={() => { setOpen(true); logEvent("lead_widget_open_click"); }}
          aria-label="Open coach chat"
          className="rounded-full bg-gray-900/90 border border-gray-700 text-white shadow-lg px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-gray-800"
        >
          Need help?
        </button>
      ) : (
        <div className="sm:w-80 w-[min(92vw,22rem)] rounded-2xl overflow-hidden border border-gray-700 shadow-2xl" style={{ background: "linear-gradient(180deg, rgba(17,24,39,0.98) 0%, rgba(17,24,39,0.94) 100%)" }}>
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between bg-[rgba(15,23,42,0.6)] backdrop-blur">
            <div className="text-white font-semibold text-sm tracking-wide">ATN COACHING</div>
            <button className="text-gray-400 hover:text-gray-200 text-lg leading-none" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </div>
          <div className="p-4 text-sm text-gray-200 space-y-3">
            {!sent ? (
              <>
                <div className="text-gray-100">Want the free VOD Review Checklist? I can email it to you.</div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white"
                  />
                  <button
                    onClick={() => {
                      if (!email) return;
                      try {
                        saveLeadLocally(email, undefined);
                        const utm = getStoredUtm();
                        fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, utm }) });
                      } catch {}
                      logEvent("lead_capture", { source: "chat_widget" });
                      setSent(true);
                    }}
                    className="valorant-button whitespace-nowrap"
                  >
                    Send
                  </button>
                </div>
                <div className="text-xs text-gray-400">No spam—just the checklist and occasional tips.</div>
              </>
            ) : (
              <div className="text-green-300">Sent! Check your inbox. You can close this window.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


