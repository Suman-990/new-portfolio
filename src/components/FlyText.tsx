import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface FlyTextOptions {
  windAngle: number;
  windStrength: number;
  scatter: number;
  maxRotation: number;
  stagger: number;
  depth: number;
  reverse: boolean;
  order: "random" | "ltr" | "rtl" | "outward";
  randomness: number;
  gustiness: number;
  gustFrequency: number;
  gustPhaseSpread: number;
  startY: number | null;
  animationDuration: number;
  easing: string | null;
  mode: "both" | "scatter" | "reveal";
}

export interface FlyTextProps extends Partial<FlyTextOptions> {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";
}

const DEFAULTS: FlyTextOptions = {
  windAngle: 25,
  windStrength: 450,
  scatter: 85,
  maxRotation: 380,
  stagger: 0.5,
  depth: 130,
  reverse: false,
  order: "random",
  randomness: 0.15,
  gustiness: 0,
  gustFrequency: 1,
  gustPhaseSpread: 1,
  startY: null,
  animationDuration: 1,
  easing: null,
  mode: "both",
};

function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function seededRandom(seed: number) {
  let s = seed >>> 0;
  const splitmix32 = () => {
    s = (s + 0x9e3779b9) | 0;
    let t = s ^ (s >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return (t ^ (t >>> 15)) >>> 0;
  };
  const rand = sfc32(splitmix32(), splitmix32(), splitmix32(), splitmix32());
  for (let i = 0; i < 12; i++) rand();
  return rand;
}

const SEED = 42;

function buildStructure(el: HTMLElement, text: string) {
  if (getComputedStyle(el).position === "static") {
    el.style.position = "relative";
  }
  el.textContent = "";

  const srEl = document.createElement("span");
  srEl.className = "visually-hidden";
  srEl.style.cssText =
    "position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;";
  srEl.textContent = text;
  el.appendChild(srEl);

  const placeholder = document.createElement("span");
  placeholder.setAttribute("aria-hidden", "true");
  placeholder.style.cssText = "visibility:hidden; pointer-events:none; user-select:none;";
  placeholder.textContent = text;
  el.appendChild(placeholder);

  const overlay = document.createElement("span");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText =
    "position:absolute; top:0; left:0; width:100%; height:100%; overflow:visible; pointer-events:none;";
  el.appendChild(overlay);

  return { placeholder, overlay };
}

interface CharSpan extends HTMLSpanElement {
  _x: number;
  _normX: number;
}

function measureAndCreateChars(
  el: HTMLElement,
  raw: string,
  placeholder: HTMLElement,
  overlay: HTMLElement
): CharSpan[] {
  const containerRect = el.getBoundingClientRect();
  const textNode = placeholder.firstChild;
  if (!textNode) return [];

  const chars: CharSpan[] = [];

  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === " ") continue;

    const range = document.createRange();
    range.setStart(textNode, i);
    range.setEnd(textNode, i + 1);
    const r = range.getBoundingClientRect();

    const span = document.createElement("span") as CharSpan;
    span.textContent = raw[i];
    span.classList.add("fly-char");
    span.style.cssText = [
      "position:absolute",
      `left:${r.left - containerRect.left}px`,
      `top:${r.top - containerRect.top}px`,
      `width:${r.width}px`,
      `height:${r.height}px`,
      "white-space:nowrap",
      "will-change:transform,opacity",
    ].join(";");
    span._x = r.left - containerRect.left;
    span._normX = 0;
    overlay.appendChild(span);
    chars.push(span);
  }

  const xs = chars.map((c) => c._x);
  const xMin = Math.min(...xs);
  const xRange = Math.max(...xs) - xMin || 1;
  chars.forEach((c) => {
    c._normX = (c._x - xMin) / xRange;
  });

  return chars;
}

function charStartTime(
  char: CharSpan,
  total: number,
  order: string,
  stagger: number,
  randomness: number,
  r: () => number
) {
  if (total <= 1) return 0;
  const x = char._normX;
  let ordered: number;
  switch (order) {
    case "ltr":
      ordered = x * stagger;
      break;
    case "rtl":
      ordered = (1 - x) * stagger;
      break;
    case "outward":
      ordered = (1 - Math.abs(x - 0.5) * 2) * stagger;
      break;
    default:
      return r() * stagger;
  }
  return ordered * (1 - randomness) + r() * stagger * randomness;
}

