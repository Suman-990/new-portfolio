import { useEffect, useRef, useState, type ReactNode } from "react";
import UnifiedRibbonBackground from "./ui/UnifiedRibbonBackground";

export default function UnifiedSections({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalHeight, setTotalHeight] = useState(6000);

  // Measure total height dynamically for continuous ribbon stack
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      setTotalHeight(el.offsetHeight);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-screen max-w-[100vw] overflow-hidden bg-[#07080c] ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]"
    >
      {/* Subtle top seam glow connecting hero to unified sections */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[120px] z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, #07080c 0%, rgba(7, 8, 12, 0.6) 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Unified repeating ribbon background layer across all combined sections */}
      <UnifiedRibbonBackground totalHeight={totalHeight} />

      {/* Foreground sections */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      {/* Subtle bottom seam gradient fading unified ribbon background smoothly into Contact */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[240px] z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(7, 8, 12, 0.4) 40%, rgba(7, 8, 12, 0.85) 75%, #07080c 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
