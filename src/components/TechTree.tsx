import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Cpu } from "lucide-react";
import "./TechTree.css";

interface TechItem {
  id: string;
  name: string;
  image: string;
  x: number;
  y: number;
  floatClass: "float-anim" | "float-anim-alt";
}

const CENTER_X = 450;
const CENTER_Y = 260;

function getPathD(x: number, y: number, cx = CENTER_X, cy = CENTER_Y): string {
  if (Math.abs(x - cx) < 5) {
    const cpY1 = cy + (y - cy) * 0.45;
    const cpY2 = cy + (y - cy) * 0.75;
    return `M ${cx} ${cy} C ${cx} ${cpY1.toFixed(1)}, ${x} ${cpY2.toFixed(1)}, ${x} ${y}`;
  }
  const dx = x - cx;
  const dy = y - cy;
  const cpX1 = cx + dx * 0.45;
  const cpY1 = cy + dy * 0.05;
  const cpX2 = x - dx * 0.25;
  const cpY2 = y;
  return `M ${cx} ${cy} C ${cpX1.toFixed(1)} ${cpY1.toFixed(1)}, ${cpX2.toFixed(1)} ${cpY2.toFixed(1)}, ${x} ${y}`;
}

const TECH_NODES_DATA: Omit<TechItem, "floatClass">[] = [
  // Apex / Container
  { id: "docker", name: "Docker", image: "/docker_transparent.png", x: 450, y: 65 },

  // Left Branch (Frontend, Client, Tools)
  { id: "git", name: "Git", image: "/git_transparent.png", x: 130, y: 75 },
  { id: "github", name: "GitHub", image: "/github_transparent.png", x: 100, y: 185 },
  { id: "react", name: "React", image: "/react_transparent.png", x: 295, y: 135 },
  { id: "javascript", name: "JavaScript", image: "/javascript_transparent.png", x: 265, y: 260 },
  { id: "nodejs", name: "Node.js", image: "/nodeJS_transparent.png", x: 295, y: 385 },
  { id: "firebase", name: "Firebase", image: "/firebase_transparent.png", x: 100, y: 335 },
  { id: "prisma", name: "Prisma", image: "/prisma_transparent.png", x: 130, y: 445 },

  // Right Branch (Backend, Cloud, Databases)
  { id: "aws", name: "AWS", image: "/aws_transparent.png", x: 770, y: 75 },
  { id: "kafka", name: "Kafka", image: "/kafka_transparent.png", x: 800, y: 185 },
  { id: "golang", name: "Golang", image: "/golang_transparent.png", x: 605, y: 135 },
  { id: "java", name: "Java", image: "/java_transparent.png", x: 635, y: 260 },
  { id: "springboot", name: "Spring Boot", image: "/springboot_transparent.png", x: 605, y: 385 },
  { id: "postgresql", name: "PostgreSQL", image: "/pgSQL_transparent.png", x: 800, y: 335 },
  { id: "mongodb", name: "MongoDB", image: "/mongoDB_transparent.png", x: 770, y: 445 },
];

const TECH_NODES: (TechItem & { pathD: string })[] = TECH_NODES_DATA.map((node, i) => ({
  ...node,
  floatClass: i % 2 === 0 ? "float-anim" : "float-anim-alt",
  pathD: getPathD(node.x, node.y),
}));

interface TechTreeProps {
  isVisible?: boolean;
  className?: string;
}

