import { useEffect, useRef } from "react";
import { playKeySound } from "../lib/sound";
import "./InteractiveKeyboard.css";

interface KeyDef {
  code?: string;
  macro?: string;
  className?: string;
  label?: string;
}

const ROW_1: KeyDef[] = [
  { code: "Escape", macro: "orange", className: "orange" },
  ..."1234567890".split("").map((n) => ({ code: `Digit${n}` })),
  { code: "Minus" },
  { code: "Equal" },
  { code: "Backspace", className: "size-4 grey stretch" },
  { macro: "red", className: "red" },
];

const ROW_2: KeyDef[] = [
  { code: "Tab", className: "size-2 grey stretch" },
  ..."QWERTYUIOP".split("").map((c) => ({ code: `Key${c}`, label: c })),
  { code: "BracketLeft" },
  { code: "BracketRight" },
  { code: "Backslash", className: "size-2 grey stretch" },
  { macro: "yellow", className: "yellow" },
];

const ROW_3: KeyDef[] = [
  { code: "CapsLock", className: "size-3 grey stretch" },
  ..."ASDFGHJKL".split("").map((c) => ({ code: `Key${c}`, label: c })),
  { code: "Semicolon" },
  { code: "Quote" },
  { code: "Enter", macro: "green:Enter", className: "size-5 green stretch" },
  { macro: "green", className: "green" },
];

const ROW_4: KeyDef[] = [
  { code: "ShiftLeft", macro: "yellow:ShiftLeft", className: "size-5 yellow stretch" },
  ..."ZXCVBNM".split("").map((c) => ({ code: `Key${c}`, label: c })),
  { code: "Comma" },
  { code: "Period" },
  { code: "Slash" },
  { code: "ShiftRight", macro: "yellow:ShiftRight", className: "size-3 yellow stretch" },
  { code: "ArrowUp", label: "↑" },
  { macro: "blue", className: "blue" },
];

const ROW_5: KeyDef[] = [
  { code: "ControlLeft", macro: "red:ControlLeft", className: "size-6 red" },
  { code: "MetaLeft", macro: "purple:MetaLeft", className: "size-6 purple" },
  { code: "AltLeft", macro: "blue:AltLeft", className: "size-6 blue" },
  { code: "Space", macro: "default:Space", className: "size-7 empty" },
  { code: "AltRight", macro: "blue:AltRight", className: "size-2 blue stretch" },
  { code: "ContextMenu", macro: "purple:ContextMenu", className: "size-2 purple stretch" },
  { code: "ArrowLeft", label: "←" },
  { code: "ArrowDown", label: "↓" },
  { code: "ArrowRight", label: "→" },
];

const ALL_ROWS: KeyDef[][] = [ROW_1, ROW_2, ROW_3, ROW_4, ROW_5];

function distSq(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  const d = distSq(x1, y1, x2, y2);
  return d === 0 ? 0 : Math.sqrt(d);
}

interface AnimatingWave {
  time: number;
  macro: string;
  color: string;
}

interface KeyElementWithMacro extends HTMLElement {
  _macroDistances?: Record<string, number>;
}

