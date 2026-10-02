import { useEffect, useLayoutEffect, useRef, useState } from "react"

// @ts-ignore
import DriftWall from "./DriftWall"
import Lanyard from "./Lanyard"
import PixelSwap from "./PixelSwap"

// Same stack as TechStrip. Files don't exist yet — drop matching logos into
// public/logos/ (one file per src below) and these will just start showing up.
const TECH_LOGOS = [
  { image: "/aws_transparent.png", title: "AWS" },
  { image: "/docker_transparent.png", title: "Docker" },
  { image: "/firebase_transparent.png", title: "Firebase" },
  { image: "/github_transparent.png", title: "GitHub" },
  { image: "/git_transparent.png", title: "Git" },
  { image: "/golang_transparent.png", title: "Golang" },
  { image: "/java_transparent.png", title: "Java" },
  { image: "/javascript_transparent.png", title: "JavaScript" },
  { image: "/kafka_transparent.png", title: "Kafka" },
  { image: "/mongoDB_transparent.png", title: "MongoDB" },
  { image: "/nodeJS_transparent.png", title: "Node.js" },
  { image: "/pgSQL_transparent.png", title: "PostgreSQL" },
  { image: "/prisma_transparent.png", title: "Prisma" },
  { image: "/react_transparent.png", title: "React" },
  { image: "/springboot_transparent.png", title: "Spring Boot" },
]

// Deterministic shuffle (seeded) so the wall looks random but stays stable
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TECH_ITEMS: typeof TECH_LOGOS = []
// DriftWall has 5 columns and distributes items round-robin (i % 5).
// To ensure every column gets exactly one of each logo (no duplicates in a row,
// no missing logos), we generate 5 individually shuffled sets of the 15 logos
// and interleave them.
for (let i = 0; i < 15; i++) {
  const seeds = [42, 100, 200, 300, 400]
  for (let c = 0; c < 5; c++) {
    const shuffledForColumn = seededShuffle(TECH_LOGOS, seeds[c])
    TECH_ITEMS.push(shuffledForColumn[i])
  }
}

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

// PixelSwap's own default `duration` — kept unmodified, we don't pass a
// custom one below. Used only to start the hero row's entrance a bit ahead
// of the dissolve's actual finish, rather than waiting for it exactly.
const BACKGROUND_DISSOLVE_MS = 1400
const HERO_EARLY_BY_MS = 450
// The hero row (punchline + spiral) fades/rises over this long once
// `heroVisible` flips — the card's own drop waits for that to actually
// finish, not just start, before it begins.
const HERO_ENTRANCE_MS = 700
// How long after the hero row's entrance finishes the card waits before it
// starts dropping in.
const CARD_DROP_DELAY_MS = 300

