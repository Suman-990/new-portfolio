import React, { useEffect, useRef, useState, useCallback } from "react"

interface HeroParticleImageProps {
  src: string
  alt?: string
  className?: string
  particleSize?: number
  interactionRadius?: number
  isLoaded?: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  sx: number // Home target X
  sy: number // Home target Y
  c: string  // Color rgba
  size: number
}

export default function HeroParticleImage({
  src,
  alt = "Hero Character",
  className = "",
  particleSize = 3,
  interactionRadius = 68,
  isLoaded = true,
}: HeroParticleImageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isSampled, setIsSampled] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number | null>(null)
  const isStartedRef = useRef(false)

  // Mouse tracking in canvas coordinate space
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  })

  // Fixed internal rendering resolution for pixel sampling
  // Aspect ratio is 959x1312 ≈ 0.7309
  const CANVAS_WIDTH = 420
  const CANVAS_HEIGHT = 575

  // Sample image into particles
  const initParticles = useCallback((img: HTMLImageElement) => {
    const offscreen = document.createElement("canvas")
    offscreen.width = CANVAS_WIDTH
    offscreen.height = CANVAS_HEIGHT
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true })
    if (!offCtx) return

    // Draw full image scaled to offscreen canvas
    offCtx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    const imgData = offCtx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    const data = imgData.data

    const particles: Particle[] = []
    const step = particleSize

    for (let y = 0; y < CANVAS_HEIGHT; y += step) {
      for (let x = 0; x < CANVAS_WIDTH; x += step) {
        const index = (Math.floor(y) * CANVAS_WIDTH + Math.floor(x)) * 4
        const alpha = data[index + 3]

        // Keep non-transparent pixels
        if (alpha > 40) {
          const r = data[index]
          const g = data[index + 1]
          const b = data[index + 2]
          const a = (alpha / 255).toFixed(3)
          const color = `rgba(${r},${g},${b},${a})`

          // Initial scattered position for the appearing assembly animation
          // Particles explode outward from random angles
          const angle = Math.random() * Math.PI * 2
          const distance = 120 + Math.random() * 320
          const initialX = x + Math.cos(angle) * distance
          const initialY = y + Math.sin(angle) * distance

          particles.push({
            x: initialX,
            y: initialY,
            vx: 0,
            vy: 0,
            sx: x,
            sy: y,
            c: color,
            size: particleSize,
          })
        }
      }
    }

    particlesRef.current = particles
    setIsSampled(true)
  }, [particleSize])

  // Preload and sample the image
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = src

    let rafId: number | null = null
    if (img.complete && img.naturalWidth > 0) {
      rafId = requestAnimationFrame(() => initParticles(img))
    } else {
      img.onload = () => {
        rafId = requestAnimationFrame(() => initParticles(img))
      }
    }

    return () => {
      img.onload = null
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [src, initParticles])

  // Trigger appearing entrance when isLoaded becomes true
  useEffect(() => {
    if (isLoaded) {
      isStartedRef.current = true
    }
  }, [isLoaded])

  // Animation Loop: Assembly + Hover interaction
  useEffect(() => {
    if (!isSampled) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles = particlesRef.current
    const total = particles.length
    const radius = interactionRadius
    const radiusSq = radius * radius

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      const mouse = mouseRef.current
      const isStarted = isStartedRef.current

      for (let i = 0; i < total; i++) {
        const p = particles[i]

        if (isStarted) {
          // 1. Move particle by velocity
          p.x += p.vx
          p.y += p.vy

          // 2. Spring pull towards home target (sx, sy)
          // Uses smooth exponential easing back to home
          p.vx = (p.sx - p.x) / 9.5
          p.vy = (p.sy - p.y) / 9.5

          // 3. Mouse repulsion force when active
          if (mouse.active) {
            const dx = mouse.x - p.x
            const dy = mouse.y - p.y
            const distSq = dx * dx + dy * dy

            if (distSq < radiusSq && distSq > 0) {
              const dist = Math.sqrt(distSq)
              const angle = Math.atan2(dy, dx)
              const force = (1 - dist / radius) * 28

              // Push particle away from the mouse cursor
              p.vx -= force * Math.cos(angle)
              p.vy -= force * Math.sin(angle)
            }
          }
        }

        // Render particle
        ctx.fillStyle = p.c
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isSampled, interactionRadius])

  // Pointer position tracking relative to canvas buffer
  const updatePointer = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()

    const x = (clientX - rect.left) * (CANVAS_WIDTH / rect.width)
    const y = (clientY - rect.top) * (CANVAS_HEIGHT / rect.height)

    mouseRef.current = { x, y, active: true }

    // Instant impulse on mouse move for extra responsiveness
    const particles = particlesRef.current
    const radius = interactionRadius
    const radiusSq = radius * radius

    for (let i = 0, l = particles.length; i < l; i++) {
      const p = particles[i]
      const dx = x - p.x
      const dy = y - p.y
      const distSq = dx * dx + dy * dy

      if (distSq < radiusSq && distSq > 0) {
        const dist = Math.sqrt(distSq)
        const angle = Math.atan2(dy, dx)
        const force = (1 - dist / radius) * 35
        p.vx -= force * Math.cos(angle)
        p.vy -= force * Math.sin(angle)
      }
    }
  }, [interactionRadius])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    updatePointer(e.clientX, e.clientY)
  }, [updatePointer])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false
    mouseRef.current.x = -9999
    mouseRef.current.y = -9999
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY)
    }
  }, [updatePointer])

  const handleTouchEnd = useCallback(() => {
    mouseRef.current.active = false
  }, [])

  // Click shockwave: bursts nearby particles outward
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width)
    const clickY = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height)

    const particles = particlesRef.current
    const shockRadius = 130

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const dx = clickX - p.x
      const dy = clickY - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < shockRadius && dist > 0) {
        const force = (1 - dist / shockRadius) * 45
        const angle = Math.atan2(dy, dx)
        p.vx -= force * Math.cos(angle)
        p.vy -= force * Math.sin(angle)
      }
    }
  }, [])

  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        aria-label={alt}
        role="img"
        className="w-auto max-w-[280px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[440px] xl:max-w-[470px] max-h-[480px] sm:max-h-[560px] lg:max-h-[640px] object-contain select-none cursor-pointer drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] transition-transform duration-300 hover:scale-[1.01]"
        style={{
          maskImage: "linear-gradient(to bottom, black 86%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 86%, transparent 100%)",
        }}
      />
    </div>
  )
}
