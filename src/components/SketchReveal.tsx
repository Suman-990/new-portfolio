import { useEffect, useRef } from "react"

function PencilIcon() {
  return (
    <svg
      width="34"
      height="14"
      viewBox="0 0 34 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md"
    >
      <rect x="0" y="4" width="21" height="6" rx="1.5" fill="#14130f" />
      <rect x="0" y="4" width="6" height="6" rx="1.5" fill="#c9a13b" />
      <path d="M21 2.5L32 7L21 11.5Z" fill="#14130f" />
      <circle cx="32.5" cy="7" r="1.4" fill="#6b6a64" />
    </svg>
  )
}

interface SketchRevealProps {
  src: string
  alt: string
  durationMs?: number
  rows?: number
  /** Extra zoom on the source image, e.g. to crop out a background margin. */
  zoom?: number
  className?: string
}

function SketchReveal({
  src,
  alt,
  durationMs = 4400,
  rows = 10,
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

      const rowHeight = h / rows
      const strokeWidthCss = rowHeight * 1.55

      let prevX = 0
      let prevY = 0
      let start = 0

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

      const tick = (now: number) => {
        if (cancelled) return
        if (!start) start = now
        const t = Math.min((now - start) / durationMs, 1)

        // Boustrophedon scan: rows sweep alternately left-right / right-left,
        // while y drifts continuously downward for an overall top-left -> bottom-right feel.
        const rawRow = t * rows
        const rowIndex = Math.min(Math.floor(rawRow), rows - 1)
        const rowFrac = rawRow - rowIndex
        const goingRight = rowIndex % 2 === 0
        const x = goingRight ? rowFrac * w : (1 - rowFrac) * w
        const wobble = Math.sin(x / 24) * (rowHeight * 0.16)
        const y = t * h + wobble

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
  }, [src, durationMs, rows, zoom])

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