export default function TechTree({ isVisible = true, className = "" }: TechTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isVisible) return;

    const ctx = gsap.context(() => {
      // 1. Initial Reveal Timeline
      const tl = gsap.timeline();

      // Measure & set path lengths for draw-in animation
      const paths = container.querySelectorAll<SVGPathElement>(".line-path");
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      tl.from(".gsap-fade", { opacity: 0, duration: 0.8, ease: "power2.out" })
        .from(
          ".gsap-scale",
          { scale: 0, opacity: 0, duration: 1.1, ease: "back.out(1.2)" },
          "-=0.6"
        )
        .from(
          ".gsap-pop",
          {
            scale: 0,
            rotation: -25,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(2)",
          },
          "-=0.5"
        )
        .to(
          ".line-path",
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.inOut",
            stagger: { amount: 0.35, from: "center" },
          },
          "-=0.3"
        )
        .from(
          ".icon-node",
          {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.04,
            ease: "back.out(1.5)",
          },
          "-=1.0"
        );

      // 2. Continuous Organic Floating
      const floatNodes = container.querySelectorAll<HTMLElement>(".float-anim");
      floatNodes.forEach((node, i) => {
        gsap.to(node, {
          y: "-=7",
          rotation: "1.5",
          duration: 2.4 + (i % 5) * 0.25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.08,
        });
      });

      const floatAltNodes = container.querySelectorAll<HTMLElement>(".float-anim-alt");
      floatAltNodes.forEach((node, i) => {
        gsap.to(node, {
          y: "+=7",
          rotation: "-1.5",
          duration: 2.7 + (i % 5) * 0.25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.1,
        });
      });

      const floatSlow = container.querySelector<HTMLElement>(".float-slow");
      if (floatSlow) {
        gsap.to(floatSlow, {
          y: "-=5",
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 3. Hover expansion on nodes via GSAP
      const nodes = container.querySelectorAll<HTMLElement>(".icon-node");
      nodes.forEach((node) => {
        const enter = () => {
          gsap.to(node, {
            scale: 1.16,
            duration: 0.3,
            ease: "back.out(2)",
            overwrite: "auto",
          });
        };
        const leave = () => {
          gsap.to(node, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        node.addEventListener("mouseenter", enter);
        node.addEventListener("mouseleave", leave);
      });
    }, container);

    return () => ctx.revert();
  }, [isVisible]);

  return (
    <div ref={containerRef} className={`tech-tree-container ${className}`}>
      <div className="tech-tree-wrapper">
        {/* Concentric Circles behind the core */}
        <div className="tech-tree__circles gsap-scale" />

        {/* Connecting SVG Curves */}
        <svg
          className="lines-svg absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 900 520"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow filter for active path and socket */}
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glowing radial gradient for center aura */}
            <radialGradient id="centerAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Center glow aura */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={130}
            fill="url(#centerAura)"
            className="gsap-scale"
          />

          {/* SVG Connecting Paths */}
          {TECH_NODES.map((node, i) => {
            const isHovered = hoveredIndex === i;
            const isAnyHovered = hoveredIndex !== null && hoveredIndex >= 0;

            return (
              <g key={`path-${node.id}`}>
                {/* Glow underlay when hovered */}
                {isHovered && (
                  <path
                    d={node.pathD}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth={4.5}
                    strokeLinecap="round"
                    filter="url(#lineGlow)"
                    opacity={0.85}
                  />
                )}

                {/* Primary path */}
                <path
                  className="line-path"
                  d={node.pathD}
                  fill="none"
                  stroke={isHovered ? "#38bdf8" : "rgba(255, 255, 255, 0.22)"}
                  strokeWidth={isHovered ? 2.5 : 1.4}
                  strokeLinecap="round"
                  opacity={isHovered ? 1 : isAnyHovered ? 0.12 : 0.5}
                />

                {/* Socket dot at the node connection */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 4.5 : 2.5}
                  fill={isHovered ? "#38bdf8" : "rgba(255, 255, 255, 0.45)"}
                  filter={isHovered ? "url(#lineGlow)" : undefined}
                  style={{ transition: "all 0.3s ease" }}
                />
              </g>
            );
          })}
        </svg>

        {/* Central Core Hub (Brain Replacement) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-auto cursor-pointer group"
          onMouseEnter={() => setHoveredIndex(-1)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="tech-core gsap-pop float-slow relative flex items-center justify-center">
            {/* Ambient cyber pulse aura */}
            <div className="absolute -inset-4 rounded-full bg-sky-500/20 blur-xl animate-pulse pointer-events-none" />

            {/* Rotating micro-ring */}
            <div className="absolute -inset-2 rounded-full border border-sky-400/20 border-t-sky-400/70 animate-spin [animation-duration:10s] pointer-events-none" />

            {/* 3D clay hub body */}
            <div className="relative flex h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#242936] to-[#0f1117] border border-sky-500/30 shadow-[0_12px_28px_rgba(0,0,0,0.8),inset_1.5px_1.5px_3px_rgba(255,255,255,0.2),inset_-1.5px_-1.5px_4px_rgba(0,0,0,0.9),0_0_24px_rgba(56,189,248,0.25)] transition-transform duration-300 group-hover:scale-110">
              <Cpu className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
            </div>

            {/* Tooltip */}
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#101216]/95 border border-sky-500/30 text-[10px] font-mono text-sky-300 uppercase tracking-wider whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Stack Core
            </span>
          </div>
        </div>

        {/* 15 Tech Stack Floating Nodes */}
        {TECH_NODES.map((node, i) => {
          const isHovered = hoveredIndex === i;
          const leftPct = (node.x / 900) * 100;
          const topPct = (node.y / 520) * 100;

          return (
            <div
              key={node.id}
              className={`icon-node ${node.floatClass} absolute -translate-x-1/2 -translate-y-1/2 z-20 group`}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`tech-tree__node-card w-8 h-8 sm:w-11 sm:h-11 md:w-[52px] md:h-[52px] rounded-lg sm:rounded-xl md:rounded-[14px] ${
                  isHovered ? "border-sky-400/80 shadow-[0_16px_32px_rgba(0,0,0,0.85),0_0_22px_rgba(56,189,248,0.4),inset_1px_1px_3px_rgba(255,255,255,0.25)]" : ""
                }`}
              >
                <img
                  src={node.image}
                  alt={node.name}
                  className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 object-contain filter drop-shadow select-none pointer-events-none transition-transform duration-300 group-hover:scale-110"
                  draggable={false}
                />

                {/* Micro tech name tooltip */}
                <div
                  className={`absolute ${
                    node.y < 120 ? "-bottom-7" : "-top-7"
                  } left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#101216]/95 border border-border-strong text-[10px] sm:text-[11px] font-mono text-paper font-medium whitespace-nowrap shadow-xl pointer-events-none transition-all duration-200 z-30 ${
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                  }`}
                >
                  {node.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
