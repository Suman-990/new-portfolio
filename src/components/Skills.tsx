import { useEffect, useLayoutEffect, useRef, useState } from "react"

import TechTree from "./TechTree"
import Lanyard from "./Lanyard"
import VSCodeWindow from "./VSCodeWindow"
import FlyText from "./FlyText"



// Straight from the Skills section of the resume — "Developer Tools" split
// into local tooling vs. cloud/infra (its own natural grouping, and it also
// means 6 categories instead of 5, which tiles a 3-column grid evenly).
interface SkillCategory {
  varName: string
  label: string
  items: string[]
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    varName: "languages",
    label: "programming languages",
    items: ["C", "Java", "JavaScript", "TypeScript", "Golang", "HTML5", "CSS3"],
  },
  {
    varName: "frameworks",
    label: "libraries & frameworks",
    items: ["Spring Boot", "Node.js", "Express.js", "React", "React Native", "Tailwind CSS"],
  },
  {
    varName: "tools",
    label: "developer tools",
    items: ["Linux", "Git", "Docker"],
  },
  {
    varName: "cloud",
    label: "cloud & infra",
    items: ["RabbitMQ", "Apache Kafka", "AWS S3", "AWS EC2", "AWS RDS"],
  },
  {
    varName: "databases",
    label: "databases",
    items: ["MongoDB", "PostgreSQL", "Redis"],
  },
  {
    varName: "focus",
    label: "core focus",
    items: ["Data Structures & Algorithms", "Full-Stack Development", "Android Development"],
  },
]

// Each category rendered as what it actually is — a real array — rather than
// a label plus a row of pills. Tokens are hand-assigned rather than run
// through a highlighter (terminal-dark §16 wants build-time highlighting for
// real code blocks, but this is six fixed, known-at-build-time arrays, so
// there's nothing for a highlighter to earn over just coloring the tokens
// directly).
function SkillCard({ category }: { category: SkillCategory }) {
  return (
    <div className="bg-bg-surface p-6">
      <pre className="overflow-x-auto font-mono text-[13px] leading-[1.6]">
        <code>
          <span className="text-syntax-comment">{`// ${category.label}`}</span>
          {"\n"}
          <span className="text-syntax-kw">const</span>{" "}
          <span className="text-syntax-fn">{category.varName}</span>{" "}
          <span className="text-text-secondary">=</span>{" "}
          <span className="text-text-tertiary">[</span>
          {category.items.map((item) => (
            <span key={item}>
              {"\n  "}
              <span className="text-syntax-str">{`"${item}"`}</span>
              <span className="text-text-tertiary">,</span>
            </span>
          ))}
          {"\n"}
          <span className="text-text-tertiary">];</span>
        </code>
      </pre>
    </div>
  )
}