export default function InteractiveKeyboard() {
  const keyboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keyboard = keyboardRef.current;
    if (!keyboard) return;

    const rotation = { x: 20, y: -6 };
    const animating: AnimatingWave[] = [];
    const keysDown = new Set<number>();
    const keyCodeToEle = new Map<string, HTMLElement>();
    const allKeys = Array.from(keyboard.querySelectorAll<KeyElementWithMacro>(".key"));

    allKeys.forEach((ele) => {
      const code = ele.dataset.code;
      if (code) {
        keyCodeToEle.set(code, ele);
      }
    });

    const capsLockKeyIndex = allKeys.indexOf(keyCodeToEle.get("CapsLock") as KeyElementWithMacro);
    const arrowKeyIndexes = ["Up", "Left", "Down", "Right"].map((n) =>
      allKeys.indexOf(keyCodeToEle.get(`Arrow${n}`) as KeyElementWithMacro)
    );
    const macroKeys = Array.from(
      keyboard.querySelectorAll<KeyElementWithMacro>('[data-code="Escape"], [data-macro]')
    );
    const furthestKeys: Record<string, number> = {};

    // Precalculate distances for ripple effect
    const calculateDistances = () => {
      const allKeyBounds = allKeys.map((n) => n.getBoundingClientRect());
      for (const macro of macroKeys) {
        const index = allKeys.indexOf(macro);
        const color = macro.dataset.macro || "";
        furthestKeys[color] = 0;
        const macroBounds = allKeyBounds[index];
        if (!macroBounds) continue;

        for (let i = 0; i < allKeys.length; i++) {
          const ele = allKeys[i];
          if (macro === ele) continue;
          const eleBounds = allKeyBounds[i];
          if (!eleBounds) continue;

          const d = dist(
            macroBounds.x + macroBounds.width * 0.5,
            macroBounds.y + macroBounds.height * 0.5,
            eleBounds.x + eleBounds.width * 0.5,
            eleBounds.y + eleBounds.height * 0.5
          );

          ele._macroDistances = ele._macroDistances || {};
          ele._macroDistances[color] = d;
          if (d > furthestKeys[color]) {
            furthestKeys[color] = d;
          }
        }
      }
    };

    const initialRaf = requestAnimationFrame(calculateDistances);

    let rafId: number | null = null;

    const draw = (now: number) => {
      if (animating.length === 0) return;
      const actions: (boolean | string)[] = Array(allKeys.length).fill(false);
      keysDown.forEach((i) => {
        actions[i] = true;
      });

      const dilation = 90;
      for (let i = animating.length - 1; i >= 0; i--) {
        const a = animating[i];
        const time = now - a.time;
        const duration = (furthestKeys[a.macro] || 250) + dilation;
        if (time >= duration) {
          animating.splice(i, 1);
          continue;
        }

        for (let keyIndex = 0; keyIndex < allKeys.length; keyIndex++) {
          const key = allKeys[keyIndex];
          const d = key._macroDistances ? key._macroDistances[a.macro] ?? 0 : 0;
          const t = Math.abs(time - d);
          if (t < dilation && !actions[keyIndex]) {
            actions[keyIndex] = a.color;
          }
        }
      }

      for (let i = 0; i < allKeys.length; i++) {
        const key = allKeys[i];
        const action = actions[i];
        if (action) {
          key.dataset.selected = "true";
          if (typeof action === "string") {
            key.dataset.color = action;
          }
        } else {
          key.dataset.color = "";
          key.dataset.selected = "false";
        }
      }
    };

    const loop = (timestamp: number) => {
      draw(timestamp);
      if (animating.length > 0) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
        for (const ele of keyboard.querySelectorAll<HTMLElement>(
          '[data-selected="true"], [data-color]'
        )) {
          const index = allKeys.indexOf(ele as KeyElementWithMacro);
          if (!keysDown.has(index)) {
            ele.dataset.selected = "false";
            ele.dataset.color = "";
          }
        }
      }
    };

    const animateMacro = (ele: HTMLElement) => {
      const macro = ele.dataset.macro;
      if (!macro) return;
      const [color, id] = macro.split(":");
      if (!keysDown.has(capsLockKeyIndex)) {
        if (["Space", "ShiftLeft"].includes(id)) {
          return;
        }
      }

      animating.push({ time: performance.now(), macro, color: color || "green" });
      if (!rafId) {
        rafId = requestAnimationFrame(loop);
      }
    };

    // Click handler on keys
    const handleKeyClick = (ele: KeyElementWithMacro) => {
      playKeySound();
      if (ele.dataset.macro) {
        animateMacro(ele);
      } else {
        // Pulse key on click
        ele.dataset.selected = "true";
        setTimeout(() => {
          ele.dataset.selected = "false";
        }, 150);
      }
    };

    allKeys.forEach((ele) => {
      ele.addEventListener("click", () => handleKeyClick(ele));
    });

    const setKeyState = (code: string, state: boolean) => {
      const ele = keyCodeToEle.get(code);
      if (ele) {
        const index = allKeys.indexOf(ele as KeyElementWithMacro);
        if (state) {
          keysDown.add(index);
          ele.dataset.selected = "true";
        } else {
          ele.dataset.selected = "false";
          keysDown.delete(index);
          if (macroKeys.includes(ele as KeyElementWithMacro)) {
            animateMacro(ele);
          }
        }

        const [up, left, down, right] = arrowKeyIndexes.map((n) => keysDown.has(n));
        if (up) rotation.x += 1;
        if (left) rotation.y += -1;
        if (down) rotation.x += -1;
        if (right) rotation.y += 1;

        keyboard.style.setProperty("--rot-x", `${rotation.x}deg`);
        keyboard.style.setProperty("--rot-y", `${rotation.y}deg`);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code.startsWith("F") && !isNaN(Number(e.code.slice(1)))) {
        return;
      }
      playKeySound(e.repeat);
      // Do not block typing inside form inputs or textareas!
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") {
        setKeyState(e.code, true);
        return;
      }

      setKeyState("CapsLock", e.getModifierState("CapsLock"));
      if (e.code === "CapsLock") {
        return;
      }
      setKeyState(e.code, true);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      setKeyState("CapsLock", e.getModifierState("CapsLock"));
      if (e.code === "CapsLock") {
        return;
      }
      setKeyState(e.code, false);
    };

    const onBlur = () => {
      animating.length = 0;
      for (const ele of keyboard.querySelectorAll<HTMLElement>(
        '[data-selected="true"], [data-color]'
      )) {
        const index = allKeys.indexOf(ele as KeyElementWithMacro);
        if (index !== capsLockKeyIndex) {
          ele.dataset.selected = "false";
          ele.dataset.color = "";
          keysDown.delete(index);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      cancelAnimationFrame(initialRaf);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <div className="interactive-keyboard-container w-full overflow-visible flex items-center justify-center lg:justify-start">
      <div ref={keyboardRef} className="interactive-keyboard">
        {ALL_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="keyboard-row">
            {row.map((key, keyIdx) => (
              <div
                key={keyIdx}
                className={`key ${key.label ? "has-label" : ""} ${key.className || ""}`}
                data-code={key.code}
                data-macro={key.macro}
              >
                {key.label && <span className="key-char">{key.label}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
