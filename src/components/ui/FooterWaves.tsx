import React from "react";
import "./FooterWaves.css";

interface FooterWavesProps {
  onScrollToTop?: () => void;
}

/**
 * Liquid Wave Footer Header
 * Multi-layered SVG wave animation based on Uwe Chardon's fluid gooey concept,
 * customized to the portfolio's cybernetic electric-blue theme.
 * Contained in height so it never pushes or obscures the footer navigation.
 */
export default function FooterWaves({ onScrollToTop }: FooterWavesProps) {
  const handleScrollToTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
      return;
    }

    if (typeof window !== "undefined") {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, {
          duration: 1.45,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleScrollToTop();
    }
  };

  return (
    <div className="footer-wave-wrap" aria-hidden="false">
      <svg
        className="footer-wave-svg"
        viewBox="0 0 120 28"
        preserveAspectRatio="none"
        role="img"
        aria-label="Interactive fluid wave banner"
      >
        <defs>
          {/* SVG Metaball Gooey Filter for organic liquid droplet detachment */}
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 13 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>

          {/* Seamless Front Wave Shading - deep electric crest merging into #090c15 */}
          <linearGradient id="wave1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#0f172a" stopOpacity="0.98" />
            <stop offset="75%" stopColor="#090c15" />
            <stop offset="100%" stopColor="#090c15" />
          </linearGradient>

          {/* Rhythmic 6-cycle wave path: 3 cycles visible across 120-unit viewBox */}
          <path
            id="wave"
            d="M 0,10 C 10,10 10,15 20,15 30,15 30,10 40,10 50,10 50,15 60,15 70,15 70,10 80,10 90,10 90,15 100,15 110,15 110,10 120,10 130,10 130,15 140,15 150,15 150,10 160,10 170,10 170,15 180,15 190,15 190,10 200,10 210,10 210,15 220,15 230,15 230,10 240,10 v 28 h -240 z"
          />
        </defs>

        {/* Layer 3: Back Wave - Ethereal Neon Sky Blue */}
        <use id="wave3" className="footer-wave wave-back" href="#wave" x="0" y="-2" />

        {/* Layer 2: Middle Wave - Royal Electric Blue */}
        <use id="wave2" className="footer-wave wave-mid" href="#wave" x="0" y="0" />

        {/* Layer 1: Front Wave with Fluid Gooey Droplets */}
        <g className="gooeff">
          <circle className="drop drop1" cx="20" cy="2" r="1.4" />
          <circle className="drop drop2" cx="60" cy="2.5" r="1.3" />
          <circle className="drop drop3" cx="100" cy="2.8" r="1.2" />
          <use id="wave1" className="footer-wave wave-front" href="#wave" x="0" y="1" />
        </g>
      </svg>

      {/* Floating Interactive Beacon: Back to Top Orb */}
      <div className="footer-topball-wrapper">
        <button
          type="button"
          onClick={handleScrollToTop}
          onKeyDown={handleKeyDown}
          className="footer-topball-btn"
          title="Back to top"
          aria-label="Scroll back to top"
        >
          <svg
            viewBox="0 0 16 16"
            className="topball-arrow-icon"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M8 12V4M4 7.5L8 3.5L12 7.5"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
