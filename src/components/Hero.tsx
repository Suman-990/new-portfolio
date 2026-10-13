import { useRef, useState } from "react"

import SketchReveal from "./SketchReveal"
import "./NotebookCards.css"

function Hero() {
  // The pencil peeks up over this card's bottom edge, so the card has to clip
  // it (overflow-hidden) and SketchReveal has to know where that edge is.
  const cardRef = useRef<HTMLElement>(null)
  const [activeCard, setActiveCard] = useState<number | null>(null)

  return (
    <section
      id="home"
      ref={cardRef}
      className="relative grid min-h-[calc(100vh-3.5rem)] gap-10 overflow-hidden rounded-3xl bg-card p-8 md:grid-cols-2 md:gap-8 md:p-14 lg:p-16 items-center"
    >
      {/* Left side: Scattered notebook pages */}
      <div className="flex items-center justify-center">
        <div className="notebook-scatter-container">
          {/* Card 1: Core Headline / Vision */}
          <div
            className={`notebook-card-wrapper ${activeCard === 0 ? "is-active" : ""}`}
            onClick={() => setActiveCard(activeCard === 0 ? null : 0)}
          >
            <div className="notebook-card">
              <div className="notebook-card-tag notebook-accent">#01 / VISION</div>
              <div className="notebook-card-content">
                <div className="text-xl font-bold leading-[32px] text-ink sm:text-[22px]">
                  Building software,
                </div>
                <div className="text-lg font-normal leading-[32px] text-muted sm:text-xl">
                  that scales.
                </div>
                <div className="notebook-accent text-xs uppercase tracking-wider opacity-80 leading-[28px]">
                  ~ Suman Mahanty
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Bio & Philosophy */}
          <div
            className={`notebook-card-wrapper ${activeCard === 1 ? "is-active" : ""}`}
            onClick={() => setActiveCard(activeCard === 1 ? null : 1)}
          >
            <div
              className="notebook-card"
              style={{ "--row-size": "26px" } as React.CSSProperties}
            >
              <div className="notebook-card-tag notebook-accent">#02 / ABOUT</div>
              <div className="notebook-card-content">
                <p className="text-[13px] font-medium leading-[26px] text-ink sm:text-[14px]">
                  I&apos;m a full-stack developer crafting reliable web and mobile
                  products &mdash; from backend systems to polished interfaces.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Metrics & Track Record */}
          <div
            className={`notebook-card-wrapper ${activeCard === 2 ? "is-active" : ""}`}
            onClick={() => setActiveCard(activeCard === 2 ? null : 2)}
          >
            <div
              className="notebook-card"
              style={{ "--row-size": "32px" } as React.CSSProperties}
            >
              <div className="notebook-card-tag notebook-accent">#03 / STATS</div>
              <div className="notebook-card-content">
                <div className="flex flex-col text-sm leading-[32px] sm:text-base">
                  <div className="flex items-center gap-2">
                    <span className="notebook-accent text-lg font-bold sm:text-xl">
                      3+
                    </span>
                    <span className="text-ink">Major projects shipped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="notebook-accent text-lg font-bold sm:text-xl">
                      800+
                    </span>
                    <span className="text-ink">DSA problems solved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="notebook-accent text-lg font-bold sm:text-xl">
                      9.1
                    </span>
                    <span className="text-ink">CGPA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Interactive Sketch Portrait framed on a Notebook Page */}
      <div className="flex items-center justify-center py-4">
        <div className="hero-image-container">
          {/* Background Notebook Page */}
          <div className="hero-notebook-page" aria-hidden="true">
            <div className="hero-notebook-page-tag">#SKETCH / 01</div>
          </div>

          {/* Interactive Sketch Portrait */}
          <SketchReveal
            src="/suman.png"
            alt="Sketch portrait of Suman Mahanty"
            zoom={1.1}
            mirror
            peekFrom={cardRef}
            className="aspect-square w-[76%] max-w-[280px] sm:max-w-[340px] lg:max-w-[370px] z-10"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
