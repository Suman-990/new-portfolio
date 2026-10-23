import WebThreads from "./WebThreads";

export interface RibbonBackgroundProps {
  angle?: number;
  className?: string;
  opacity?: number;
  speed?: number;
  blur?: number;
  thickness?: number;
}

export default function RibbonBackground({
  angle = -34,
  className = "",
  opacity = 0.55,
  speed = 0.11,
  blur = 25,
  thickness = 4.8,
}: RibbonBackgroundProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <WebThreads
        colors={["#5227FF", "#002fff"]}
        coreColor="#1d4ed8"
        threadCount={3}
        spread={0.24}
        lightMode={false}
        speed={speed}
        frequency={4.5}
        taper={1.3}
        position={0.5}
        pinch={0.5}
        nodes={1}
        angle={angle}
        glow={0.022}
        falloff={0.48}
        thickness={thickness}
        brightness={0.72}
        opacity={1}
        blur={blur}
        depth={0}
        pulses={0}
        mirror
        shimmer={false}
        fade={0}
        grain={0.04}
        intro={false}
        mouseInteraction
        mouseStrength={0.3}
        pulseOnClick={false}
        paused={false}
      />
    </div>
  );
}
