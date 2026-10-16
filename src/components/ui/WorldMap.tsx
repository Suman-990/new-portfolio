import { useMemo } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";

interface WorldMapProps {
  locationText?: string;
  lat?: number;
  lng?: number;
  className?: string;
}

export function WorldMap({
  locationText = "I am here",
  lat = 22.8,
  lng = 86.2,
  className = "",
}: WorldMapProps) {
  // Generate dotted map SVG string once with diagonal dot pattern
  const { svgMap, pinXPct, pinYPct } = useMemo(() => {
    const map = new DottedMap({ height: 60, grid: "diagonal" });
    const pin = map.getPin({ lat, lng }) ?? { x: 90.5, y: 27.71 };

    const svg = map.getSVG({
      radius: 0.35,
      color: "rgba(255, 255, 255, 0.65)",
      shape: "circle",
      backgroundColor: "transparent",
    });

    // height: 60 produces viewBox="0 0 119 60"
    const pinXPct = (pin.x / 119) * 100;
    const pinYPct = (pin.y / 60) * 100;

    return { svgMap: svg, pinXPct, pinYPct };
  }, [lat, lng]);

  return (
    <div
      className={`relative z-20 w-full flex items-center justify-center select-none [isolation:isolate] pt-4 sm:pt-0 ${className}`}
      style={{ perspective: "1000px" }}
    >
      {/* 3D Tilted Map Plane */}
      <div
        className="relative z-10 w-full aspect-[119/60] flex items-center justify-center [transform-style:preserve-3d]"
        style={{
          transform: "rotateX(12deg) scale(1.02)",
        }}
      >
        {/* Dotted Map Image with natural edge fade and drop-shadow to pop above background ribbons */}
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          alt="World Map"
          draggable={false}
          className="relative z-10 w-full h-full object-contain pointer-events-none select-none [mask-image:radial-gradient(ellipse_94%_88%_at_50%_50%,black_45%,transparent_95%)] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
        />

        {/* Location Beacon Anchor directly over India */}
        <div
          className="absolute z-20 w-0 h-0"
          style={{
            left: `${pinXPct}%`,
            top: `${pinYPct}%`,
          }}
        >
          {/* Ground Radar Base: Perspective-matched Ellipse perfectly centered at anchor */}
          <svg
            viewBox="-60 -25 120 50"
            className="absolute -translate-x-1/2 -translate-y-1/2 w-28 h-12 pointer-events-none overflow-visible"
          >
            <defs>
              <radialGradient id="beacon-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.65" />
                <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Static Glowing Base Ellipse */}
            <ellipse
              cx="0"
              cy="0"
              rx="30"
              ry="11"
              fill="url(#beacon-glow)"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeOpacity="0.85"
            />

            {/* Pulsing Ripple 1 */}
            <ellipse
              cx="0"
              cy="0"
              rx="18"
              ry="7"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.2"
            >
              <animate
                attributeName="rx"
                values="10; 40; 50"
                dur="2.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="ry"
                values="4; 15; 19"
                dur="2.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9; 0.4; 0"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Pulsing Ripple 2 (Staggered) */}
            <ellipse
              cx="0"
              cy="0"
              rx="18"
              ry="7"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1"
            >
              <animate
                attributeName="rx"
                values="10; 40; 50"
                dur="2.8s"
                begin="1.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="ry"
                values="4; 15; 19"
                dur="2.8s"
                begin="1.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9; 0.4; 0"
                dur="2.8s"
                begin="1.2s"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Center Anchor Dot */}
            <ellipse cx="0" cy="0" rx="3.5" ry="1.8" fill="#38bdf8" />
            <ellipse cx="0" cy="0" rx="1.8" ry="0.9" fill="#ffffff" />
          </svg>

          {/* Upright Vertical Laser Beam rising straight up from center (y = 0) */}
          <div className="absolute bottom-0 left-0 -translate-x-1/2 w-px h-14 sm:h-16 pointer-events-none">
            {/* Outer Cyan Glow Layer */}
            <div className="absolute inset-0 w-[2px] -left-[0.5px] bg-gradient-to-t from-cyan-400 via-sky-400 to-sky-200 blur-[1.5px]" />
            {/* Core Crisp Beam */}
            <div className="absolute inset-0 w-px bg-gradient-to-t from-cyan-300 via-sky-200 to-white shadow-[0_0_8px_#38bdf8]" />
          </div>

          {/* Floating Tooltip Pill: "I am here" positioned directly atop the vertical beam */}
          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-14 sm:bottom-16 left-0 -translate-x-1/2 mb-0.5 pointer-events-none"
          >
            <div className="relative px-3 py-1 rounded-xl bg-[#18181b]/95 border border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_12px_rgba(56,189,248,0.35)] backdrop-blur-md flex items-center justify-center">
              <span className="text-white text-xs font-medium tracking-wide whitespace-nowrap">
                {locationText}
              </span>

              {/* Laser Attachment Point Glow */}
              <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-5 h-[2px] bg-cyan-400 blur-[1px]" />
              <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-2.5 h-[1px] bg-white" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default WorldMap;