function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  // Once revealed, stays revealed — this is a one-way theme change, not
  // something that should undo itself if the user scrolls back up.
  const [revealed, setRevealed] = useState(false)
  // Drives the hero row (punchline + spiral). Fires on a timer a bit before
  // the dissolve is actually done — see HERO_EARLY_BY_MS — so the content
  // arrives while the background is still finishing its last stretch,
  // instead of the row visibly sitting and waiting for a "done" signal.
  const [heroVisible, setHeroVisible] = useState(false)
  // Drives the card grid below. Unlike the hero row, this one *does* wait
  // for PixelSwap's own onComplete — true completion, not the early timer —
  // since by the time a reader scrolls this far there's no reason for it to
  // rush; it should just wait until the theme has actually finished settling.
  const [backgroundDone, setBackgroundDone] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || revealed) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true)
      },
      // Fires once the section's top has crossed well into the viewport,
      // rather than waiting for the whole (now full-height) section to show.
      { threshold: 0, rootMargin: "0px 0px -35% 0px" },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [revealed])

  useEffect(() => {
    if (!revealed || heroVisible) return
    // Always via setTimeout — even a 0ms one for reduced motion — rather
    // than calling setState directly in the effect body, which triggers a
    // synchronous cascading render.
    const delay = reduceMotion ? 0 : Math.max(0, BACKGROUND_DISSOLVE_MS - HERO_EARLY_BY_MS)
    const timer = window.setTimeout(() => setHeroVisible(true), delay)
    return () => window.clearTimeout(timer)
  }, [revealed, heroVisible, reduceMotion])

  // The lanyard card drops in on its own, after the hero row it sits above
  // has actually finished its own fade/rise — not at the same time as it —
  // so it reads as a separate, deliberate entrance rather than one more
  // piece of the same reveal.
  const [cardVisible, setCardVisible] = useState(false)

  useEffect(() => {
    if (!heroVisible || cardVisible) return
    const delay = reduceMotion ? 0 : HERO_ENTRANCE_MS + CARD_DROP_DELAY_MS
    const timer = window.setTimeout(() => setCardVisible(true), delay)
    return () => window.clearTimeout(timer)
  }, [heroVisible, cardVisible, reduceMotion])

  // Unlike `revealed` above (which fires once and stays true), this tracks
  // whether the section is *currently* in the viewport, continuously — it
  // gates the card's scroll-reactive sway, which should only respond to
  // scrolling while the card itself is actually on screen.
  const [sectionInView, setSectionInView] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => setSectionInView(entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // The card grid gets its own on-view entrance (terminal-dark §11: fade +
  // 12px rise, 400ms, once) — separate from the hero row, since it sits
  // below a full-viewport block and is scrolled to well after that entrance
  // has already finished. Gated on `backgroundDone` too (see above), so a
  // reader who scrolls fast never sees it appear before the background has.
  const cardsRef = useRef<HTMLDivElement>(null)
  const [cardsInView, setCardsInView] = useState(false)
  const cardsVisible = cardsInView && backgroundDone

  useEffect(() => {
    const el = cardsRef.current
    if (!el || cardsInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCardsInView(true)
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [cardsInView])

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
      className="relative mt-10 min-h-[100dvh] w-screen overflow-hidden ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]"
    >
      {/* Background: a pure color-to-color dissolve, nothing else. PixelSwap
          clones its whole layer once per grid tile (~200 times) to build the
          transition. That's cheap for two flat divs, but it was previously
          cloning the *entire* Skills content — text plus a live, independently
          -animating spiral — 200 times over, which is both what caused the
          lag and why the transition looked broken (a mosaic of frozen spiral
          snapshots instead of a clean color wipe). Keeping this layer to flat
          color means the content below is never touched by that mechanism,
          however complex it gets. */}
      <div className="absolute inset-0">
        <PixelSwap
          active={revealed}
          trigger="none"
          firstContent={<div className="h-full w-full bg-paper" />}
          secondContent={<div className="h-full w-full bg-onyx" />}
          onComplete={(to) => {
            if (to) setBackgroundDone(true)
          }}
          aspectRatio="auto"
          className="h-full"
        />
      </div>

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
              <p className="font-cursive text-4xl leading-snug text-paper sm:text-5xl md:text-6xl">
                With great product, comes great complexities
              </p>
              <p className="mt-5 text-sm text-dim sm:text-base">
                and I tackle them using these technologies.
              </p>
            </div>

            <div
              className={`h-[380px] transition-all delay-150 duration-700 ease-out sm:h-[440px] md:h-[520px] ${
                heroVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <DriftWall
                items={TECH_ITEMS as any}
                columns={5}
                tileWidth={160}
                tileHeight={100}
                gap={18}
                tilt={16}
                turn={-14}
                perspective={1200}
                depth={120}
                speed={42}
                direction="up"
                variance={0.7}
                parallax={0.6}
                lift={64}
                fade={0.6}
                dim={0.9}
                overlayColor="transparent"
                radius={14}
                roll={0}
                pauseOnHover={false}
                grayscale={false}
              />
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
          className={`px-6 pb-24 pt-16 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:px-14 md:pb-32 md:pt-20 ${
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

            <div className="mt-10 grid grid-cols-1 gap-px bg-border-subtle sm:grid-cols-2 lg:grid-cols-3">
              {SKILL_CATEGORIES.map((category) => (
                <SkillCard key={category.varName} category={category} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