function buildTimeline(
  el: HTMLElement,
  chars: CharSpan[],
  p: FlyTextOptions,
  r: () => number
) {
  const {
    reverse,
    windAngle,
    windStrength,
    scatter,
    maxRotation,
    depth,
    order,
    stagger,
    randomness,
    gustiness,
    gustFrequency,
    gustPhaseSpread,
    easing,
    mode,
  } = p;

  const tl = gsap.timeline({ paused: true });

  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1 });
    return tl;
  }

  const rad = (windAngle * Math.PI) / 180;
  const windX = Math.cos(rad);
  const windY = -Math.sin(rad);

  const perpX = Math.sin(rad);
  const perpY = Math.cos(rad);

  const randVal = (min: number, max: number) => min + r() * (max - min);
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const lerpVal = (a: number, b: number, t: number) => a + (b - a) * t;

  if (mode === "both") {
    // Bidirectional mode:
    // 0.00 -> 0.35: Enters from 3D scatter into assembled text (as you scroll down from hero into skills)
    // 0.35 -> 0.65: Stable resting state in full view
    // 0.65 -> 1.00: Scatters away in 3D breeze (as you scroll down past skills)
    chars.forEach((char) => {
      const enterStart = charStartTime(char, chars.length, order, 0.16, randomness, r);
      const exitStart = 0.62 + charStartTime(char, chars.length, order, 0.16, randomness, r);

      const scatterAngle1 = randVal(0, Math.PI * 2);
      const scatterDist1 = randVal(0, scatter);

      const enterFx = -windX * (windStrength * 0.85) + Math.cos(scatterAngle1) * scatterDist1;
      const enterFy = -windY * (windStrength * 0.85) + Math.sin(scatterAngle1) * scatterDist1;
      const enterFz = randVal(-depth, depth);
      const enterRx = randVal(-maxRotation, maxRotation);
      const enterRy = randVal(-maxRotation * 0.7, maxRotation * 0.7);
      const enterRz = randVal(-maxRotation * 0.3, maxRotation * 0.3);

      const scatterAngle2 = randVal(0, Math.PI * 2);
      const scatterDist2 = randVal(0, scatter);

      const exitFx = windX * windStrength + Math.cos(scatterAngle2) * scatterDist2;
      const exitFy = windY * windStrength + Math.sin(scatterAngle2) * scatterDist2;
      const exitFz = randVal(-depth, depth);
      const exitRx = randVal(-maxRotation, maxRotation);
      const exitRy = randVal(-maxRotation * 0.7, maxRotation * 0.7);
      const exitRz = randVal(-maxRotation * 0.3, maxRotation * 0.3);

      const scatteredEnter = {
        x: enterFx,
        y: enterFy,
        z: enterFz,
        rotationX: enterRx,
        rotationY: enterRy,
        rotationZ: enterRz,
        opacity: 0,
      };

      const natural = {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        opacity: 1,
      };

      const scatteredExit = {
        x: exitFx,
        y: exitFy,
        z: exitFz,
        rotationX: exitRx,
        rotationY: exitRy,
        rotationZ: exitRz,
        opacity: 0,
      };

      // Entrance tween (flying in from scatter to form words)
      tl.fromTo(
        char,
        scatteredEnter,
        {
          ...natural,
          duration: 0.22,
          ease: easing ?? "power2.out",
        },
        enterStart
      );

      // Exit tween (scattering away as user scrolls past)
      tl.to(
        char,
        {
          ...scatteredExit,
          duration: 0.22,
          ease: easing ?? "power2.in",
        },
        exitStart
      );
    });

    return tl;
  }

  // Single-direction mode (scatter or reveal)
  const sharedAmp =
    gustiness > 0 ? randVal(0.1, 1.0) * gustiness * (r() > 0.5 ? 1 : -1) : 0;

  const isReverse = mode === "reveal" || reverse;

  chars.forEach((char, i) => {
    const startTime = charStartTime(char, chars.length, order, stagger, randomness, r);
    const duration = randVal(1 - randomness * 0.5, 1 + randomness * 0.5);
    const scatterAngle = randVal(0, Math.PI * 2);
    const scatterDist = randVal(0, scatter);

    const syncPhase = Math.PI * gustFrequency * startTime;
    const indexPhase = (i / Math.max(1, chars.length - 1)) * Math.PI * 2;
    const phase = lerpVal(syncPhase, indexPhase, gustPhaseSpread);

    const fx = windX * windStrength + Math.cos(scatterAngle) * scatterDist;
    const fy = windY * windStrength + Math.sin(scatterAngle) * scatterDist;
    const fz = randVal(-depth, depth);
    const rx = randVal(-maxRotation, maxRotation);
    const ry = randVal(-maxRotation * 0.7, maxRotation * 0.7);
    const rz = randVal(-maxRotation * 0.3, maxRotation * 0.3);

    const scattered = {
      x: fx,
      y: fy,
      z: fz,
      rotationX: rx,
      rotationY: ry,
      rotationZ: rz,
      opacity: 0,
    };
    const natural = {
      x: 0,
      y: 0,
      z: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      opacity: 1,
    };

    if (gustiness > 0) {
      const individualAmp = randVal(0.1, 1.0) * gustiness * (r() > 0.5 ? 1 : -1);
      const amp = lerpVal(sharedAmp, individualAmp, gustPhaseSpread);

      const s0 = Math.sin(phase);
      const s1 = Math.sin(Math.PI * gustFrequency + phase);
      const gustSine = (t: number) =>
        amp * (Math.sin(Math.PI * gustFrequency * t + phase) - s0 - t * (s1 - s0));

      const sineAt = (t: number) => {
        const s = isReverse ? 1 - t : t;
        return {
          x: s * fx + perpX * gustSine(t),
          y: s * fy + perpY * gustSine(t),
          z: s * fz,
          rotationX: rx * s,
          rotationY: ry * s,
          rotationZ: rz * s,
          opacity: clamp01((1 - s) / 0.6),
        };
      };

      gsap.set(char, sineAt(0));

      const proxy = { t: 0 };
      tl.to(
        proxy,
        {
          t: 1,
          duration,
          ease: easing ? easing : "power3.in",
          immediateRender: true,
          onUpdate() {
            gsap.set(char, sineAt(proxy.t));
          },
        },
        startTime
      );
    } else {
      const [from, to] = isReverse ? [scattered, natural] : [natural, scattered];
      tl.fromTo(
        char,
        from,
        {
          ...to,
          duration,
          ease: easing ?? (isReverse ? "power3.out" : "power3.in"),
        },
        startTime
      );
    }
  });

  const animDuration = p.animationDuration;
  if (animDuration > 0 && animDuration < 1) {
    tl.call(() => {}, [], tl.duration() / animDuration);
  }

  return tl;
}

