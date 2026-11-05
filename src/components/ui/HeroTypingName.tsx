import { useEffect, useRef, useState, useCallback } from "react"

interface HeroTypingNameProps {
  name?: string
  isStarted?: boolean
  delayMs?: number
  typingSpeed?: number
  className?: string
  style?: React.CSSProperties
}

export default function HeroTypingName({
  name = "SUMAN",
  isStarted = false,
  delayMs = 820,
  typingSpeed = 175, // Slower, deliberate typing speed
  className = "",
  style,
}: HeroTypingNameProps) {
  const isReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const [displayedLength, setDisplayedLength] = useState(() => (isReduced ? name.length : 0))
  const [isTyping, setIsTyping] = useState(false)
  const [showDot, setShowDot] = useState(() => isReduced)

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const playTyping = useCallback(
    (startDelay = 0) => {
      clearTimers()

      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplayedLength(name.length)
        setIsTyping(false)
        setShowDot(true)
        return
      }

      const startTimeout = setTimeout(() => {
        setDisplayedLength(0)
        setIsTyping(true)
        setShowDot(false)

        for (let i = 1; i <= name.length; i++) {
          const charTimeout = setTimeout(() => {
            setDisplayedLength(i)

            // When the final letter is typed, show the dot
            if (i === name.length) {
              setShowDot(true)
              const finishTimeout = setTimeout(() => {
                setIsTyping(false)
              }, 400)
              timeoutsRef.current.push(finishTimeout)
            }
          }, i * typingSpeed)

          timeoutsRef.current.push(charTimeout)
        }
      }, startDelay)

      timeoutsRef.current.push(startTimeout)
    },
    [name, typingSpeed, clearTimers]
  )

  // Trigger on initial entrance with delayMs
  useEffect(() => {
    if (!isStarted) return
    const timer = setTimeout(() => {
      playTyping(0)
    }, delayMs)
    return () => {
      clearTimeout(timer)
      clearTimers()
    }
  }, [isStarted, delayMs, playTyping, clearTimers])

  // Re-type on hover
  const handleMouseEnter = () => {
    if (isTyping) return
    playTyping(30)
  }

  return (
    <h1
      onMouseEnter={handleMouseEnter}
      className={`cursor-pointer select-none group/name whitespace-nowrap ${className}`}
      style={style}
      aria-label={`${name}.`}
      title="Hover to re-type"
    >
      {/* Typed visible characters */}
      <span>{name.slice(0, displayedLength)}</span>

      {/* Zero-layout caret: width:0 and height:0 in document flow prevents any line wrap or text lifting */}
      {isTyping && (
        <span className="relative inline-block w-0" aria-hidden="true">
          <span className="absolute left-[3px] sm:left-[5px] bottom-[0.08em] w-[3px] sm:w-[4px] h-[0.72em] bg-blue-500 animate-pulse pointer-events-none" />
        </span>
      )}

      {/* Electric blue accent dot */}
      {showDot && <span className="text-blue-500">.</span>}
    </h1>
  )
}
