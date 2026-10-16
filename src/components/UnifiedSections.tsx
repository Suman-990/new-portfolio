import { useEffect, useRef, useState, type ReactNode } from "react";
import UnifiedRibbonBackground from "./ui/UnifiedRibbonBackground";

export default function UnifiedSections({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalHeight, setTotalHeight] = useState(6000);

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
      className="relative w-screen overflow-hidden bg-onyx ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]"
    >
      {/* Unified repeating ribbon background layer across all combined sections */}
      <UnifiedRibbonBackground totalHeight={totalHeight} />

      {/* Foreground sections */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
