import { WorldMap } from "./ui/WorldMap";
import OrbitImages, { type OrbitImageItem } from "./ui/OrbitImages";
import ShapeGrid from "./ui/ShapeGrid";
import { motion } from "motion/react";

interface ContactProfile extends OrbitImageItem {
  id: string;
  name: string;
  handle: string;
  url: string;
  accent: string;
  bg: string;
  description: string;
}

const PROFILES: ContactProfile[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "in/suman990",
    url: "https://www.linkedin.com/in/suman990",
    src: "/LinkedIn_icon.svg.webp",
    accent: "#0a66c2",
    bg: "#0d1b2a",
    description: "Professional Network & Career",
    iconPadding: "16%",
  },
  {
    id: "github",
    name: "GitHub",
    handle: "@Suman-990",
    url: "https://github.com/Suman-990",
    src: "/github.svg",
    accent: "#3b82f6",
    bg: "#18181b",
    description: "Open Source Codebases & Repos",
    iconPadding: "18%",
  },
  {
    id: "leetcode",
    name: "LeetCode",
    handle: "@Suman_990",
    url: "https://leetcode.com/u/Suman_990/",
    src: "/leetcode.webp",
    accent: "#ffa116",
    bg: "#221c16",
    description: "300+ Solved • Algorithms & DSA",
    iconPadding: "16%",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    handle: "+91 9064961649",
    url: "https://wa.me/919064961649",
    src: "/whatsapp.svg",
    accent: "#25d366",
    bg: "#0c281e",
    description: "Direct Messaging & Fast Chat",
    iconPadding: "16%",
  },
  {
    id: "email",
    name: "Email",
    handle: "sumanmahanty.99@gmail.com",
    url: "mailto:sumanmahanty.99@gmail.com",
    src: "/email.svg",
    accent: "#ea4335",
    bg: "#2a1515",
    description: "Official Collaborations & Work",
    iconPadding: "16%",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative w-full min-h-[92vh] lg:min-h-screen flex flex-col justify-between py-12 sm:py-16 pb-10 sm:pb-14 text-paper bg-transparent overflow-hidden"
    >
      {/* Dynamic Interactive ShapeGrid Background (Blended smoothly with website theme) */}
      <div
        className="absolute inset-0 z-0 pointer-events-auto select-none"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 12%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.85) 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 12%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.85) 88%, transparent 100%)",
        }}
      >
        <ShapeGrid
          shape="square"
          direction="diagonal"
          lineColor="rgba(37, 99, 235, 0.08)"
          hoverColor="#3b82f6"
          hoverFillColor="rgba(37, 99, 235, 0.16)"
          fillOpacity={0.15}
          cellSize={42}
          speed={0.35}
          tiltX={0}
          tiltY={0}
          rainbow={false}
          lineWidth={1}
          radius={1.5}
          trail={0.6}
          glow={0.35}
          twinkle={0}
          fade={1}
          clickCascade
          intro
        />
      </div>

      <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pointer-events-none flex-1 flex flex-col justify-between">
        {/* Section Heading */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 sm:mb-8 pointer-events-auto"
        >
          <p className="text-xs sm:text-sm font-mono tracking-wider text-blue-500 uppercase mb-1.5 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
            Have an interesting idea ? Let&apos;s talk about it
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            CONTACT.
          </h2>
        </motion.header>

        {/* Two-Column Grid: Dotted World Map (Left) + 3D Orbit Profiles (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-16 items-center relative z-20 pointer-events-auto">
          {/* Left Column: 3D Dotted World Map (Shifted to the left & expanded) */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-70px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center items-start w-full relative z-20"
          >
            <WorldMap
              locationText="I am here"
              lat={22.8}
              lng={86.2}
              className="w-full max-w-[680px] lg:max-w-none"
            />
          </motion.div>

          {/* Right Column: 3D Orbit Profiles (Shifted to the right & expanded) */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-70px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center w-full relative z-20"
          >
            <div className="w-full max-w-[620px] lg:ml-auto flex flex-col items-center">
              <OrbitImages
                images={PROFILES}
                shape="ellipse"
                radiusX={340}
                radiusY={130}
                rotation={-8}
                duration={30}
                itemSize={70}
                depth={0.55}
                showPath={true}
                pathColor="rgba(37, 99, 235, 0.28)"
                pathDash={4}
                pathWidth={1.5}
                hoverScale={1.16}
                hoverSpeed={0}
                draggable={true}
                clickToFront={true}
                intro={false}
                className="w-full"
              />

              {/* Visually appealing 'Socials' indicator */}
              <div className="w-full flex flex-col items-center justify-center mt-3 sm:mt-5 select-none pointer-events-auto">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-blue-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(37,99,235,0.18)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.9)]" />
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500">
                    Socials
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Bouncing Arrow Indicator at the bottom of Contact */}
        <div className="w-full flex justify-center mt-6 sm:mt-10 pb-2 select-none pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              if (window.__lenis) {
                const footerEl = document.querySelector("#footer") as HTMLElement | null;
                const scrollDist = footerEl ? footerEl.offsetHeight + 180 : 550;
                window.__lenis.scrollTo(window.__lenis.scroll + scrollDist, {
                  duration: 1.25,
                  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                });
              }
            }}
            className="arrow bounce focus:outline-none"
            aria-label="Scroll down to reveal footer"
          />
        </div>
      </div>
    </section>
  );
}
