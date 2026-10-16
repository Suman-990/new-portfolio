import { useEffect, useRef, useState } from "react";
import WebThreads from "./WebThreads";

interface RibbonBlockProps {
  top: number;
  height: number;
  angle: number;
  isFirst: boolean;
  isLast: boolean;
}

function RibbonBlock({ top, height, angle, isFirst, isLast }: RibbonBlockProps) {
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
        rootMargin: "600px 0px", // Pre-mount before scroll arrives
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Soft gradient mask so overlapping adjacent blocks blend like a continuous woven lattice
  const maskGradient = isFirst
    ? "linear-gradient(to bottom, transparent 0%, transparent 18%, rgba(0, 0, 0, 0.4) 38%, black 65%, black 85%, transparent 100%)"
    : isLast
    ? "linear-gradient(to bottom, transparent 0%, black 30%)"
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
          threadCount={3}
          spread={0.18}
          lightMode={false}
          speed={0.1}
          frequency={5}
          taper={1.3}
          position={0.5}
          pinch={0.5}
          nodes={1}
          angle={angle}
          glow={0.02}
          falloff={0.6}
          thickness={1.3}
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
        />
      )}
    </div>
  );
}

export default function UnifiedRibbonBackground({ totalHeight }: { totalHeight: number }) {
  const STEP = 850; // Each ribbon block advances 850px down the page
  const BLOCK_HEIGHT = 1100; // 250px vertical overlap with adjacent blocks for seamless blending

  const count = Math.max(1, Math.ceil(totalHeight / STEP));

  const blocks = Array.from({ length: count }, (_, i) => ({
    top: i * STEP,
    height: BLOCK_HEIGHT,
    angle: i % 2 === 0 ? -34 : 34,
    isFirst: i === 0,
    isLast: i === count - 1,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {blocks.map((block, idx) => (
        <RibbonBlock
          key={idx}
          top={block.top}
          height={block.height}
          angle={block.angle}
          isFirst={block.isFirst}
          isLast={block.isLast}
        />
      ))}
    </div>
  );
}