export default function FlyText({
  children,
  className = "",
  as = "p",
  ...props
}: FlyTextProps) {
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let st: ScrollTrigger | null = null;
    let tl: gsap.core.Timeline | null = null;
    let ro: ResizeObserver | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const mergedProps: FlyTextOptions = {
      ...DEFAULTS,
      ...props,
    };

    const raw = children.replace(/\s+/g, " ").trim();
    const { placeholder, overlay } = buildStructure(el, raw);

    const setup = () => {
      if (st) st.kill();
      if (tl) tl.kill();

      overlay.innerHTML = "";
      const chars = measureAndCreateChars(el, raw, placeholder, overlay);
      if (!chars.length) return;

      const r = seededRandom(SEED);

      gsap.set(chars, { transformPerspective: 500 });
      tl = buildTimeline(el, chars, mergedProps, r);

      const { mode, startY, reverse } = mergedProps;

      if (mode === "both") {
        st = ScrollTrigger.create({
          trigger: el,
          start: "top 95%",
          end: "bottom 5%",
          scrub: 1,
          animation: tl,
        });
      } else {
        const startPct = Math.round(((startY as number | null) ?? (reverse ? 0.85 : 0.65)) * 100);
        st = ScrollTrigger.create({
          trigger: el,
          start: `top ${startPct}%`,
          end: reverse ? "top 20%" : "bottom top",
          scrub: 1,
          animation: tl,
        });
      }
    };

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(setup);
    } else {
      setup();
    }

    let lastW = 0;
    let lastH = 0;
    ro = new ResizeObserver(([entry]) => {
      const { inlineSize: w, blockSize: h } = entry.contentBoxSize[0];
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 200);
    });
    ro.observe(el);

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      if (ro) ro.disconnect();
      if (st) st.kill();
      if (tl) tl.kill();
    };
  }, [children, props]);

  const Tag = as;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={elRef as any} className={`fly-text ${className}`}>
      {children}
    </Tag>
  );
}
