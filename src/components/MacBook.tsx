import { useEffect, useRef } from "react"
import "./MacBook.css"

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// Eases the hinge in/out of its open and closed extremes instead of
// tracking scroll position linearly, so the motion settles rather than
// snapping the moment scroll direction reverses.
function smoothstep(t: number) {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

function MacBook() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const screenCloseRef = useRef<HTMLDivElement | null>(null)
  const screenOpenRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Lid openness is driven straight off scroll position (0 = shut, 1 = wide
  // open), peaking while the section sits centered in the viewport and
  // closing again as it scrolls away in either direction — so it opens on
  // approach and closes on exit without needing a pinned/scrubbed layout.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let rafId = 0

    const applyProgress = (progress: number) => {
      const closeEl = screenCloseRef.current
      const openEl = screenOpenRef.current
      const img = imgRef.current
      if (!closeEl || !openEl) return

      const eased = smoothstep(progress)
      const closeRotate = lerp(0, 90, eased)
      const closeScale = lerp(1, 0.9, eased)
      const closeBottom = lerp(0, -5, eased)
      const openRotate = lerp(-90, 0, eased)
      const opacity = lerp(0.2, 1, eased)

      closeEl.style.transform = `rotateX(${closeRotate}deg) scale(${closeScale})`
      closeEl.style.bottom = `${closeBottom}px`
      openEl.style.transform = `translateZ(-580px) rotateX(${openRotate}deg)`
      if (img) img.style.opacity = `${opacity}`
    }

    const measure = () => {
      rafId = 0
      const rect = section.getBoundingClientRect()
      const viewportH = window.innerHeight
      const sectionCenter = rect.top + rect.height / 2
      const maxDelta = viewportH / 2 + rect.height / 2
      const delta = Math.abs(sectionCenter - viewportH / 2)
      const progress = maxDelta > 0 ? 1 - clamp(delta / maxDelta, 0, 1) : 1
      applyProgress(progress)
    }

    const requestMeasure = () => {
      if (rafId) return
      rafId = requestAnimationFrame(measure)
    }

    // Only pay for scroll/resize listeners while the section is anywhere
    // near the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", requestMeasure, { passive: true })
          window.addEventListener("resize", requestMeasure)
          requestMeasure()
        } else {
          window.removeEventListener("scroll", requestMeasure)
          window.removeEventListener("resize", requestMeasure)
        }
      },
      { rootMargin: "25% 0px 25% 0px" },
    )
    observer.observe(section)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", requestMeasure)
      window.removeEventListener("resize", requestMeasure)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-screen overflow-hidden bg-onyx py-24 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-14">
        <div className="macbook">
          <div className="screen">
            <div ref={screenCloseRef} className="screen-close"></div>
            <div ref={screenOpenRef} className="screen-open">
              <img ref={imgRef} src="/suman.png" alt="Suman Mahanty" />
            </div>
          </div>
          <div className="body"></div>
        </div>
      </div>
    </section>
  )
}

export default MacBook