function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  const [heroVisible, setHeroVisible] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)
  const [sectionInView, setSectionInView] = useState(false)

  // Section entrance: triggers hero text and TechTree smoothly when entering view
  useEffect(() => {
    const section = sectionRef.current
    if (!section || heroVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeroVisible(true)
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [heroVisible])

  // Lanyard card drops in cleanly after hero text entrance starts
  useEffect(() => {
    if (!heroVisible || cardVisible) return
    const delay = reduceMotion ? 0 : 300
    const timer = window.setTimeout(() => setCardVisible(true), delay)
    return () => window.clearTimeout(timer)
  }, [heroVisible, cardVisible, reduceMotion])

  // Track if section is in view for interactive lanyard physics sway
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => setSectionInView(entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // The card grid gets its entrance when scrolled to
  const cardsRef = useRef<HTMLDivElement>(null)
  const [cardsVisible, setCardsVisible] = useState(false)

  useEffect(() => {
    const el = cardsRef.current
    if (!el || cardsVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCardsVisible(true)
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [cardsVisible])

  // The lanyard's drag-room box (below) needs to be wide enough that
  // dragging the card doesn't clip at its edge before reaching the
  // viewport's own edge. Its natural home is column 1 of a 2-column grid —
  // left-of-center, not viewport-centered — so a box merely as wide as the
  // viewport, centered on that off-center point, would still come up short
  // on whichever side is farther away. Measuring the column's actual
  // position and solving for the width/left that make a box *centered on
  // it* just reach both viewport edges avoids guessing at a fixed
  // (and necessarily oversized, to cover the worst case blindly) value —
  // this is exactly as wide as this viewport actually needs, no more.
  const lanyardColRef = useRef<HTMLDivElement>(null)
  const [lanyardBox, setLanyardBox] = useState<{ left: number; width: number } | null>(null)

  useLayoutEffect(() => {
    const col = lanyardColRef.current
    if (!col) return

    const measure = () => {
      const rect = col.getBoundingClientRect()
      const centerFromLeft = rect.width / 2
      const centerInViewport = rect.left + centerFromLeft
      const half = Math.max(centerInViewport, window.innerWidth - centerInViewport)
      setLanyardBox({ left: centerFromLeft - half, width: half * 2 })
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  return (
    // Full-bleed: breaks out of the site's centered max-w-7xl/px-6 wrapper so
    // the dark reveal fills the entire browser width, not just the content
    // column. `w-screen` + negative margins (rather than a translate) avoids
    // fighting the scrollbar's width.
    <section
      id="skills"
      ref={sectionRef}
      aria-label="Skills"
      className="relative w-full min-h-[100dvh] overflow-hidden"
    >

      {/* The lanyard card: an overlay (z-20, above the content's z-10)
          aligned to the text column's own width/position — same outer
          max-w-7xl/px-6/md:px-14 container and md:grid-cols-2 split as the
          content row below, so column 1 here lines up exactly with the text
          column there, with nothing placed in column 2.

          The inner box is much taller than the card's resting frame (the
          320px frame its camera distance is tuned for in Lanyard.tsx) and
          shifted up by half the difference, so it grows symmetrically around
          the same center instead of pushing the resting card down. Camera
          distance is scaled to match (in Lanyard.tsx), which keeps a
          constant *offset from that center* regardless of box size — so
          growing the box symmetrically, rather than only downward, is what
          actually keeps the resting card pinned in place; growing it
          downward only shifts the center (and the card with it) as the box
          grows. Half the extra height ends up above the section, clipped by
          its own overflow-hidden and effectively wasted, so the box is sized
          well past what's needed just to clear the content below — the
          height here (300dvh) is chosen so the other half is still enough
          drag room to comfortably reach the card grid section further down.

          Width gets the same symmetric-growth treatment for the same
          clipping reason, but doesn't need a matching camera change: a
          perspective camera's horizontal extent is *derived* from its
          vertical fov and the box's aspect ratio, so widening the box alone
          doesn't change apparent size or position — only how much
          horizontal room there is. It's centered on the same point the
          narrow box already occupied — its parent column's own center, NOT
          the viewport's center, since column 1 of a 2-column grid sits
          left-of-center — using `left`/`width` computed from the column's
          actual measured position (the `lanyardBox` effect above), rather
          than a fixed guess: a box merely as wide as the viewport, centered
          on an off-center point, would still come up short on whichever
          side is farther away, and a fixed value big enough to always cover
          that worst case would be excessive (and was — it made the card
          visibly slower to settle after a release, from the sheer pixel
          area a transparent-but-still-rendered canvas that size costs to
          draw every frame) for how much any *particular* viewport actually
          needs. `lanyardColRef` sits at the original (unmodified) column
          position purely so its rect can be measured; the actual box is
          absolutely positioned inside it once that measurement lands. */}
      {/* No translate here — the "drop" motion itself now comes from real
          physics (Lanyard's `dropTrigger`), not a CSS transform, so this
          only needs a quick fade to cover the single frame where the chain
          is still in its unsettled starting pose right as it appears. */}
      <div
        className={`hidden md:block pointer-events-none absolute inset-x-0 top-0 z-20 transition-opacity duration-150 ${
          cardVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mx-auto grid w-full max-w-7xl px-6 md:grid-cols-2 md:px-14">
          <div ref={lanyardColRef} className="relative">
            <div
              className="relative"
              style={{
                top: "calc((320px - 300dvh) / 2)",
                height: "300dvh",
                ...(lanyardBox
                  ? { position: "absolute" as const, left: lanyardBox.left, width: lanyardBox.width }
                  : {}),
              }}
            >
              <Lanyard
                position={[0, 0, 20]}
                gravity={[0, -40, 0]}
                cardScale={1.65}
                lanyardWidth={0.8}
                frontImage="/il_fullxfull.6691917804_k8k3.avif"
                backImage="/gradient-background-in-black-and-red-colors-with-icon-of-spider-vector.jpg"
                lanyardImage="/bfe6bbe3b6cc5dccfe8cd91d2b6b0353.jpg"
                dropTrigger={cardVisible}
                scrollReactive={sectionInView}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Foreground: the real content, always live, sitting on top of the
          background rather than inside it. In normal flow now (not
          absolute/inset-0) — it needs to grow taller than one viewport to
          fit the card grid below, and the background div above, being
          absolute/inset-0 against this now-relatively-positioned section,
          stretches to match whatever height that ends up being. */}
      <div className="relative z-10">
        {/* Block 1: gated on `heroVisible`, which fires ~450ms before the
            background dissolve actually completes (see HERO_EARLY_BY_MS) —
            deliberately early, so the content arrives while the background
            is still settling rather than after a visible pause. */}
        <div className="flex min-h-[100dvh] w-full items-center px-6 md:px-14">
          <div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-2 md:items-center md:gap-8">
            <div
              className={`flex flex-col justify-center transition-all duration-700 ease-out ${
                heroVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <FlyText
                as="p"
                className="font-cursive text-4xl leading-snug text-paper sm:text-5xl md:text-6xl"
                windAngle={20}
                windStrength={480}
                scatter={90}
                maxRotation={420}
                stagger={0.6}
                depth={140}
                mode="both"
              >
                With great product, comes great complexities
              </FlyText>
              <FlyText
                as="p"
                className="mt-5 text-sm text-dim sm:text-base"
                windAngle={25}
                windStrength={350}
                scatter={60}
                maxRotation={300}
                stagger={0.5}
                depth={100}
                mode="both"
              >
                and I tackle them using these technologies.
              </FlyText>
            </div>

            <div
              className={`relative z-30 h-[400px] w-full transition-all delay-150 duration-700 ease-out sm:h-[460px] md:h-[520px] flex items-center justify-center ${
                heroVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <TechTree isVisible={heroVisible} />
            </div>
          </div>
        </div>

      </div>

      {/* Block 2: the skill-category cards — a separate shape (asymmetric
            header + hairline grid) from block 1's two-column split, per
            terminal-dark §2.1 ("no two consecutive sections share a
            layout"). Its own on-view entrance, and — unlike block 1 — one
            that genuinely waits for `backgroundDone` (see the state
            declarations above), since there's no reason for it to rush. */}
        <div
          ref={cardsRef}
          className={`px-6 pb-24 pt-16 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:px-14 md:pb-32 md:pt-20 relative z-30 ${
            cardsVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-6">
                <h2 className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
                  The stack, categorized.
                </h2>
              </div>
              <div className="md:col-span-4 md:col-start-8">
                <p className="text-sm leading-relaxed text-text-secondary md:text-base">
                  Languages, frameworks, tools, and the databases behind the
                  projects above — pulled straight from the resume.
                </p>
                <p className="mt-3 font-mono text-[13px] text-text-tertiary">1.0 Stack →</p>
              </div>
            </div>

            <div className="mt-12 hidden md:block">
              <VSCodeWindow />
            </div>
            {/* Mobile fallback for smaller screens */}
            <div className="mt-10 grid grid-cols-1 gap-px bg-border-subtle sm:grid-cols-2 lg:grid-cols-3 md:hidden">
              {SKILL_CATEGORIES.map((category) => (
                <SkillCard key={category.varName} category={category} />
              ))}
            </div>
          </div>
        </div>
    </section>
  )
}

export default Skills
