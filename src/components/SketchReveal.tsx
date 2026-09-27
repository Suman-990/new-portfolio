import { useEffect, useRef } from "react"

function PencilIcon() {
  return (
    <svg
      width="68"
      height="28"
      viewBox="0 0 68 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md"
    >
      <rect x="0" y="8" width="42" height="12" rx="3" fill="#14130f" />
      <rect x="0" y="8" width="12" height="12" rx="3" fill="#c9a13b" />
      <path d="M42 5L64 14L42 23Z" fill="#14130f" />
      <circle cx="64" cy="14" r="2.8" fill="#6b6a64" />
    </svg>
  )
}

interface SketchRevealProps {
  src: string
  alt: string
  durationMs?: number
  rows?: number
  /** Tilt of the scan bands, in degrees. 0 = horizontal rows. */
  angleDeg?: number
  /** Mirror the diagonal across the vertical axis. */
  mirror?: boolean
  /** Extra zoom on the source image, e.g. to crop out a background margin. */
  zoom?: number
  className?: string
}

function SketchReveal({
  src,
  alt,
  durationMs = 4400,
  rows = 13,
  angleDeg = 45,
  mirror = false,
  zoom = 1,
  className = "",
}: SketchRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pencilRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const pencil = pencilRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    let frameId = 0
    let cancelled = false

    const img = new Image()
    img.src = src
    img.onload = () => {
      if (cancelled) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = container.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const wd = Math.round(w * dpr)
      const hd = Math.round(h * dpr)

      canvas.width = wd
      canvas.height = hd
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      // Pre-crop the source image into container space once (object-fit: cover).
      const srcCanvas = document.createElement("canvas")
      srcCanvas.width = wd
      srcCanvas.height = hd
      const srcCtx = srcCanvas.getContext("2d")!
      const scale =
        Math.max(wd / img.naturalWidth, hd / img.naturalHeight) * zoom
      const sw = wd / scale
      const sh = hd / scale
      const sx = (img.naturalWidth - sw) / 2
      const sy = (img.naturalHeight - sh) / 2
      srcCtx.drawImage(img, sx, sy, sw, sh, 0, 0, wd, hd)

      if (reduceMotion) {
        ctx.drawImage(srcCanvas, 0, 0)
        if (pencil) pencil.style.display = "none"
        return
      }

      // Mask accumulates the "ink" the pencil has laid down so far.
      const maskCanvas = document.createElement("canvas")
      maskCanvas.width = wd
      maskCanvas.height = hd
      const maskCtx = maskCanvas.getContext("2d")!
      maskCtx.lineCap = "round"
      maskCtx.lineJoin = "round"
      maskCtx.strokeStyle = "#fff"

      // Scan in a coordinate space oversized to the canvas diagonal, then
      // rotate it onto the canvas — this guarantees full coverage at any
      // tilt angle (a rotated square of side `diag` always contains the
      // whole w x h rect, since diag/2 is exactly the rect's own circumradius).
      const diag = Math.sqrt(w * w + h * h)
      const bandSize = diag / rows
      const strokeWidthCss = bandSize * 2.2 // generous overlap: no seams between bands
      const theta = (angleDeg * Math.PI) / 180
      const cosT = Math.cos(theta)
      const sinT = Math.sin(theta)
      const cx = w / 2
      const cy = h / 2
      const halfDiag = diag / 2

      const project = (u: number, v: number) => {
        const pu = u - halfDiag
        const pv = v - halfDiag
        const x = cx + pu * cosT - pv * sinT
        const y = cy + pu * sinT + pv * cosT
        return { x: mirror ? w - x : x, y }
      }

      const drawSegment = (fromX: number, fromY: number, x: number, y: number) => {
        maskCtx.lineWidth = strokeWidthCss * dpr
        maskCtx.beginPath()
        maskCtx.moveTo(fromX * dpr, fromY * dpr)
        maskCtx.lineTo(x * dpr, y * dpr)
        maskCtx.stroke()

        ctx.clearRect(0, 0, wd, hd)
        ctx.drawImage(srcCanvas, 0, 0)
        ctx.globalCompositeOperation = "destination-in"
        ctx.drawImage(maskCanvas, 0, 0)
        ctx.globalCompositeOperation = "source-over"
      }

      const startPoint = project(0, 0)
      let prevX = startPoint.x
      let prevY = startPoint.y
      let start = 0
      let lastNow = 0
      let simElapsed = 0
      // Cap how far a single frame can advance simulated time so a dropped
      // frame (tab throttling, jank) can never skip an entire scan band.
      const maxFrameMs = Math.min(40, durationMs / (rows * 3))

      const tick = (now: number) => {
        if (cancelled) return
        if (!start) {
          start = now
          lastNow = now
        }
        simElapsed += Math.min(now - lastNow, maxFrameMs)
        lastNow = now
        const t = Math.min(simElapsed / durationMs, 1)

        // Boustrophedon scan in (u, v) space: bands sweep alternately
        // left-right / right-left, while v drifts continuously "downward"
        // for an overall corner-to-corner feel; project() applies the tilt.
        const rawRow = t * rows
        const rowIndex = Math.min(Math.floor(rawRow), rows - 1)
        const rowFrac = rawRow - rowIndex
        const goingRight = rowIndex % 2 === 0
        const u = goingRight ? rowFrac * diag : (1 - rowFrac) * diag
        const wobble = Math.sin(u / 30) * (bandSize * 0.12)
        const v = t * diag + wobble
        const { x, y } = project(u, v)

        drawSegment(prevX, prevY, x, y)

        if (pencil) {
          const angle = (Math.atan2(y - prevY, x - prevX) * 180) / Math.PI
          pencil.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`
        }

        prevX = x
        prevY = y

        if (t < 1) {
          frameId = requestAnimationFrame(tick)
        } else {
          maskCtx.fillStyle = "#fff"
          maskCtx.fillRect(0, 0, wd, hd)
          ctx.clearRect(0, 0, wd, hd)
          ctx.drawImage(srcCanvas, 0, 0)
          if (pencil) pencil.style.opacity = "0"
        }
      }

      frameId = requestAnimationFrame(tick)
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
    }
  }, [src, durationMs, rows, angleDeg, mirror, zoom])

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden rounded-full ${className}`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
      <div
        ref={pencilRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
      >
        <PencilIcon />
      </div>
    </div>
  )
}

export default SketchReveal
