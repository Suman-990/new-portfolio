"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FooterRevealProps {
  children?: ReactNode;
  contact?: ReactNode;
  footer?: ReactNode;
}

export default function FooterReveal({ children, contact, footer }: FooterRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contactWrapperRef = useRef<HTMLDivElement>(null);
  const contactInnerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const footerWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const contactWrapper = contactWrapperRef.current;
    const contactInner = contactInnerRef.current;
    const footerWrapper = footerWrapperRef.current;
    const overlay = overlayRef.current;
    const container = containerRef.current;

    if (!contactWrapper || !contactInner || !footerWrapper || !container) return;

    let ctx: gsap.Context | null = null;

    const setupScrollAnimation = () => {
      ctx = gsap.context(() => {
        // Kill existing triggers on this element if any
        ScrollTrigger.getAll().forEach((st) => {
          if (st.vars.id === "footer-reveal-pin") {
            st.kill();
          }
        });

        const footerHeight = footerWrapper.offsetHeight || 480;
        // 160px resting threshold so scrolling from above settles completely at Contact
        const restBuffer = 160;
        const totalDistance = footerHeight + restBuffer;

        // Initial setup for footer sheet: fixed at bottom, translated 100% off-screen
        gsap.set(footerWrapper, {
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          yPercent: 100,
          autoAlpha: 0,
          pointerEvents: "none",
        });

        // Scrub timeline linked with Lenis smooth scroll — NO automatic timer snap
        const tl = gsap.timeline({
          scrollTrigger: {
            id: "footer-reveal-pin",
            trigger: contactWrapper,
            start: "bottom bottom",
            end: () => `+=${totalDistance}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.6, // Direct 1:1 user-driven scroll with Lenis inertia
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Hide footer when in the resting contact zone to keep contact 100% clean
              if (self.progress > 0.08) {
                gsap.set(footerWrapper, { autoAlpha: 1 });
              } else {
                gsap.set(footerWrapper, { autoAlpha: 0 });
              }

              // Only enable footer interactions once it is substantially visible
              if (self.progress > 0.65) {
                footerWrapper.style.pointerEvents = "auto";
              } else {
                footerWrapper.style.pointerEvents = "none";
              }
            },
            onToggle: (self) => {
              if (self.isActive && self.progress > 0.08) {
                gsap.set(footerWrapper, { autoAlpha: 1 });
              } else if (!self.isActive && self.progress === 0) {
                gsap.set(footerWrapper, { autoAlpha: 0, pointerEvents: "none" });
              }
            },
          },
        });

        // Phase 1 (0 to 0.25): Resting hold zone where Contact is 100% un-obscured
        tl.set({}, {}, 0.25);

        // Phase 2 (0.25 to 1.0): Only when the user deliberately scrolls further does footer rise
        tl.fromTo(
          footerWrapper,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.75,
            ease: "power1.inOut",
          },
          0.25
        );

        // Contact gently recedes back in 3D perspective during Phase 2
        tl.fromTo(
          contactInner,
          { scale: 1, filter: "brightness(1) blur(0px)" },
          {
            scale: 0.94,
            filter: "brightness(0.42) blur(1.5px)",
            transformOrigin: "center 65%",
            duration: 0.75,
            ease: "power1.inOut",
          },
          0.25
        );

        // Soft darkening overlay deepens behind the rising footer
        if (overlay) {
          tl.fromTo(
            overlay,
            { opacity: 0 },
            {
              opacity: 0.68,
              duration: 0.75,
              ease: "power1.inOut",
            },
            0.25
          );
        }
      }, container);

      ScrollTrigger.refresh();
    };

    const timer = setTimeout(setupScrollAnimation, 140);

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="footer-reveal-wrapper relative w-full overflow-visible">
      {/* Pinned Contact Container */}
      <div
        ref={contactWrapperRef}
        className="contact-pin-target relative w-full z-10 will-change-transform"
      >
        <div ref={contactInnerRef} className="contact-inner-scale relative w-full will-change-transform">
          {contact}
        </div>

        {/* Ambient Depth & Blur Overlay that deepens as the Footer climbs over */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[#07080c]/60 pointer-events-none opacity-0 z-20 backdrop-blur-[1px] transition-opacity duration-300"
          style={{ willChange: "opacity" }}
        />
      </div>

      {/* Enhanced Footer Sheet that slides UP from bottom of the screen ON TOP OF Contact */}
      <div
        ref={footerWrapperRef}
        className="footer-sheet-target will-change-transform"
      >
        {footer}
      </div>

      {children}
    </div>
  );
}
