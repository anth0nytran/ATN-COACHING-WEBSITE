import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug } from "@/data/blog"
import Script from "next/script"
import Image from "next/image"
import { Header } from "@/components/layout/Header"
import InteractiveGuide from "@/components/sections/InteractiveGuide"
import React from "react"

type Params = { slug: string }

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  const url = `https://atncoaching.vercel.app/guide/${post.slug}`
  return {
    title: `${post.title} | Antho Coaching`,
    description: post.description,
    openGraph: {
      title: `${post.title} | Antho Coaching`,
      description: post.description,
      type: "article",
      url,
    },
    alternates: { canonical: url },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return notFound()
  function slugifyHeading(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
  }
  const headingIds = post.body
    .filter((n) => n.type === "h2" && n.text)
    .map((n) => ({ text: n.text as string, id: slugifyHeading(n.text as string) }))

  // Build lead and sections to enable varied layouts
  type Section = { id: string; title: string; paragraphs: string[] }
  const leadParas: string[] = []
  const sections: Section[] = []
  let current: Section | null = null
  let seenFirstH2 = false
  post.body.forEach((node) => {
    if (node.type === "h2" && node.text) {
      seenFirstH2 = true
      if (current) sections.push(current)
      current = { id: slugifyHeading(node.text), title: node.text, paragraphs: [] }
      return
    }
    const html = node.html || ""
    if (!seenFirstH2) {
      leadParas.push(html)
    } else if (current) {
      current.paragraphs.push(html)
    }
  })
  if (current) sections.push(current)
  return (
    <main className="min-h-screen">
      <Header />
      <Script id="post-ld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          author: { "@type": "Person", name: post.author },
          datePublished: post.date,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://atncoaching.vercel.app/guide/${post.slug}`,
          },
        })}
      </Script>
      <article className="section-padding relative">
        <div className="fx-orbs" aria-hidden>
          <div className="orb orb--red" />
          <div className="orb orb--orange" />
          <div className="orb orb--blue" />
        </div>
        <div className="container-max relative z-10">
          <header className="mb-8">
            <div className="text-sm text-gray-400 mb-2">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              <span className="mx-2">•</span>
              <span>{post.readingTimeMinutes} min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{post.title}</h1>
            <p className="text-gray-300 mt-3 max-w-2xl">{post.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="badge-soft text-xs">{t}</span>
              ))}
            </div>
          </header>

          {/* On this page */}
          {headingIds.length > 0 && (
            <nav className="mb-8 text-sm guide-section">
              <div className="text-gray-400 uppercase tracking-wide mb-2">On this page</div>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {headingIds.map((h) => (
                  <li key={h.id} className="truncate"><a className="text-gray-300 hover:text-white underline/30 hover:underline" href={`#${h.id}`}>{h.text}</a></li>
                ))}
              </ul>
            </nav>
          )}

          {/* Lead interactive self‑check */}
          {post.slug === "spot-your-own-mistakes-interactive" && (
            <div className="mb-10">
              <InteractiveGuide section="selfcheck" />
            </div>
          )}

          <div className="prose prose-invert prose-red max-w-none article-prose">
            {/* Lead paragraphs styled like a hero lead */}
            <div className="guide-lead mb-8 mx-auto">
              {leadParas.slice(0, 2).map((html, i) => (
                <p key={`lead-${i}`} dangerouslySetInnerHTML={{ __html: html }} />
              ))}
            </div>

            {/* Removed extra top infographic placeholder to avoid double images */}
            {/* Structured sections with varied layouts */}
            <div className="space-y-12">
              {sections.map((sec, idx) => {
                const variant = idx % 4
                const imageFirst = idx === 0 || variant === 2
                const imageStyle: React.CSSProperties =
                  idx === 1 ? { paddingTop: "133.33%" } : variant === 3 ? { paddingTop: "42.85%" } : { paddingTop: "56.25%" }
                return (
                  <section key={sec.id} className="space-y-4">
                    {imageFirst && (
                      idx === 0 ? (
                        <div className="img-ph overflow-hidden" style={imageStyle}>
                          <Image
                            src="/blog_photos/first%20blog%20photo.jpg"
                            alt="First blog image"
                            fill
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="object-cover"
                            priority
                          />
                        </div>
                      ) : idx === 2 ? (
                        <div className="img-ph overflow-hidden" style={imageStyle}>
                          <Image
                            src="/blog_photos/angle%20holding.png"
                            alt="Angle holding example"
                            fill
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="object-contain"
                            priority
                          />
                        </div>
                      ) : (
                        <div className="img-ph" style={imageStyle}><div className="img-ph-inner">Image / diagram</div></div>
                      )
                    )}
                    <div className="guide-kicker">Section</div>
                    <h2 id={sec.id} className="guide-h2 scroll-mt-28">{sec.title}</h2>
                    {variant === 1 || variant === 2 ? (
                      idx === 5 ? (
                        <div>
                          {sec.paragraphs.map((html, i) => (
                            <p key={`${sec.id}-p-${i}`} dangerouslySetInnerHTML={{ __html: html }} />
                          ))}
                        </div>
                      ) : (
                        <div className={`grid items-start gap-6 md:gap-8 ${variant === 1 ? 'md:grid-cols-[320px_1fr]' : 'md:grid-cols-[1fr_320px]'}`}>
                          {variant === 1 ? (
                            idx === 1 ? (
                              <div className="img-ph overflow-hidden" style={imageStyle}>
                                <Image
                                  src="/blog_photos/positioning1.png"
                                  alt="Positioning annotated screenshot"
                                  fill
                                  sizes="(max-width: 768px) 100vw, 320px"
                                  className="object-contain"
                                  priority
                                />
                              </div>
                            ) : (
                              <div className="img-ph" style={imageStyle}><div className="img-ph-inner">Annotated screenshot</div></div>
                            )
                          ) : null}
                          <div className="relative z-10">
                            {sec.paragraphs.map((html, i) => (
                              <p key={`${sec.id}-p-${i}`} dangerouslySetInnerHTML={{ __html: html }} />
                            ))}
                            {/* Inline patterns checklist for this section to align with text */}
                            {idx === 1 && post.slug === "spot-your-own-mistakes-interactive" && (
                              <div className="mt-3">
                                <InteractiveGuide section="patterns" variant="inline" />
                              </div>
                            )}
                          </div>
                          {variant === 2 ? (
                            idx === 2 ? (
                              <div className="img-ph overflow-hidden" style={imageStyle}>
                                <Image
                                  src="/blog_photos/rank%20distr.jpg"
                                  alt="Valorant rank distribution"
                                  fill
                                  sizes="(max-width: 768px) 100vw, 320px"
                                  className="object-contain"
                                  priority
                                />
                              </div>
                            ) : (
                              <div className="img-ph" style={imageStyle}><div className="img-ph-inner">Strategic angle</div></div>
                            )
                          ) : null}
                        </div>
                      )
                    ) : (
                      <div>
                        {sec.paragraphs.map((html, i) => (
                          <p key={`${sec.id}-p-${i}`} dangerouslySetInnerHTML={{ __html: html }} />
                        ))}
                      </div>
                    )}
                    {!imageFirst && variant === 3 && (
                      idx === 3 ? (
                        <div className="img-ph overflow-hidden" style={imageStyle}>
                          <Image
                            src="/blog_photos/valorant%20heatmaps.jpg"
                            alt="Valorant map heatmaps"
                            fill
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="object-contain"
                            priority
                          />
                        </div>
                      ) : (
                        <div className="img-ph" style={imageStyle}><div className="img-ph-inner">Map heatmap</div></div>
                      )
                    )}
                    {post.slug === "spot-your-own-mistakes-interactive" && (
                      <div className="mt-2">
                        {idx === 0 && <InteractiveGuide section="watch" variant="inline" />}
                        {idx === 2 && <InteractiveGuide section="metrics" variant="inline" />}
                        {idx === 3 && <InteractiveGuide section="drills" variant="inline" />}
                        {idx === 4 && <InteractiveGuide section="reflection" variant="inline" />}
                      </div>
                    )}
                  </section>
                )
              })}
            </div>
          </div>

          {post.slug === "spot-your-own-mistakes-interactive" && (
            <div className="mt-10 card-surface p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Want a tailored plan?</h2>
                <p className="text-gray-300">Get a pro review and a step‑by‑step plan to climb faster.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/#services" className="valorant-button">Book a session</Link>
                <Link href="/guides" className="valorant-button-outline">Back to all guides</Link>
              </div>
            </div>
          )}
        </div>
      </article>
    </main>
  )
}


