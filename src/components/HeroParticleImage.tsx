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
  particleSize = 7.5, // 7.5 on 959px buffer scales to ~3px in CSS
  interactionRadius = 150,
  isLoaded = true,
}: HeroParticleImageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isSampled, setIsSampled] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const imageRef = useRef<HTMLImageElement | null>(null)
  const animFrameRef = useRef<number | null>(null)

  // Entrance & High-Res Image Alpha state
  const isStartedRef = useRef(false)
  const imgAlphaRef = useRef(0)
  const entranceProgressRef = useRef(0)

  // Mouse hover tracking in 959x1312 coordinate space
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  })
  const currentHoleRadiusRef = useRef(0)

  // Native high-res image dimensions (959 x 1312)
  const WIDTH = 959
  const HEIGHT = 1312

  // Sample image into particles
  const initParticles = useCallback((img: HTMLImageElement) => {
    imageRef.current = img

    const offscreen = document.createElement("canvas")
    offscreen.width = WIDTH
    offscreen.height = HEIGHT
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true })
    if (!offCtx) return

    offCtx.drawImage(img, 0, 0, WIDTH, HEIGHT)
    const imgData = offCtx.getImageData(0, 0, WIDTH, HEIGHT)
    const data = imgData.data

    const particles: Particle[] = []
    const step = particleSize

    for (let y = 0; y < HEIGHT; y += step) {
      for (let x = 0; x < WIDTH; x += step) {
        const index = (Math.floor(y) * WIDTH + Math.floor(x)) * 4
        const alpha = data[index + 3]

        if (alpha > 40) {
          const r = data[index]
          const g = data[index + 1]
          const b = data[index + 2]
          const a = (alpha / 255).toFixed(3)
          const color = `rgba(${r},${g},${b},${a})`

          // Initial scattered position for the appearing assembly animation
          const angle = Math.random() * Math.PI * 2
          const distance = 250 + Math.random() * 650
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

  // Render loop: Hybrid High-Definition Image + Interactive Particle Physics
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
      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      const mouse = mouseRef.current
      const isStarted = isStartedRef.current
      const img = imageRef.current

      // 1. Advance entrance progress and transition to crisp HD image
      if (isStarted) {
        entranceProgressRef.current = Math.min(entranceProgressRef.current + 0.018, 1)
        if (entranceProgressRef.current > 0.45) {
          // As particles lock into home, ramp up high-res image opacity
          imgAlphaRef.current = Math.min(imgAlphaRef.current + 0.045, 1)
        }
      }

      // Smooth iris easing for hover cutout
      const targetHoleRadius = mouse.active ? radius : 0
      currentHoleRadiusRef.current += (targetHoleRadius - currentHoleRadiusRef.current) * 0.16
      const currentHole = currentHoleRadiusRef.current

      // 2. DRAW HIGH-RES CRISP IMAGE (When visible)
      if (img && imgAlphaRef.current > 0) {
        ctx.save()
        ctx.globalAlpha = imgAlphaRef.current
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, WIDTH, HEIGHT)

        // If mouse is hovering: cut out a soft radial hole in the crisp image
        // revealing the dynamic interactive particles underneath!
        if (currentHole > 4) {
          ctx.globalCompositeOperation = "destination-out"
          const gradient = ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            currentHole * 0.25,
            mouse.x,
            mouse.y,
            currentHole
          )
          gradient.addColorStop(0, "rgba(0, 0, 0, 1)")
          gradient.addColorStop(0.75, "rgba(0, 0, 0, 0.85)")
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(mouse.x, mouse.y, currentHole, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      // 3. UPDATE & RENDER PARTICLES
      // When crisp image is 100% visible and no hover is happening, particles rest silently (0 draw overhead)
      const isSettled = imgAlphaRef.current >= 1
      const isInteracting = mouse.active || currentHole > 4

      // We render particles if:
      // a) We are in the appearing entrance sequence (!isSettled)
      // b) The user is hovering/interacting (isInteracting)
      if (!isSettled || isInteracting) {
        for (let i = 0; i < total; i++) {
          const p = particles[i]

          if (isStarted) {
            // Spring pull towards home target (sx, sy)
            p.x += p.vx
            p.y += p.vy

            p.vx = (p.sx - p.x) / 9.5
            p.vy = (p.sy - p.y) / 9.5

            // Mouse repulsion force when hover is active
            if (mouse.active) {
              const dx = mouse.x - p.x
              const dy = mouse.y - p.y
              const distSq = dx * dx + dy * dy

              if (distSq < radiusSq && distSq > 0) {
                const dist = Math.sqrt(distSq)
                const angle = Math.atan2(dy, dx)
                const force = (1 - dist / radius) * 55

                // Repel away from cursor
                p.vx -= force * Math.cos(angle)
                p.vy -= force * Math.sin(angle)
              }
            }
          }

          // Optimization: When crisp image is mostly visible, only draw particles
          // that are displaced or within the hover zone so performance stays at 120 FPS
          if (isSettled) {
            const dispSq = (p.x - p.sx) * (p.x - p.sx) + (p.y - p.sy) * (p.y - p.sy)
            if (dispSq < 1.2) continue // Skip stationary particles (crisp image handles them!)
          }

          ctx.fillStyle = p.c
          ctx.fillRect(p.x, p.y, p.size, p.size)
        }
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

  // Map pointer coordinates to 959x1312 canvas coordinate space
  const updatePointer = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()

    const x = (clientX - rect.left) * (WIDTH / rect.width)
    const y = (clientY - rect.top) * (HEIGHT / rect.height)

    mouseRef.current = { x, y, active: true }

    // Immediate reactive impulse to nearby particles
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
        const force = (1 - dist / radius) * 60
        p.vx -= force * Math.cos(angle)
        p.vy -= force * Math.sin(angle)
      }
    }
  }, [])

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
    const clickX = (e.clientX - rect.left) * (WIDTH / rect.width)
    const clickY = (e.clientY - rect.top) * (HEIGHT / rect.height)

    const particles = particlesRef.current
    const shockRadius = 260

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const dx = clickX - p.x
      const dy = clickY - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < shockRadius && dist > 0) {
        const force = (1 - dist / shockRadius) * 80
        const angle = Math.atan2(dy, dx)
        p.vx -= force * Math.cos(angle)
        p.vy -= force * Math.sin(angle)
      }
    }
  }, [])

  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      {/*
        Full Retina Canvas:
        Internal buffer is 959x1312 (100% pixel matching the native high-res image).
        CSS controls responsive display scaling.
      */}
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
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
