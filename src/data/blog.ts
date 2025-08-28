export type BlogContentNode = {
  type: "h2" | "p"
  text?: string
  html?: string
}

export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string // ISO date
  author: string
  tags: string[]
  readingTimeMinutes: number
  body: BlogContentNode[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "spot-your-own-mistakes-interactive",
    title: "The Secret to Spotting Your Own Mistakes and Climbing Faster (Interactive)",
    description:
      "Professional, interactive self-review system: identify patterns, track metrics, and turn insights into rank‑up action.",
    date: "2025-08-01",
    author: "Antho Coaching",
    tags: ["climbing ranks", "decision-making", "gameplay review", "valorant tips"],
    readingTimeMinutes: 9,
    body: [
      { type: "p", html: "In the competitive world of FPS gaming, many players focus primarily on improving their aim and reaction times. However, research and coaching experience show that decision‑making and positioning often drive outcomes just as much, if not more. By understanding and addressing common mistakes, you can improve faster and climb more consistently." },
      { type: "p", html: "Use this interactive framework to find your own mistakes, track the right metrics, and turn insights into action. Read each section, then complete the light interaction to lock in learning." },
      { type: "h2", text: "1. The Cognitive Edge: Decision‑Making in FPS Games" },
      { type: "p", html: "Experienced FPS players tend to make better decisions under pressure. For example, research from the University of Sheffield observed faster correct decisions and more appropriate responses among veteran Counter‑Strike players, likely due to improved cognitive processing and exposure to high‑pressure scenarios (<a href=\"https://www.sheffield.ac.uk\" target=\"_blank\" rel=\"noopener noreferrer\">sheffield.ac.uk</a>)." },
      { type: "p", html: "In ranked play, most round‑losing mistakes trace back to a decision chain: poor info → bad options → late commit. Build a simple loop each round: <strong>get info</strong> (sound cues, utility, teammate positions), <strong>name options</strong> (fight, rotate, exec, bait), <strong>commit</strong> with a time limit, then <strong>review</strong> one key decision post‑round. This turns ‘game sense’ into a repeatable system." },
      { type: "p", html: "Actionable checkpoint before every fight: <em>position, plan, peace</em>. Are you in a strong position? What is your plan if the first duel fails? Are you calm enough to stop before you shoot? These three checks alone reduce throw rounds dramatically." },
      { type: "h2", text: "2. Positioning: The Overlooked Skill" },
      { type: "p", html: "Aiming matters, but positioning frequently determines whether your mechanics even get a chance. Studies and practical analyses highlight common strategic errors such as leaving advantageous positions early or neglecting elevation advantages, which lead to low‑percentage duels (<a href=\"https://arxiv.org\" target=\"_blank\" rel=\"noopener noreferrer\">arxiv.org</a>)." },
      { type: "p", html: "Think in <strong>percentage positions</strong>: play spots that force enemies to clear into your crosshair and deny multi‑angle exposure. Prioritize elevation, cover you can fall behind, and lines that convert utility (smokes, flashes) into a free swing. Build crossfires on defense; on attack, slice the pie so you isolate one angle at a time." },
      { type: "p", html: "Common positioning leaks: wide swings with no trade setup, anchoring open angles in disadvantage, and pushing through utility without a timing plan. Fix one leak per map until it becomes automatic." },
      { type: "h2", text: "3. The Impact of Repeated Mistakes" },
      { type: "p", html: "Improvement comes from identifying and eliminating recurring errors. Analyses of player behavior show performance improves with deliberate practice across all skill levels—and players who persist and iterate on mistakes trend upward over time (<a href=\"https://arxiv.org\" target=\"_blank\" rel=\"noopener noreferrer\">arxiv.org</a>)." },
      { type: "p", html: "Track three numbers over 10 games: <strong>avoidable deaths</strong> (died with no trade or info), <strong>early info moments</strong> (you or a teammate got safe info), and <strong>utility success rate</strong> (did your smoke/flash do its job?). Draw arrows ↑/→/↓ after each session. Most players climb when avoidable deaths drop by just 2 per game." },
      { type: "h2", text: "4. Feedback and Self‑Analysis" },
      { type: "p", html: "Self‑reflection plus structured feedback accelerates growth. Players who review their own decisions and seek constructive critique learn faster. Tools like Aim Lab can provide objective metrics to guide practice (<a href=\"https://en.wikipedia.org/wiki/Aim_Lab\" target=\"_blank\" rel=\"noopener noreferrer\">wikipedia.org</a>)." },
      { type: "p", html: "Do a <strong>3‑clip review</strong> after each match: one loss round, one close round, one win round. Ask: What was my <em>assumption</em>? What info did I have? What option would have been higher percentage? Write one sentence you can apply next game. This tiny habit compounds fast and feeds your decision loop." },
      { type: "h2", text: "5. Practice with Purpose" },
      { type: "p", html: "Deliberate practice beats volume. Set specific goals (e.g., better post‑plant positioning, faster rotate decisions) and measure results. Research on expert performance shows targeted, feedback‑rich practice outperforms mindless repetition (<a href=\"https://online.ucpress.edu\" target=\"_blank\" rel=\"noopener noreferrer\">online.ucpress.edu</a>)." },
      { type: "p", html: "Weekly template that fits ranked: <strong>Mon/Wed/Fri</strong> = 15‑minute mechanics warmup + 1 ‘decision focus’ (e.g., mid‑round rotates). <strong>Tue/Thu</strong> = 20‑minute VOD review + 1 utility route rehearsal. Weekends: stack games, but keep reviewing 3 clips per day. This keeps momentum without burnout." },
      { type: "h2", text: "Conclusion" },
      { type: "p", html: "Climbing ranks isn’t only about mechanics. Combine strong decision‑making, smart positioning, and purposeful practice with the interactive steps below to spot mistakes quickly and convert them into wins. If you want a tailored plan for your role, map pool, and schedule, book a quick session and we’ll build it together." },
    ],
  }
]

export function getAllPosts(): BlogPost[] {
  return blogPosts
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}


