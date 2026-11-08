"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prefer reduced motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis smooth scroll with responsive, organic inertia
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger & progress bar
    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${e.progress})`;
      }
      window.dispatchEvent(new CustomEvent("lenis-scroll", { detail: e }));
    });

    // Run GSAP ticker with Lenis requestAnimationFrame
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll for all internal anchor links (e.g., #home, #skills, #projects, #timeline, #contact)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -30,
            duration: 1.35,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  return (
    <>
      {/* Sleek Minimalist Top Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left pointer-events-none will-change-transform"
        style={{
          background: "linear-gradient(90deg, #38bdf8 0%, #60a5fa 50%, #818cf8 100%)",
          transform: "scaleX(0)",
          boxShadow: "0 0 10px rgba(56, 189, 248, 0.7)",
        }}
        aria-hidden="true"
      />
      {children}
    </>
  );
}
