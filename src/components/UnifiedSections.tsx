import { useEffect, useRef, useState, type ReactNode } from "react";
import UnifiedRibbonBackground from "./ui/UnifiedRibbonBackground";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

export default function UnifiedSections({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);
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

  // Screen background fade animation (white -> matte black) driven by scrolling into Skills
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let lastT = -1;

    const updateScreenFade = () => {
      rafId = 0;
      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // When the top of UnifiedSections travels from bottom (viewportH * 0.85) to near top (viewportH * 0.15)
      // progress t goes smoothly from 0 (at Home/Hero) to 1 (inside Skills)
      const fadeStart = viewportH * 0.85;
      const fadeEnd = viewportH * 0.15;
      const rawProgress = 1 - clamp((rect.top - fadeEnd) / (fadeStart - fadeEnd), 0, 1);
      const t = smoothstep(rawProgress);

      // Skip redundant DOM style writes once saturated at 1 or 0
      if (Math.abs(t - lastT) < 0.001) return;
      lastT = t;

      // Smoothly interpolate body background color: #f5f4ef (245, 244, 239) -> #0a0a08 (10, 10, 8)
      const r = Math.round(245 + (10 - 245) * t);
      const g = Math.round(244 + (10 - 244) * t);
      const b = Math.round(239 + (8 - 239) * t);
      document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

      // Fade out the top gradient fade-border overlay as the whole screen converts to black
      if (fadeOverlayRef.current) {
        fadeOverlayRef.current.style.opacity = `${1 - t}`;
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(updateScreenFade);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateScreenFade();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-screen max-w-[100vw] overflow-hidden bg-onyx ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]"
    >
      {/* Top Fade Border: Smoothly transitions from the white paper background into matte black */}
      <div
        ref={fadeOverlayRef}
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, #f5f4ef 0%, rgba(245, 244, 239, 0.75) 25%, rgba(10, 10, 8, 0.35) 65%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Unified repeating ribbon background layer across all combined sections */}
      <UnifiedRibbonBackground totalHeight={totalHeight} />

      {/* Foreground sections */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
