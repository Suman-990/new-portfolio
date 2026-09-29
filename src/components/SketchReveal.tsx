import { useEffect, useRef, useState, type RefObject } from "react"

// Native size of the icon, used to compute the tip pivot and the
// container-relative scale applied in the animation loop below. Laid out
// left-to-right (eraser → ferrule → body → wood cone → graphite point) so
// rotate(0deg) already points along +X, matching the animation's convention.
const ERASER_W = 22
const FERRULE_W = 14
const BODY_W = 60
const WOOD_W = 28
const GRAPHITE_W = 8
const PENCIL_HEIGHT = 52
const PENCIL_WIDTH = ERASER_W + FERRULE_W + BODY_W + WOOD_W + GRAPHITE_W
// Where the graphite tip sits within the icon's own box — this is the point
// that gets pinned to the drawing position and used as the rotation pivot.
const PENCIL_TIP = { x: PENCIL_WIDTH - GRAPHITE_W / 2, y: PENCIL_HEIGHT / 2 }
// How the pencil is "held": tilted off perpendicular to the frontier so it
// doesn't look like a ruler, with a few degrees of sway as it flicks.
const PENCIL_TILT_DEG = 32
const PENCIL_SWAY_DEG = 7
// While waiting to be clicked the pencil pokes up over the peek element's
// bottom edge: tip up (the icon points +X, so -90° aims it skyward), with
// this much of its length showing above the edge.
const REST_ANGLE_DEG = -90
const PEEK_VISIBLE_FRACTION = 0.58
// The little entrance as it rises into view, then a slow idle bob.
const PEEK_RISE_MS = 700
const PEEK_BOB_PX = 6
const PEEK_BOB_MS = 1900
// How long the pencil takes to float up from rest into the drawing pose,
// and to make the return trip once the sketch has landed.
const FLOAT_IN_MS = 900
const FLOAT_OUT_MS = 900
const DUCK_OUT_MS = 420

