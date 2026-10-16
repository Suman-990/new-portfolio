import WebThreads from "./WebThreads";

export interface RibbonBackgroundProps {
  angle?: number;
  className?: string;
  opacity?: number;
  speed?: number;
}

export default function RibbonBackground({
  angle = -34,
  className = "",
  opacity = 0.85,
  speed = 0.1,
}: RibbonBackgroundProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <WebThreads
        colors={["#5227FF", "#002fff"]}
        coreColor="#1453ff"
        threadCount={3}
        spread={0.18}
        lightMode={false}
        speed={speed}
        frequency={5}
        taper={1.3}
        position={0.5}
        pinch={0.5}
        nodes={1}
        angle={angle}
        glow={0.02}
        falloff={0.6}
        thickness={1.3}
        brightness={0.65}
        opacity={1}
        depth={0}
        pulses={0}
        mirror
        shimmer={false}
        fade={0}
        grain={0.065}
        intro={false}
        mouseInteraction
        mouseStrength={0.5}
        pulseOnClick
        paused={false}
      />
    </div>
  );
}
