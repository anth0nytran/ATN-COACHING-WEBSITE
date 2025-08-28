"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type ScoreRow = {
  key: string
  label: string
  score: number | null
  notes: string
}

type PatternRow = {
  key: string
  label: string
  checked: boolean
}

function useLocalState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setState(JSON.parse(raw))
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)) } catch {}
  }, [key, state])
  return [state, setState] as const
}

type InteractiveGuideProps = {
  section?: "selfcheck" | "watch" | "patterns" | "metrics" | "drills" | "reflection" | "cta" | "all"
  variant?: "inline" | "card"
}

export default function InteractiveGuide({ section = "all", variant = "inline" }: InteractiveGuideProps) {
  const [scores, setScores] = useLocalState<ScoreRow[]>("ig:scores", [
    { key: "decision", label: "Decision‑Making", score: null, notes: "" },
    { key: "position", label: "Positioning", score: null, notes: "" },
    { key: "utility", label: "Utility Usage", score: null, notes: "" },
    { key: "execution", label: "Execution of Ideas", score: null, notes: "" },
  ])

  const [patterns, setPatterns] = useLocalState<PatternRow[]>("ig:patterns", [
    { key: "overextend", label: "Overextending on certain sites", checked: false },
    { key: "hesitate", label: "Hesitating before peeks", checked: false },
    { key: "misuse", label: "Misusing utility", checked: false },
  ])

  const [roundNotes, setRoundNotes] = useLocalState<string>("ig:roundNotes", "")

  const avgScore = useMemo(() => {
    const nums = scores.map(s => s.score).filter((n): n is number => typeof n === "number")
    if (!nums.length) return null
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
  }, [scores])

  function getRankForAverage(avg: number | null): { label: string; src: string } | null {
    if (avg == null || Number.isNaN(avg)) return null
    // Map average (1–5) to primary ranks in correct order:
    // Iron < Bronze < Silver < Gold < Platinum < Diamond < Ascendant < Immortal < Radiant
    if (avg >= 4.9) return { label: "Radiant", src: "/ranks/Radiant_Rank.png" }
    if (avg >= 4.5) return { label: "Immortal 3", src: "/ranks/Immortal_3_Rank.png" }
    if (avg >= 4.1) return { label: "Ascendant 3", src: "/ranks/Ascendant_3_Rank.png" }
    if (avg >= 3.7) return { label: "Diamond 3", src: "/ranks/Diamond_3_Rank.png" }
    if (avg >= 3.3) return { label: "Platinum 3", src: "/ranks/Platinum_3_Rank.png" }
    if (avg >= 2.7) return { label: "Gold 3", src: "/ranks/Gold_3_Rank.png" }
    if (avg >= 2.1) return { label: "Silver 3", src: "/ranks/Silver_3_Rank.png" }
    if (avg >= 1.5) return { label: "Bronze 3", src: "/ranks/Bronze_3_Rank.png" }
    return { label: "Iron 3", src: "/ranks/Iron_3_Rank.png" }
  }
  const avgRank = useMemo(() => getRankForAverage(avgScore), [avgScore])

  function setScore(key: string, score: number) {
    setScores(prev => prev.map(s => (s.key === key ? { ...s, score } : s)))
  }
  function setNotes(key: string, notes: string) {
    setScores(prev => prev.map(s => (s.key === key ? { ...s, notes } : s)))
  }
  function togglePattern(key: string) {
    setPatterns(prev => prev.map(p => (p.key === key ? { ...p, checked: !p.checked } : p)))
  }
  function resetAll() {
    setScores([
      { key: "decision", label: "Decision‑Making", score: null, notes: "" },
      { key: "position", label: "Positioning", score: null, notes: "" },
      { key: "utility", label: "Utility Usage", score: null, notes: "" },
      { key: "execution", label: "Execution of Ideas", score: null, notes: "" },
    ])
    setPatterns([
      { key: "overextend", label: "Overextending on certain sites", checked: false },
      { key: "hesitate", label: "Hesitating before peeks", checked: false },
      { key: "misuse", label: "Misusing utility", checked: false },
    ])
    setRoundNotes("")
  }

  function renderSelfCheck() {
    return (
      <section className={variant === "card" ? "frame-outline p-6" : "prose prose-invert max-w-none article-prose"}>
        <h3 className="text-xl font-semibold text-white mb-2">1) Quick Overview / Self‑Check</h3>
        <p className="text-gray-300 mb-4">Rate yourself from 1 (needs work) to 5 (confident). The average on the right estimates your current rank tier.</p>
        <div className="grid gap-3 md:gap-5 md:grid-cols-[auto_200px] md:items-start w-fit mx-auto">
          <div className="space-y-2">
            {scores.map((row) => (
              <div key={row.key} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <div className="min-w-[180px] text-gray-200 font-medium">{row.label}</div>
                <div className="inline-flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`h-8 w-8 rounded-md border text-sm ${row.score === n ? "bg-red-500 text-white border-red-500" : "border-white/20 text-gray-300 hover:border-red-500/60"}`}
                      onClick={() => setScore(row.key, n)}
                      aria-label={`${row.label} score ${n}`}
                    >{n}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="md:ml-auto md:self-center">
            <div className="frame-outline px-3 py-4 text-center w-[200px]">
              <div className="text-xs text-gray-400">Estimated rank</div>
              <div className="mt-1 text-sm text-gray-300">Average: {avgScore ?? "—"}</div>
              {avgRank ? (
                <div className="mt-2 flex flex-col items-center gap-2">
                  <img src={avgRank.src} alt={avgRank.label} className="h-14 w-auto object-contain" />
                  <div className="text-white font-semibold text-[13px] leading-none">{avgRank.label}</div>
                </div>
              ) : (
                <div className="mt-2 text-gray-500 text-sm">Pick scores to see rank</div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  function renderWatch() {
    return (
      <section className="prose prose-invert max-w-none article-prose">
        <h3 className="mb-1">Watch Yourself, Not Pros</h3>
        <p>Watch 2–3 rounds and write 1–2 moments you felt unsure. Which decision cost the round? Could you have rotated differently?</p>
        <Textarea
          value={roundNotes}
          onChange={(e) => setRoundNotes(e.target.value)}
          placeholder="e.g. R8: peeked without info; R11: rotated too late"
          className="min-h-[90px] mt-2"
        />
      </section>
    )
  }

  function renderPatterns() {
    return (
      <section className="prose prose-invert max-w-none article-prose">
        <h3 className="mb-1">Identify Patterns</h3>
        <div className="flex flex-col gap-2">
          {patterns.map(p => (
            <label key={p.key} className="inline-flex items-center gap-3 text-gray-200">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={p.checked}
                onChange={() => togglePattern(p.key)}
              />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      </section>
    )
  }

  function renderMetrics() {
    return (
      <section className="prose prose-invert max-w-none article-prose">
        <h3 className="mb-1">Metrics & Numbers</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Kill/Death by engagement type (long vs close)</li>
          <li>Time spent in unsafe positions per round</li>
          <li>Utility efficiency (% smokes/flashes executed correctly)</li>
        </ul>
        <p className="text-gray-400 mt-2">Track these over 5–10 games and look for trends.</p>
      </section>
    )
  }

  function renderDrills() {
    return (
      <section className="prose prose-invert max-w-none article-prose">
        <h3 className="mb-1">Drills & Exercises</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Positioning: Hold two angles on one site; swap and evaluate.</li>
          <li>Decision: Pause a replay before engagements and state your choice.</li>
          <li>Execution: Try one new strat/utility combo per game.</li>
        </ul>
      </section>
    )
  }

  function renderReflection() {
    return (
      <section className="prose prose-invert max-w-none article-prose">
        <h3 className="mb-1">Reflection & Self‑Assessment</h3>
        <ul className="text-gray-300 space-y-1">
          <li>Which engagement went worst, and why?</li>
          <li>Which mistake repeated the most?</li>
          <li>Which decision worked perfectly, and why?</li>
        </ul>
      </section>
    )
  }

  function renderCta() {
    return (
      <section className="frame-outline p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Want a tailored plan?</h3>
            <p className="text-gray-300">Get a pro review and a step‑by‑step plan to climb faster.</p>
          </div>
          <a href="/#services" className="valorant-button">Book a session</a>
        </div>
      </section>
    )
  }

  if (section !== "all") {
    return (
      <div className="space-y-6">
        {section === "selfcheck" && renderSelfCheck()}
        {section === "watch" && renderWatch()}
        {section === "patterns" && renderPatterns()}
        {section === "metrics" && renderMetrics()}
        {section === "drills" && renderDrills()}
        {section === "reflection" && renderReflection()}
        {section === "cta" && renderCta()}
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {renderSelfCheck()}
      {renderWatch()}
      {renderPatterns()}
      {renderMetrics()}
      {renderDrills()}
      {renderReflection()}
      {renderCta()}
      <div className="flex gap-3">
        <Button variant="valorant-outline" onClick={resetAll}>Reset</Button>
      </div>
    </div>
  )
}


