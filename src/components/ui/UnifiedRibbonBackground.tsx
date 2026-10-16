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
          coreColor="#1453ff"
          threadCount={threadCount}
          spread={spread}
          lightMode={false}
          speed={speed}
          frequency={5}
          taper={1.3}
          position={position}
          pinch={0.5}
          nodes={1}
          angle={angle}
          glow={0.02}
          falloff={0.6}
          thickness={thickness}
          brightness={0.65}
          opacity={0.8}
          depth={0}
          pulses={0}
          mirror
          shimmer={false}
          fade={0}
          grain={0.065}
          intro={false}
          mouseInteraction
          mouseStrength={0.5}
          pulseOnClick
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
    // Varied pattern of 1-3 strings per alternation
    const threadPattern = [2, 3, 1, 3, 2, 1, 2, 3, 1, 3];
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
      // 1 to 3 threads per alternation
      const threadCount = threadPattern[i % threadPattern.length];

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

      // Gentle speed variation
      const speed = Number((0.09 + prand(i, 8) * 0.03).toFixed(3));

      // Tailor thickness and spread according to thread count
      const spread = threadCount === 1 ? 0.14 : threadCount === 2 ? 0.17 : 0.2;
      const thickness = threadCount === 1 ? 1.45 : threadCount === 2 ? 1.3 : 1.2;

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
