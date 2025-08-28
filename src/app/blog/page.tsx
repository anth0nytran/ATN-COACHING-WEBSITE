import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/data/blog"
import { Header } from "@/components/layout/Header"

export const metadata: Metadata = {
  title: "ATN Guides | Valorant Tips & Improvement",
  description:
    "ATN Guides: free Valorant guides for climbing ranks — decision‑making, positioning, routines, and more.",
  openGraph: {
    title: "ATN Guides | Valorant Tips & Improvement",
    description:
      "ATN Guides: free Valorant guides for climbing ranks — decision‑making, positioning, routines, and more.",
    type: "website",
    url: "https://atncoaching.vercel.app/guides",
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()
  return (
    <main className="min-h-screen">
      <Header />
      <section className="section-padding relative">
        <div className="fx-orbs" aria-hidden>
          <div className="orb orb--red" />
          <div className="orb orb--orange" />
          <div className="orb orb--blue" />
        </div>
        <div className="container-max relative z-10">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              ATN Guides
            </h1>
            <p className="text-gray-300 mt-2 max-w-2xl">
              Daily, no‑BS breakdowns on mechanics, decision‑making, and climbing. Read a guide in 5 minutes and apply it in your next match.
            </p>
          </header>

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="relative rounded-2xl border border-white/10 bg-gray-950/60 hover:border-red-500/40 hover:bg-gray-900/60 backdrop-blur-sm transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
              >
                <div
                  className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl bg-gradient-to-b from-red-500 via-orange-400 to-red-500"
                  aria-hidden
                />
                <Link href={`/guide/${post.slug}`} className="block p-6 md:p-7">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400/90 mb-1">
                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                        <span className="mx-2">•</span>
                        <span>{post.readingTimeMinutes} min read</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-semibold text-white truncate">
                        {post.title}
                      </h2>
                      <p className="text-gray-300 max-w-4xl mt-1 line-clamp-1">
                        {post.description}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <span className="valorant-button">Read guide</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}


