import { useEffect, useMemo, useRef, useState } from "react";
import WebThreads from "./WebThreads";

interface RibbonBlockProps {
  top: number;
  height: number;
  angle: number;
  threadCount: number;
  position: number;
  speed: number;
  spread: number;
  thickness: number;
  isFirst: boolean;
  isLast: boolean;
}

function RibbonBlock({
  top,
  height,
  angle,
  threadCount,
  position,
  speed,
  spread,
  thickness,
  isFirst,
  isLast,
}: RibbonBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        rootMargin: "150px 0px", // Unmount distant canvases so only 1-2 active WebGL contexts run
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Soft gradient mask so overlapping adjacent blocks blend like a continuous woven lattice
  const maskGradient = isFirst
    ? "linear-gradient(to bottom, transparent 0%, transparent 18%, rgba(0, 0, 0, 0.4) 38%, black 65%, black 85%, transparent 100%)"
    : isLast
    ? "linear-gradient(to bottom, transparent 0%, black 25%)"
    : "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)";

  return (
    <div
      ref={blockRef}
      className="absolute inset-x-0 overflow-hidden pointer-events-none"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
      }}
      aria-hidden="true"
    >
      {isVisible && (
        <WebThreads
          colors={["#5227FF", "#002fff"]}
          coreColor="#1d4ed8"
          threadCount={threadCount}
          spread={spread}
          lightMode={false}
          speed={speed}
          frequency={4.5}
          taper={1.3}
          position={position}
          pinch={0.5}
          nodes={1}
          angle={angle}
          glow={0.031}
          falloff={0.48}
          thickness={thickness}
          brightness={0.72}
          opacity={0.55}
          blur={20}
          depth={0}
          pulses={0}
          mirror
          shimmer={false}
          fade={0}
          grain={0.03}
          intro={false}
          mouseInteraction
          mouseStrength={0.3}
          pulseOnClick={false}
          paused={false}
          dpr={1}
        />
      )}
    </div>
  );
}

// Deterministic pseudorandom generator based on block index and offset
function prand(i: number, offset = 0) {
  const val = Math.sin((i + 1) * 12.9898 + offset * 78.233) * 43758.5453;
  return val - Math.floor(val);
}

export default function UnifiedRibbonBackground({ totalHeight }: { totalHeight: number }) {
  // Dynamically compute organic, randomized blocks with varied heights and thread counts
  const blocks = useMemo(() => {
    // Varied pattern alternating between 2 and 3 strings per alternation (no solo 1-string ribbons)
    const threadPattern = [2, 3, 2, 3, 2, 3, 3, 2, 2, 3];
    const generated: Array<{
      top: number;
      height: number;
      angle: number;
      threadCount: number;
      position: number;
      speed: number;
      spread: number;
      thickness: number;
      isFirst: boolean;
      isLast: boolean;
    }> = [];

    let currentTop = 0;
    let i = 0;
    // Cover full height plus buffer so background never cuts off early
    const targetHeight = Math.max(totalHeight, 4000);

    while (currentTop < targetHeight + 500) {
      // Alternates between 2 and 3 threads (any 1-thread fallback promoted to 2)
      const rawCount = threadPattern[i % threadPattern.length];
      const threadCount = rawCount <= 1 ? 2 : rawCount;

      // Make a few ribbons significantly taller in height (~45% of blocks)
      const isTall = i % 3 === 1 || prand(i, 2) > 0.55;
      const height = isTall
        ? 1500 + Math.floor(prand(i, 3) * 350) // 1500px - 1850px taller ribbons
        : 950 + Math.floor(prand(i, 4) * 200); // 950px - 1150px standard ribbons

      // Seamless overlap between successive blocks
      const overlap = 270 + Math.floor(prand(i, 5) * 80); // 270px - 350px

      // Alternating diagonal angles with subtle organic angle variation (28° - 38°)
      const sign = i % 2 === 0 ? -1 : 1;
      const angle = Number((sign * (28 + prand(i, 6) * 10)).toFixed(1));

      // Subtle horizontal center jitter (0.47 - 0.53)
      const position = Number((0.47 + prand(i, 7) * 0.06).toFixed(2));

      // Visible, graceful speed for drifting light bands
      const speed = Number((0.095 + prand(i, 8) * 0.035).toFixed(3));

      // Tailor thickness and spread for wide blue bands of light (2 or 3)
      const spread = threadCount === 2 ? 0.22 : 0.25;
      const thickness = threadCount === 2 ? 5.2 : 4.6;

      generated.push({
        top: currentTop,
        height,
        angle,
        threadCount,
        position,
        speed,
        spread,
        thickness,
        isFirst: i === 0,
        isLast: false,
      });

      currentTop += height - overlap;
      i++;
    }

    if (generated.length > 0) {
      generated[generated.length - 1].isLast = true;
    }

    return generated;
  }, [totalHeight]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {blocks.map((block, idx) => (
        <RibbonBlock
          key={idx}
          top={block.top}
          height={block.height}
          angle={block.angle}
          threadCount={block.threadCount}
          position={block.position}
          speed={block.speed}
          spread={block.spread}
          thickness={block.thickness}
          isFirst={block.isFirst}
          isLast={block.isLast}
        />
      ))}
    </div>
  );
}