// A cute, characterful pencil (eraser, ferrule, faceted body with a face,
// wood cone, graphite point) — reworked from a vertical reference design
// into this horizontal layout so it drops into the same tip-pinned,
// JS-driven rotation/translation the reveal animation already does.
function PencilIcon() {
  return (
    <div
      style={{
        width: PENCIL_WIDTH,
        height: PENCIL_HEIGHT,
        display: "flex",
        alignItems: "center",
        filter:
          "drop-shadow(0 2px 4px rgba(0,0,0,0.35)) drop-shadow(0 0 6px rgba(255,255,255,0.3))",
      }}
    >
      {/* eraser */}
      <div
        style={{
          position: "relative",
          width: ERASER_W,
          height: PENCIL_HEIGHT,
          background: "#ff8fa3",
          borderRadius: "26px 0 0 26px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 6,
            width: 10,
            height: PENCIL_HEIGHT - 16,
            background: "#ffc2cf",
            borderRadius: 6,
          }}
        />
      </div>

      {/* ferrule */}
      <div
        style={{
          position: "relative",
          width: FERRULE_W,
          height: PENCIL_HEIGHT,
          background: "linear-gradient(180deg, #f5d158 0%, #d9ab24 100%)",
          flexShrink: 0,
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 4, width: 2, height: "100%", background: "rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", top: 0, left: 9, width: 2, height: "100%", background: "rgba(0,0,0,0.25)" }} />
      </div>

      {/* body, with the face */}
      <div
        style={{
          position: "relative",
          width: BODY_W,
          height: PENCIL_HEIGHT,
          background: "linear-gradient(180deg, #ffdd55 0%, #ffcc33 45%, #e6b400 100%)",
          flexShrink: 0,
        }}
      >
        <div style={{ position: "absolute", top: 14, left: 10, width: 12, height: 3, borderRadius: 2, background: "#8a5a00", transform: "rotate(-10deg)" }} />
        <div style={{ position: "absolute", top: 14, left: 36, width: 12, height: 3, borderRadius: 2, background: "#8a5a00", transform: "rotate(10deg)" }} />
        <div style={{ position: "absolute", top: 21, left: 11, width: 9, height: 9, borderRadius: "50%", background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.15) inset" }}>
          <div style={{ position: "absolute", top: 2.5, left: 2.5, width: 4, height: 4, borderRadius: "50%", background: "#333" }} />
        </div>
        <div style={{ position: "absolute", top: 21, left: 37, width: 9, height: 9, borderRadius: "50%", background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.15) inset" }}>
          <div style={{ position: "absolute", top: 2.5, left: 2.5, width: 4, height: 4, borderRadius: "50%", background: "#333" }} />
        </div>
        <div style={{ position: "absolute", top: 36, left: 22, width: 14, height: 7, borderBottom: "2px solid #cc3344", borderRadius: "0 0 10px 10px" }} />
      </div>

      {/* wood cone */}
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: `${PENCIL_HEIGHT / 2}px solid transparent`,
          borderBottom: `${PENCIL_HEIGHT / 2}px solid transparent`,
          borderLeft: `${WOOD_W}px solid #ffe699`,
          flexShrink: 0,
        }}
      />

      {/* graphite point */}
      <div
        style={{
          width: GRAPHITE_W,
          height: GRAPHITE_W,
          borderRadius: "50%",
          background: "#3a3a3a",
          flexShrink: 0,
        }}
      />
    </div>
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
  /**
   * Element whose bottom edge the pencil peeks over while it waits to be
   * clicked. That element needs `overflow-hidden` for the peek to read.
   * Defaults to this component's own box.
   */
  peekFrom?: RefObject<HTMLElement | null>
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
  peekFrom,
  className = "",
}: SketchRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pencilRef = useRef<HTMLDivElement>(null)
  // Last pose actually rendered, so the float-in can start from wherever the
  // idle bob happened to leave the pencil instead of snapping first.
  const lastPose = useRef<{
    tipX: number
    tipY: number
    angle: number
    scale: number
  } | null>(null)
  // Where the pencil pokes up, in container coordinates — the prompt bubble
  // positions itself off this.
  const [peekAnchor, setPeekAnchor] = useState<{ x: number; y: number } | null>(
    null,
  )
  // "idle" has the pencil peeking over the card's bottom edge next to a
  // prompt; clicking it floats the pencil up and hands off to the reveal.
  const [phase, setPhase] = useState<"idle" | "running">("idle")
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const pencil = pencilRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let frameId = 0
    let cancelled = false

    // Measured up front (no image needed) so the pencil can be parked at its
    // resting spot immediately, before the portrait has even loaded.
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = container.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    const wd = Math.round(w * dpr)
    const hd = Math.round(h * dpr)

    // Scale the icon up relative to the container so it reads clearly
    // even though it darts across the frame quickly, and pin its
    // graphite tip (not its bounding-box corner) to the drawing point so
    // rotation pivots around the point that's actually "drawing".
    const iconTargetWidth = Math.min(132, Math.max(64, w * 0.22))
    const iconScale = iconTargetWidth / PENCIL_WIDTH
    if (pencil) {
      pencil.style.transformOrigin = `${PENCIL_TIP.x}px ${PENCIL_TIP.y}px`
      pencil.style.opacity = "1"
    }

    const applyPose = (tipX: number, tipY: number, angle: number, scale: number) => {
      lastPose.current = { tipX, tipY, angle, scale }
      if (!pencil) return
      pencil.style.transform = `translate(${tipX - PENCIL_TIP.x}px, ${tipY - PENCIL_TIP.y}px) rotate(${angle}deg) scale(${scale})`
    }

    // Resting pose: standing upright behind the peek element's bottom edge,
    // only its top part showing. Coordinates are this container's, which the
    // pencil layer is free to overflow — the peek element does the clipping.
    const peekEl = peekFrom?.current ?? container
    const peekRect = peekEl.getBoundingClientRect()
    const peekBottomY = peekRect.bottom - rect.top
    const peekCenterX = peekRect.left + peekRect.width / 2 - rect.left

    const pencilLength = PENCIL_WIDTH * iconScale
    // Tip up means the body hangs downward from the tip, so the tip is the
    // part that clears the edge.
    const restTipX = peekCenterX
    const restTipY = peekBottomY - pencilLength * PEEK_VISIBLE_FRACTION
    const hiddenTipY = peekBottomY + 24
    const restAngle = REST_ANGLE_DEG

    setPeekAnchor((prev) =>
      prev && prev.x === restTipX && prev.y === restTipY
        ? prev
        : { x: restTipX, y: restTipY },
    )

    const img = new Image()
    img.src = src

    // Idle: rise into view, then bob gently. The canvas stays blank, and
    // loading the image now warms the cache so the click draws without a stall.
    if (phase === "idle" && !reduceMotion) {
      let peekStart = 0
      const peekTick = (now: number) => {
        if (cancelled) return
        if (!peekStart) peekStart = now
        const elapsed = now - peekStart
        const rise = Math.min(elapsed / PEEK_RISE_MS, 1)
        const eased = 1 - Math.pow(1 - rise, 3)
        const bob =
          rise >= 1 ? Math.sin((elapsed / PEEK_BOB_MS) * Math.PI * 2) * PEEK_BOB_PX : 0
        applyPose(
          restTipX,
          hiddenTipY + (restTipY - hiddenTipY) * eased + bob,
          restAngle,
          iconScale,
        )
        frameId = requestAnimationFrame(peekTick)
      }
      frameId = requestAnimationFrame(peekTick)

      return () => {
        cancelled = true
        cancelAnimationFrame(frameId)
      }
    }

    img.onload = () => {
      if (cancelled) return

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
      const circleRadius = Math.min(w, h) / 2

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

      // The scan space is oversized to the full square's diagonal so
      // coverage is guaranteed at any tilt angle — but the visible circle
      // only occupies the middle portion of that diagonal; the rest is
      // square corners the crop hides. Mapping t linearly across the whole
      // diagonal means real time gets spent sweeping those hidden corners,
      // both before the circle starts filling and — worse — after it's
      // already completely revealed, which is the "pencil keeps moving
      // after it's done" bug. Map t across just the circle's own span
      // (plus half the stroke width at each edge, so the rim finishes
      // cleanly instead of a hair before/after) so t = 0 lines up with the
      // circle's near edge starting and t = 1 with its far edge finishing.
      const halfStroke = strokeWidthCss / 2
      const circleVMin = halfDiag - circleRadius - halfStroke
      const circleVMax = halfDiag + circleRadius + halfStroke
      const vAt = (t: number) => circleVMin + t * (circleVMax - circleVMin)

      const startPoint = project(0, vAt(0))
      let prevX = startPoint.x
      let prevY = startPoint.y
      let start = 0
      let lastNow = 0
      let simElapsed = 0
      // Cap how far a single frame can advance simulated time so a dropped
      // frame (tab throttling, jank) can never skip an entire scan band.
      const maxFrameMs = Math.min(40, durationMs / (rows * 3))

      // The scan point legitimately roams outside the circular crop (the
      // oversized diagonal scan space guarantees full coverage at any tilt
      // angle). Keep the *displayed* icon inside the circle with a soft,
      // continuous saturation (tanh) rather than a hard clamp — a hard
      // clamp snaps discontinuously the instant the boundary is crossed,
      // which is a big part of what read as "flicker". The mask itself
      // still uses the true, unclamped point.
      // The frontier travels all the way out to the rim, so the tip has to be
      // allowed to as well — capping it short is what made the pencil fall
      // behind the sketch late in the run. Near the rim there is genuinely no
      // room left on the blank side for a full-size body, so `rimScale` below
      // shrinks the icon instead of holding the tip back.
      const safeRadius = circleRadius * 0.99
      // Below the knee the clamp is the exact identity, so it adds no lag at
      // all; past it, it eases off toward safeRadius. (A plain tanh over the
      // whole range compresses far too early — it was pulling the pencil
      // dozens of pixels inward exactly when the frontier reached the rim,
      // which made the pencil fall progressively behind the sketch.)
      const clampKnee = safeRadius * 0.85

      let currentAngle = 0
      let angleInit = false
      // Lightly smoothed (lagged) version of the displayed position — the
      // flutter below moves the true point in sharp little jumps, which is
      // fine for where ink lands but reads as jitter if the icon itself
      // teleports there frame to frame. Easing the icon toward it keeps the
      // flicks readable as motion instead of noise.
      let displayX = 0
      let displayY = 0
      let displayInit = false

      // A hand doesn't sweep smoothly across the page — it flicks back and
      // forth a couple of times in one spot, then moves on to the next.
      // Each row is split into a few "clusters"; within a cluster the pencil
      // eases toward that spot while oscillating around it, with the
      // oscillation fading in/out at the cluster's edges so it hands off
      // smoothly to the next one. The forward position (`forwardFrac`) is
      // still monotonic 0→1 across the row, so total coverage and timing
      // are unaffected — only how the point gets there changes.
      const clustersPerRow = 2
      const oscPerCluster = 1.3
      const easeInOutCubic = (p: number) =>
        p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
      // Deterministic pseudo-random in [0, 1), seeded per cluster so the
      // flick's amplitude/speed varies without being perfectly uniform.
      const pseudoRandom = (seed: number) => {
        const s = Math.sin(seed * 12.9898) * 43758.5453
        return s - Math.floor(s)
      }

      // Everything about where the pencil is at a given progress `t`, with no
      // side effects — so the float-in can aim at exactly the pose the draw
      // loop will start from.
      const scanAt = (t: number) => {
        // Boustrophedon scan in (u, v) space: bands sweep alternately
        // left-right / right-left, while v drifts continuously "downward"
        // for an overall corner-to-corner feel; project() applies the tilt.
        const rawRow = t * rows
        const rowIndex = Math.min(Math.floor(rawRow), rows - 1)
        const rowFrac = rawRow - rowIndex
        const goingRight = rowIndex % 2 === 0

        const rawCluster = rowFrac * clustersPerRow
        const clusterIndex = Math.min(Math.floor(rawCluster), clustersPerRow - 1)
        const clusterFrac = rawCluster - clusterIndex
        const forwardFrac = (clusterIndex + easeInOutCubic(clusterFrac)) / clustersPerRow

        // Oscillate back and forth around the forward position, fading the
        // amplitude in and out across the cluster (0 at both edges) so
        // consecutive clusters — and rows — join without a visible jump.
        // Clusters near the row's own start/end are also softened further,
        // since that's already near the circle's clipped corners — full
        // amplitude there would flick the pencil in and out of view.
        // Sweep only as wide as the circle actually is at this level. The
        // scan space is sized to the square's diagonal so coverage is
        // guaranteed at any tilt, but the visible circle is much narrower —
        // and near the top and bottom its chord shrinks toward nothing.
        // Sweeping the full diagonal meant the pencil spent most of those
        // rows parked off-circle while the ink advanced without it, which is
        // what made it fall behind the sketch late in the run.
        const vBase = vAt(t)
        const vOffset = vBase - halfDiag
        const chordHalf =
          Math.sqrt(Math.max(0, circleRadius * circleRadius - vOffset * vOffset)) +
          halfStroke
        const uMin = halfDiag - chordHalf
        const uSpan = chordHalf * 2

        const clusterWidth = uSpan / clustersPerRow
        const flutterSeed = rowIndex * 5.17 + clusterIndex * 3.29
        const rowEdgeSoften = 0.45 + 0.55 * Math.sin(Math.PI * forwardFrac)
        const flutterAmp =
          clusterWidth * (0.16 + 0.12 * pseudoRandom(flutterSeed)) * rowEdgeSoften
        const flutterFreq = oscPerCluster + pseudoRandom(flutterSeed + 1) * 0.5
        const flutterEnvelope = Math.sin(Math.PI * clusterFrac)
        const flutterOffset =
          Math.sin(clusterFrac * flutterFreq * Math.PI * 2) * flutterAmp * flutterEnvelope

        const dirFrac = goingRight ? forwardFrac : 1 - forwardFrac
        let u = uMin + dirFrac * uSpan + (goingRight ? flutterOffset : -flutterOffset)
        u = Math.min(uMin + uSpan, Math.max(uMin, u))

        const wobble = Math.sin(u / 30) * (bandSize * 0.06)
        const v = vBase + wobble
        const { x, y } = project(u, v)

        // Unit vector pointing into the side that hasn't been revealed yet
        // (+v is where the sweep is headed). It's a pure V-axis vector, so
        // it doesn't flip when the flutter reverses on the U axis.
        const vAheadPoint = project(u, v + 1)
        const fdx0 = vAheadPoint.x - x
        const fdy0 = vAheadPoint.y - y
        const flen = Math.hypot(fdx0, fdy0) || 1
        const blankX = fdx0 / flen
        const blankY = fdy0 / flen

        // Ink is stroked centered on the path, so the visible edge sits
        // about halfStroke ahead of (x, y). Put the tip right there — on
        // the frontier, not on pixels that are already filled in.
        return {
          x,
          y,
          blankX,
          blankY,
          flutterOffset,
          flutterAmp,
          tipX: x + blankX * halfStroke * 0.9,
          tipY: y + blankY * halfStroke * 0.9,
        }
      }

      type Scan = ReturnType<typeof scanAt>

      // Turn a (possibly smoothed) tip position into the pose actually
      // rendered: held inside the circle, shrunk near the rim, and angled so
      // the body lies back over the blank side.
      const resolvePose = (scan: Scan, rawTipX: number, rawTipY: number) => {
        // Keep the icon inside the circle with a soft saturation instead
        // of a hard clamp, so it never has to snap to the boundary.
        const dx = rawTipX - cx
        const dy = rawTipY - cy
        const dist = Math.hypot(dx, dy)
        const kneeRange = safeRadius - clampKnee || 1
        const softDist =
          dist <= clampKnee
            ? dist
            : clampKnee + kneeRange * Math.tanh((dist - clampKnee) / kneeRange)
        const tipX = dist > 0 ? cx + (dx / dist) * softDist : rawTipX
        const tipY = dist > 0 ? cy + (dy / dist) * softDist : rawTipY

        // As the frontier nears the rim, the blank side is only a thin
        // crescent — a full-size body laid back into it would hang off the
        // edge and get cropped away. Shrink toward the rim so it still
        // fits (and reads as the pencil easing off as the sketch lands).
        const rimCloseness = Math.min(1, Math.max(0, (dist / safeRadius - 0.62) / 0.38))

        // Hold the pencil the way a hand actually does while shading: tip
        // on the frontier, body laid back over the blank paper it's about
        // to fill. The icon points along +X, and its body extends back
        // from the tip, so aiming +X *against* the blank direction puts
        // the whole body on the unrevealed side.
        //
        // Deriving this from the sweep geometry rather than the
        // instantaneous velocity is what keeps it readable — velocity
        // reverses several times a second during the flutter, which spun
        // the icon far too fast to see.
        const blankAngle = (Math.atan2(scan.blankY, scan.blankX) * 180) / Math.PI
        const sway = (scan.flutterOffset / (scan.flutterAmp || 1)) * PENCIL_SWAY_DEG

        return {
          tipX,
          tipY,
          angle: blankAngle + 180 + PENCIL_TILT_DEG + sway,
          scale: iconScale * (1 - 0.42 * rimCloseness),
        }
      }

      // Once the sketch lands, walk the pencil back to where it peeked from
      // and let it duck below that edge, rather than blinking out mid-air.
      let exitFrom: {
        tipX: number
        tipY: number
        angle: number
        scale: number
      } | null = null
      let exitAngleDelta = 0
      let exitStart = 0
      const floatOut = (now: number) => {
        if (cancelled) return
        if (!exitStart) {
          exitStart = now
          exitFrom = lastPose.current ?? {
            tipX: restTipX,
            tipY: restTipY,
            angle: restAngle,
            scale: iconScale,
          }
          exitAngleDelta = (restAngle - exitFrom.angle) % 360
          if (exitAngleDelta > 180) exitAngleDelta -= 360
          if (exitAngleDelta < -180) exitAngleDelta += 360
        }
        const origin = exitFrom!
        const elapsed = now - exitStart

        if (elapsed < FLOAT_OUT_MS) {
          const p = elapsed / FLOAT_OUT_MS
          // Smoothstep: eases out of the drawing pose and settles on landing.
          const eased = p * p * (3 - 2 * p)
          const lift = Math.sin(Math.PI * eased) * h * 0.07
          applyPose(
            origin.tipX + (restTipX - origin.tipX) * eased,
            origin.tipY + (restTipY - origin.tipY) * eased - lift,
            origin.angle + exitAngleDelta * eased,
            origin.scale + (iconScale - origin.scale) * eased,
          )
          frameId = requestAnimationFrame(floatOut)
          return
        }

        // Then drop back under the edge it came from.
        const p = Math.min((elapsed - FLOAT_OUT_MS) / DUCK_OUT_MS, 1)
        const eased = p * p
        applyPose(
          restTipX,
          restTipY + (hiddenTipY - restTipY) * eased,
          restAngle,
          iconScale,
        )
        // The peek element clips it on the way down, but fade too so this
        // still ends cleanly when no clipping ancestor was provided.
        if (pencil) pencil.style.opacity = `${1 - eased}`
        if (p < 1) frameId = requestAnimationFrame(floatOut)
      }

      const tick = (now: number) => {
        if (cancelled) return
        if (!start) {
          start = now
          lastNow = now
        }
        const rawDt = now - lastNow
        simElapsed += Math.min(rawDt, maxFrameMs)
        lastNow = now
        const t = Math.min(simElapsed / durationMs, 1)

        const scan = scanAt(t)
        drawSegment(prevX, prevY, scan.x, scan.y)

        if (pencil) {
          if (!displayInit) {
            displayX = scan.tipX
            displayY = scan.tipY
            displayInit = true
          } else {
            const posSmoothing = 1 - Math.exp(-Math.max(rawDt, 0) / 110)
            displayX += (scan.tipX - displayX) * posSmoothing
            displayY += (scan.tipY - displayY) * posSmoothing
          }

          const pose = resolvePose(scan, displayX, displayY)
          if (!angleInit) {
            currentAngle = pose.angle
            angleInit = true
          } else {
            let delta = (pose.angle - currentAngle) % 360
            if (delta > 180) delta -= 360
            if (delta < -180) delta += 360
            const smoothing = 1 - Math.exp(-Math.max(rawDt, 0) / 70)
            currentAngle += delta * smoothing
          }
          applyPose(pose.tipX, pose.tipY, currentAngle, pose.scale)
        }

        prevX = scan.x
        prevY = scan.y

        if (t < 1) {
          frameId = requestAnimationFrame(tick)
        } else {
          maskCtx.fillStyle = "#fff"
          maskCtx.fillRect(0, 0, wd, hd)
          ctx.clearRect(0, 0, wd, hd)
          ctx.drawImage(srcCanvas, 0, 0)
          frameId = requestAnimationFrame(floatOut)
        }
      }

      // Float up from the resting spot into the pose the reveal starts from,
      // then hand straight over to the draw loop.
      const entryScan = scanAt(0)
      const entryPose = resolvePose(entryScan, entryScan.tipX, entryScan.tipY)
      // Start from wherever the peek left it (mid-bob), not a fixed point.
      const from = lastPose.current ?? {
        tipX: restTipX,
        tipY: restTipY,
        angle: restAngle,
        scale: iconScale,
      }
      let angleDelta = (entryPose.angle - from.angle) % 360
      if (angleDelta > 180) angleDelta -= 360
      if (angleDelta < -180) angleDelta += 360

      let floatStart = 0
      const floatIn = (now: number) => {
        if (cancelled) return
        if (!floatStart) floatStart = now
        const p = Math.min((now - floatStart) / FLOAT_IN_MS, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        // A slight arc over the straight line reads as floating rather than sliding.
        const lift = Math.sin(Math.PI * eased) * h * 0.07

        applyPose(
          from.tipX + (entryPose.tipX - from.tipX) * eased,
          from.tipY + (entryPose.tipY - from.tipY) * eased - lift,
          from.angle + angleDelta * eased,
          from.scale + (entryPose.scale - from.scale) * eased,
        )

        frameId = requestAnimationFrame(p < 1 ? floatIn : tick)
      }

      frameId = requestAnimationFrame(floatIn)
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
    }
  }, [src, durationMs, rows, angleDeg, mirror, zoom, phase, reduceMotion, peekFrom])

  return (
    // The image semantics live on the canvas, not this wrapper — a wrapper
    // with role="img" would swallow the button inside it for assistive tech.
    // Note this wrapper is deliberately NOT clipped: the pencil layer has to
    // reach outside the circle to peek over the card's bottom edge. Only the
    // canvas gets the circular crop.
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={alt}
          className="block h-full w-full"
        />
      </div>
      {/* No opacity transition here — the exit animation drives opacity per
          frame, and a CSS transition would lag behind it. */}
      <div
        ref={pencilRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0"
      >
        <PencilIcon />
      </div>

      {/* A stationary hit area over the peeking pencil. Putting the button on
          the pencil itself would mean a target that never stops moving, since
          the pencil bobs the whole time it waits. */}
      {phase === "idle" && !reduceMotion && peekAnchor && (
        <button
          type="button"
          onClick={() => setPhase("running")}
          aria-label={`Draw ${alt}`}
          className="absolute -translate-x-1/2 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          style={{
            left: peekAnchor.x,
            top: peekAnchor.y - 58,
            width: 150,
            height: 125,
          }}
        />
      )}

      {phase === "idle" && !reduceMotion && peekAnchor && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
          style={{ left: peekAnchor.x, top: peekAnchor.y - 14 }}
        >
          <span className="sketch-bob relative block whitespace-nowrap rounded-full border border-line bg-paper px-4 py-1.5 text-sm font-medium text-ink shadow-sm">
            click me
            <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-line bg-paper" />
          </span>
        </div>
      )}
    </div>
  )
}

export default SketchReveal
