import { WorldMap } from "./ui/WorldMap";
import OrbitImages, { type OrbitImageItem } from "./ui/OrbitImages";
import ShapeGrid from "./ui/ShapeGrid";

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
    accent: "#38bdf8",
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
      className="relative w-full py-14 sm:py-20 pb-20 sm:pb-28 text-paper bg-transparent overflow-hidden"
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
          lineColor="rgba(56, 189, 248, 0.08)"
          hoverColor="#38bdf8"
          hoverFillColor="rgba(14, 165, 233, 0.12)"
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

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pointer-events-none">
        {/* Section Heading */}
        <header className="mb-6 sm:mb-10 pointer-events-auto">
          <p className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase mb-1">
            GLOBAL REACH / CONNECT
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            CONTACT.
          </h2>
        </header>

        {/* Two-Column Grid: Dotted World Map (Left) + 3D Orbit Profiles (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-16 items-center relative z-20 pointer-events-auto">
          {/* Left Column: 3D Dotted World Map (Shifted to the left & expanded) */}
          <div className="lg:col-span-6 flex flex-col justify-center items-start w-full relative z-20">
            <WorldMap
              locationText="I am here"
              lat={22.8}
              lng={86.2}
              className="w-full max-w-[680px] lg:max-w-none"
            />
          </div>

          {/* Right Column: 3D Orbit Profiles (Shifted to the right & expanded) */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center w-full relative z-20">
            <div className="w-full max-w-[620px] lg:ml-auto">
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
                pathColor="rgba(56, 189, 248, 0.22)"
                pathDash={4}
                pathWidth={1.5}
                hoverScale={1.16}
                hoverSpeed={0}
                draggable={true}
                clickToFront={true}
                intro={false}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
