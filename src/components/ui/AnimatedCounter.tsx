import { useEffect, useRef, useState, useCallback } from "react"

interface AnimatedCounterProps {
  target: number
  suffix?: string
  duration?: number
  delayMs?: number
  isTriggered?: boolean
  className?: string
}

export default function AnimatedCounter({
  target,
  suffix = "",
  duration = 1200,
  delayMs = 0,
  isTriggered = false,
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const animFrameRef = useRef<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startCounter = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Check reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target)
      setIsFinished(true)
      return
    }

    setCount(0)
    setIsFinished(false)

    const startTime = performance.now()

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Cubic ease out: starts briskly and decelerates smoothly
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(ease * target)
      setCount(current)

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step)
      } else {
        setCount(target)
        setIsFinished(true)
      }
    }

    animFrameRef.current = requestAnimationFrame(step)
  }, [target, duration])

  // Trigger on entry with delayMs
  useEffect(() => {
    if (!isTriggered) return

    timeoutRef.current = setTimeout(() => {
      startCounter()
    }, delayMs)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isTriggered, delayMs, startCounter])

  return (
    <span
      onMouseEnter={startCounter}
      className={`inline-block tabular-nums select-none ${className}`}
      title="Hover to recount"
    >
      {count}
      {isFinished ? suffix : ""}
    </span>
  )
}
