import { useEffect, useRef, useState, useCallback } from "react"

interface TypingStatProps {
  text?: string
  isTriggered?: boolean
  delayMs?: number
  typingSpeed?: number
  className?: string
}

export default function TypingStat({
  text = "1st",
  isTriggered = false,
  delayMs = 0,
  typingSpeed = 160,
  className = "",
}: TypingStatProps) {
  const isReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const [displayedLength, setDisplayedLength] = useState(() => (isReduced ? text.length : 0))
  const [isTyping, setIsTyping] = useState(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const startTyping = useCallback(
    (startDelay = 0) => {
      clearTimers()

      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplayedLength(text.length)
        setIsTyping(false)
        return
      }

      const startTimeout = setTimeout(() => {
        setDisplayedLength(0)
        setIsTyping(true)

        for (let i = 1; i <= text.length; i++) {
          const charTimeout = setTimeout(() => {
            setDisplayedLength(i)

            if (i === text.length) {
              const finishTimeout = setTimeout(() => {
                setIsTyping(false)
              }, 450)
              timeoutsRef.current.push(finishTimeout)
            }
          }, i * typingSpeed)

          timeoutsRef.current.push(charTimeout)
        }
      }, startDelay)

      timeoutsRef.current.push(startTimeout)
    },
    [text, typingSpeed, clearTimers]
  )

  useEffect(() => {
    if (!isTriggered) return
    const timer = setTimeout(() => {
      startTyping(0)
    }, delayMs)
    return () => {
      clearTimeout(timer)
      clearTimers()
    }
  }, [isTriggered, delayMs, startTyping, clearTimers])

  const handleMouseEnter = () => {
    if (isTyping) return
    startTyping(30)
  }

  return (
    <span
      onMouseEnter={handleMouseEnter}
      className={`inline-flex items-baseline select-none whitespace-nowrap ${className}`}
      title="Hover to re-type"
    >
      <span>{text.slice(0, displayedLength)}</span>

      {/* Zero-width caret so layout is 100% stable */}
      {isTyping && (
        <span className="relative inline-block w-0" aria-hidden="true">
          <span className="absolute left-[2px] bottom-[0.1em] w-[2px] sm:w-[3px] h-[0.72em] bg-blue-400 animate-pulse pointer-events-none" />
        </span>
      )}
    </span>
  )
}
