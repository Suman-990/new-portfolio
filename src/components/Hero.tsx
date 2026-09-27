import { useRef } from "react"

import SketchReveal from "./SketchReveal"

const STATS = [
  { value: "3+", label: "Major projects shipped" },
  { value: "800+", label: "DSA problems solved" },
  { value: "9.1", label: "CGPA" },
]

function Hero() {
  // The pencil peeks up over this card's bottom edge, so the card has to clip
  // it (overflow-hidden) and SketchReveal has to know where that edge is.
  const cardRef = useRef<HTMLElement>(null)

  return (
    <section
      id="home"
      ref={cardRef}
      className="relative grid gap-10 overflow-hidden rounded-3xl bg-card p-8 md:grid-cols-2 md:gap-8 md:p-14"
    >
      <div className="flex flex-col justify-center">
        <h1 className="font-serif text-5xl leading-[1.1] tracking-tight text-ink md:text-6xl">
          Building software,{" "}
          <span className="text-muted">that scales.</span>
        </h1>

        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
          I&apos;m a full-stack developer crafting reliable web and mobile
          products &mdash; from backend systems to polished interfaces.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-85"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-line bg-transparent px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            Get in touch
          </a>
        </div>

        <dl className="mt-12 flex flex-wrap gap-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="font-serif text-3xl text-ink">{stat.value}</dt>
              <dd className="mt-1 text-sm text-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex items-center justify-center">
        <SketchReveal
          src="/suman.png"
          alt="Sketch portrait of Suman Mahanty"
          zoom={1.1}
          mirror
          peekFrom={cardRef}
          className="aspect-square w-full max-w-sm sm:max-w-md"
        />
      </div>
    </section>
  )
}

export default Hero
