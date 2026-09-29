import { useEffect, useRef, useState } from "react"

import InfiniteSpiral from "./InfiniteSpiral"
import PixelSwap from "./PixelSwap"

// Same stack as TechStrip. Files don't exist yet — drop matching logos into
// public/logos/ (one file per src below) and these will just start showing up.
const TECH_ITEMS = [
  { src: "/logos/react.svg", alt: "React" },
  { src: "/logos/typescript.svg", alt: "TypeScript" },
  { src: "/logos/nodejs.svg", alt: "Node.js" },
  { src: "/logos/spring-boot.svg", alt: "Spring Boot" },
  { src: "/logos/docker.svg", alt: "Docker" },
  { src: "/logos/postgresql.svg", alt: "PostgreSQL" },
  { src: "/logos/aws.svg", alt: "AWS" },
]

function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  // Once revealed, stays revealed — this is a one-way theme change, not
  // something that should undo itself if the user scrolls back up.
  const [revealed, setRevealed] = useState(false)
  // Flips once PixelSwap's own onComplete fires — i.e. once the background
  // dissolve has actually finished, not just started — so the content's
  // entrance never overlaps the background animation.
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

      {/* Foreground: the real content, always live, sitting on top of the
          background rather than inside it. Waits for `backgroundDone` (the
          background's own onComplete, not just `revealed`) so the entrance
          only starts once the dissolve has actually finished — no overlap. */}
      <div className="absolute inset-0 z-10 flex w-full items-center px-6 md:px-14">
        <div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-2 md:items-center md:gap-8">
          <div
            className={`flex flex-col justify-center transition-all duration-700 ease-out ${
              backgroundDone ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <p className="font-cursive text-4xl leading-snug text-paper sm:text-5xl md:text-6xl">
              With great product, comes great complexities
            </p>
            <p className="mt-5 text-sm text-dim sm:text-base">
              and I use these technologies to tackle them
            </p>
          </div>

          <div
            className={`h-[380px] transition-all delay-150 duration-700 ease-out sm:h-[440px] md:h-[520px] ${
              backgroundDone ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <InfiniteSpiral items={TECH_ITEMS} className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
