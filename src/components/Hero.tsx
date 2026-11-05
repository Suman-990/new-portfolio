import { useState, useEffect } from "react"
import { ArrowDown, MapPin, Download, ArrowUpRight } from "lucide-react"
import HeroParticleImage from "./HeroParticleImage"
import HeroTypingName from "./ui/HeroTypingName"
import AnimatedCounter from "./ui/AnimatedCounter"
import TypingStat from "./ui/TypingStat"

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return true
    }
    return false
  })

  useEffect(() => {
    if (isLoaded) return
    const timeout = setTimeout(() => {
      setIsLoaded(true)
    }, 60)
    return () => clearTimeout(timeout)
  }, [isLoaded])

  const scrollToWork = () => {
    const el = document.getElementById("skills") || document.getElementById("projects")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Helper for sequential entrance transitions
  const getStaggerStyle = (delayMs: number): React.CSSProperties => ({
    transitionDuration: "750ms",
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delayMs}ms`,
  })

  const getStaggerClasses = () =>
    `transition-all will-change-[opacity,transform,filter] ${
      isLoaded
        ? "opacity-100 translate-y-0 scale-100 blur-none"
        : "opacity-0 translate-y-4 scale-[0.98] blur-[4px] pointer-events-none"
    }`

  return (
    <section
      id="home"
      className="relative w-full min-h-[92vh] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#07080c] text-white pt-6 sm:pt-8 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-12 selection:bg-blue-600 selection:text-white"
    >
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[550px] sm:h-[700px] rounded-full blur-[140px] opacity-40 z-0 transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(37,99,235,0.38) 0%, rgba(20,55,140,0.18) 45%, transparent 75%)",
          opacity: isLoaded ? 0.4 : 0.1,
        }}
        aria-hidden="true"
      />

      {/* Subtle Technical Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] [background-size:24px_24px] z-0"
        aria-hidden="true"
      />

      {/* TOP ROW: Role Badges (Left) & Availability Status (Right) */}
      <div className="relative z-30 flex flex-row items-start justify-between w-full max-w-7xl mx-auto gap-4">
        {/* Left: Role Badges (Stagger #1: 100ms) */}
        <div
          className={`flex flex-col sm:flex-row items-start gap-2 ${getStaggerClasses()}`}
          style={getStaggerStyle(100)}
        >
          <span className="inline-block bg-blue-600 text-white font-mono text-[10px] sm:text-[11px] font-bold tracking-wider px-2.5 py-1 uppercase shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            FULL-STACK DEVELOPER
          </span>
          <span className="inline-block bg-blue-600 text-white font-mono text-[10px] sm:text-[11px] font-bold tracking-wider px-2.5 py-1 uppercase shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            SOFTWARE ENGINEER
          </span>
        </div>

        {/* Right: Availability Badge (Stagger #2: 200ms) */}
        <div
          className={`flex items-center gap-2 bg-neutral-900/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm ${getStaggerClasses()}`}
          style={getStaggerStyle(200)}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-neutral-300 font-medium">
            AVAILABLE FOR COLLABORATION
          </span>
        </div>
      </div>

      {/* MAIN HERO CONTENT STAGE */}
      <div className="relative z-10 w-full max-w-7xl mx-auto my-auto py-6 sm:py-8 lg:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center relative min-h-[580px] lg:min-h-[640px]">
          {/* LEFT COLUMN: Headline, Roles, Bio, CTA, Location */}
          <div className="lg:col-span-4 flex flex-col justify-center text-left relative z-20 order-2 lg:order-1 pt-4 lg:pt-0">
            {/* Cursive Greeting (Stagger #5: 680ms) */}
            <p
              className={`text-2xl sm:text-3xl lg:text-[34px] text-white tracking-wide font-normal -rotate-2 origin-left inline-block mb-1 select-none ${getStaggerClasses()}`}
              style={{
                fontFamily: "'Caveat', cursive",
                ...getStaggerStyle(680),
              }}
            >
              Hello, I&apos;m
            </p>

            {/* Giant Monolithic Name with Typing Animation (Stagger #6: 800ms) */}
            <HeroTypingName
              name="SUMAN"
              isStarted={isLoaded}
              delayMs={820}
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white uppercase leading-[0.88] select-none ${getStaggerClasses()}`}
              style={getStaggerStyle(800)}
            />

            {/* Sub-headline / Roles in Electric Blue (Stagger #7: 920ms) */}
            <div
              className={`mt-3 sm:mt-4 space-y-0.5 ${getStaggerClasses()}`}
              style={getStaggerStyle(920)}
            >
              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight text-blue-500 uppercase leading-none">
                FULL-STACK &amp;
              </h2>
              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight text-blue-500 uppercase leading-none">
                SYSTEMS DEVELOPER
              </h2>
            </div>

            {/* Brief Bio (Stagger #8: 1040ms) */}
            <p
              className={`mt-5 sm:mt-6 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed max-w-sm ${getStaggerClasses()}`}
              style={getStaggerStyle(1040)}
            >
              Architecting scalable web platforms, resilient distributed systems, and
              interactive digital experiences from concept to production.
            </p>

            {/* Action CTA Button (Stagger #9: 1160ms) */}
            <div
              className={`mt-6 sm:mt-8 flex items-center gap-4 ${getStaggerClasses()}`}
              style={getStaggerStyle(1160)}
            >
              <button
                onClick={scrollToWork}
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase px-6 py-3.5 transition-all duration-200 shadow-[0_0_25px_rgba(37,99,235,0.45)] group cursor-pointer"
              >
                <span>View My Work</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>
            </div>

            {/* Location Tag (Stagger #10: 1260ms) */}
            <div
              className={`mt-5 sm:mt-6 flex items-center gap-2 text-neutral-400 text-[11px] sm:text-xs font-mono uppercase tracking-widest ${getStaggerClasses()}`}
              style={getStaggerStyle(1260)}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Jamshedpur, India</span>
            </div>
          </div>

          {/* CENTER COLUMN: Anime Hero Portrait standing in front of signature */}
          <div className="lg:col-span-4 flex items-end justify-center relative z-10 order-1 lg:order-2 h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[600px]">
            {/*
              CALLIGRAPHY SIGNATURE LAYER (BEHIND HERO IMAGE)
              Expands behind the character and overlaps smoothly into the stage
              (Stagger #3: 340ms)
            */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] md:w-[600px] lg:w-[820px] xl:w-[940px] max-w-none pointer-events-none select-none z-0 flex items-center justify-center ${getStaggerClasses()}`}
              style={getStaggerStyle(340)}
            >
              <img
                src="/suman-blue-signature.png"
                alt="Suman Blue Calligraphy Signature"
                className="w-full h-auto object-contain opacity-90 filter drop-shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-opacity duration-500"
              />
            </div>

            {/*
              ANIME HERO CHARACTER (IN FRONT OF SIGNATURE)
              Interactive Particle Assembly on entrance + Hover repulsion physics
              (Stagger #4: 500ms)
            */}
            <HeroParticleImage
              src="/Suman-anime-hero-transparent-centered.png"
              alt="Suman Mahanty Hero Character"
              className={`relative z-10 w-full flex items-end justify-center ${getStaggerClasses()}`}
              isLoaded={isLoaded}
              particleSize={7.5}
              interactionRadius={150}
            />
          </div>

          {/* RIGHT COLUMN: Philosophy Micro-quote, Key Stats, Download CV */}
          <div className="lg:col-span-4 flex flex-col justify-center lg:items-end text-left lg:text-right relative z-20 order-3 pt-2 lg:pt-0">
            <div className="w-full max-w-xs lg:ml-auto">
              {/* Philosophy Micro-quote with Starburst badge (Stagger #11: 1360ms) */}
              <div
                className={`flex items-start lg:justify-end gap-3 mb-6 sm:mb-8 ${getStaggerClasses()}`}
                style={getStaggerStyle(1360)}
              >
                <div className="w-7 h-7 shrink-0 rounded-full border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-bold shadow-[0_0_10px_rgba(37,99,235,0.25)]">
                  ✱
                </div>
                <div className="text-xs sm:text-sm text-neutral-300 font-sans leading-snug">
                  <p className="font-medium text-white">Every line of code.</p>
                  <p className="text-neutral-400">A scalable impact.</p>
                </div>
              </div>

              {/* Stats Stack with divider lines */}
              <div className="space-y-4 border-t border-white/10 pt-4">
                {/* Stat 1: Professional Experience (Stagger #12: 1480ms) */}
                <div
                  className={`flex items-baseline justify-between gap-4 pb-3 border-b border-white/10 group/stat cursor-pointer ${getStaggerClasses()}`}
                  style={getStaggerStyle(1480)}
                >
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-500 font-mono tracking-tight">
                    <AnimatedCounter
                      target={3}
                      suffix="+"
                      duration={750}
                      delayMs={1480}
                      isTriggered={isLoaded}
                    />
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400 text-right group-hover/stat:text-neutral-300 transition-colors">
                    Months of Professional Experience
                  </span>
                </div>

                {/* Stat 2: DSA Problems (Stagger #13: 1580ms) */}
                <div
                  className={`flex items-baseline justify-between gap-4 pb-3 border-b border-white/10 group/stat cursor-pointer ${getStaggerClasses()}`}
                  style={getStaggerStyle(1580)}
                >
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-500 font-mono tracking-tight">
                    <AnimatedCounter
                      target={800}
                      suffix="+"
                      duration={1300}
                      delayMs={1580}
                      isTriggered={isLoaded}
                    />
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400 text-right group-hover/stat:text-neutral-300 transition-colors">
                    DSA Problems Solved
                  </span>
                </div>

                {/* Stat 3: TechSprint Hackathon (Stagger #14: 1680ms) */}
                <div
                  onClick={() => window.open("https://www.instagram.com/p/DV8u--vD53-/?utm_source=ig_web_copy_link&rpxt=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==", "_blank")}
                  className={`flex items-baseline justify-between gap-4 pb-3 border-b border-white/10 cursor-pointer group/stat ${getStaggerClasses()}`}
                  style={getStaggerStyle(1680)}
                  title="View Hackathon Achievement"
                >
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-500 font-mono tracking-tight group-hover/stat:text-blue-400 transition-colors">
                    <TypingStat
                      text="1st"
                      delayMs={1680}
                      typingSpeed={150}
                      isTriggered={isLoaded}
                    />
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400 text-right flex items-center gap-1 group-hover/stat:text-blue-300 transition-colors">
                    <span>TechSprint Winner</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                  </span>
                </div>
              </div>

              {/* Download CV Link (Stagger #15: 1780ms) */}
              <div
                className={`pt-5 lg:text-right ${getStaggerClasses()}`}
                style={getStaggerStyle(1780)}
              >
                <a
                  href="/Suman_Mahanty_CV.pdf"
                  download="Suman_Mahanty_CV.pdf"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-semibold tracking-widest text-blue-400 hover:text-blue-300 transition-colors uppercase group"
                >
                  <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5 text-blue-500" />
                  <span>Download CV</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
